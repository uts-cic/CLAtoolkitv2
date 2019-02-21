import * as async from "async";
import * as crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { WriteError } from "mongodb";
import * as passport from "passport";
import { LocalStrategyInfo } from "passport-local";
import { AuthToken, default as User, UserModel } from "../models/User";

import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const AAF_SECRET = process.env.AAF_SECRET;

const FRONTEND_URL = process.env.CLATK_FRONTEND;

export let postAAFLogin = (req: Request, res: Response) => {
  const jwt_aud = process.env.JWT_AUD;
  //  console.log("JWT : ", req.body.assertion);
  const aafTokenDecoded: any = jwt.verify(req.body.assertion, AAF_SECRET, { audience: jwt_aud });

  User.findOne({ email: aafTokenDecoded.email }, (err, userDoc) => {
    if (err) { console.error("Error signing in user via AAF: ", err); }

    if (userDoc) {
      const frontEndUser = {
        id: userDoc._id,
        email: userDoc.email
      };

      const token = jwt.sign(frontEndUser, JWT_SECRET);

      return res.redirect(FRONTEND_URL + "?user=" + token);

    }
  });
};

/**
 * POST /tokenCheck
 * Returns true/false if user has a Social media token for specified platform
 */
export let postUserSocialTokenExists = (req: Request, res: Response) => {
  const platformToCheck = req.body.platform;

  User.findOne({ email: req.user.email }, (err, userDoc) => {
    if (err) { return res.status(400).json({ error: err}); }

    if (userDoc) {                // Array<Object: { platform: string }>.some returns true if object.platform == platformToCheck
      return res.status(200).json({ exists: userDoc.tokens.some(e => e.platform == platformToCheck) });
    } else {
      return res.status(400).json({ error: "User not found" });
    }
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
export let postLogin = (req: Request, res: Response) => {
  const formData = req.body.form;

  User.findOne({ email: formData.email }, (err, userDoc) => {
    if (err) { return res.status(400).json({ error: err }); }

    if (userDoc) {
      userDoc.comparePassword(formData.password, (err, match) => {
        if (err) { return res.status(400).json({ error: err}); }

        if (match) {
          const frontEndUser = {
            id: userDoc._id,
            email: userDoc.email
          };

          const token = jwt.sign(frontEndUser, JWT_SECRET);

          return res.status(200).json({ token: token });
        }

        return res.status(401).json({ error: "Incorrect Login."});
      });
    }
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
export let postSignup = (req: Request, res: Response, next: NextFunction) => {
  const formData = req.body.form;

  const user = new User({
    email: formData.email,
    password: formData.password,
  });

  User.findOne({ email: formData.email }, (err, existingUser) => {
    if (err) { return res.status(400).json({ error: err }); }
    if (existingUser) {
      return res.status(400).json({error: "User already exists"});
    }
    user.save((err) => {
      if (err) { return res.status(400).json({ error: err }); }

      // Create and return jwt 
      const frontEndUser = {
        id: user._id,
        email: user.email
      };
      
      const token = jwt.sign(frontEndUser, JWT_SECRET);
      return res.status(200).json({ token: token });
    });
  });
};


/**
 * POST /account/password
 * Update current password.
 *
export let postUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
  req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/account");
  }

  User.findById(req.user.id, (err, user: UserModel) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err: WriteError) => {
      if (err) { return next(err); }
      req.flash("success", { msg: "Password has been changed." });
      res.redirect("/account");
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 *
export let postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash("info", { msg: "Your account has been deleted." });
    res.redirect("/");
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 *
export let getOauthUnlink = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user: any) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
    user.save((err: WriteError) => {
      if (err) { return next(err); }
      req.flash("info", { msg: `${provider} account has been unlinked.` });
      res.redirect("/account");
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 *
export let getReset = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where("passwordResetExpires").gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash("errors", { msg: "Password reset token is invalid or has expired." });
        return res.redirect("/forgot");
      }
      res.render("account/reset", {
        title: "Password Reset",
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 *
export let postReset = (req: Request, res: Response, next: NextFunction) => {
  req.assert("password", "Password must be at least 4 characters long.").len({ min: 4 });
  req.assert("confirm", "Passwords must match.").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("back");
  }

  async.waterfall([
    // tslint:disable-next-line:ban-types
    function resetPassword(done: Function) {
      User
        .findOne({ passwordResetToken: req.params.token })
        .where("passwordResetExpires").gt(Date.now())
        .exec((err, user: any) => {
          if (err) { return next(err); }
          if (!user) {
            req.flash("errors", { msg: "Password reset token is invalid or has expired." });
            return res.redirect("back");
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((err: WriteError) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
              done(err, user);
            });
          });
        });
    },
    // tslint:disable-next-line:ban-types
    function sendResetPasswordEmail(user: UserModel, done: Function) {
      const transporter = nodemailer.createTransport({
        auth: {
          pass: process.env.SENDGRID_PASSWORD,
          user: process.env.SENDGRID_USER,
        },
        service: "SendGrid",
      });
      const mailOptions = {
        from: "express-ts@starter.com",
        subject: "Your password has been changed",
        text: `Hello,\n\nThis is a confirmation that the password for \
        your account ${user.email} has just been changed.\n`,
        to: user.email,
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash("success", { msg: "Success! Your password has been changed." });
        done(err);
      });
    },
  ], (err) => {
    if (err) { return next(err); }
    res.redirect("/");
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 *
export let getForgot = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("account/forgot", {
    title: "Forgot Password",
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 *
export let postForgot = (req: Request, res: Response, next: NextFunction) => {
  req.assert("email", "Please enter a valid email address.").isEmail();
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/forgot");
  }

  async.waterfall([
    // tslint:disable-next-line:ban-types
    function createRandomToken(done: Function) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString("hex");
        done(err, token);
      });
    },
    // tslint:disable-next-line:ban-types
    function setRandomToken(token: AuthToken, done: Function) {
      User.findOne({ email: req.body.email }, (err, user: any) => {
        if (err) { return done(err); }
        if (!user) {
          req.flash("errors", { msg: "Account with that email address does not exist." });
          return res.redirect("/forgot");
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save((err: WriteError) => {
          done(err, token, user);
        });
      });
    },
    // tslint:disable-next-line:ban-types
    function sendForgotPasswordEmail(token: AuthToken, user: UserModel, done: Function) {
      const transporter = nodemailer.createTransport({
        auth: {
          pass: process.env.SENDGRID_PASSWORD,
          user: process.env.SENDGRID_USER,
        },
        service: "SendGrid",
      });
      const mailOptions = {
        from: "hackathon@starter.com",
        subject: "Reset your password on Hackathon Starter",
        text: `You are receiving this email because you (or someone else) \
        have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        to: user.email,
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash("info", { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
        done(err);
      });
    },
  ], (err) => {
    if (err) { return next(err); }
    res.redirect("/forgot");
  });
};*/
