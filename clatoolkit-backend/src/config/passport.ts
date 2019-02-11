import * as _ from "lodash";
import * as passport from "passport";
import * as passportFacebook from "passport-facebook";
import * as passportLocal from "passport-local";
import * as request from "request";

// import { User, UserType } from '../models/User';
import { NextFunction, Request, Response } from "express";
import { default as User, AuthToken } from "../models/User";

// Strategy Imports
import * as passportTrello from "passport-trello";
import * as passportSlack from "passport-slack";
import * as passportGithub from "passport-github2";
import * as passportTwitter from "passport-twitter";


const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const TrelloStrategy = passportTrello.Strategy;
const SlackStrategy = passportSlack.Strategy;
const GithubStrategy = passportGithub.Strategy;
const TwitterStrategy = passportTwitter.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


// TODO: SAVE USER SOCIAL MEDIA ID TO USER PROFILE (complete - line 55)
const processSocial = (provider: any, accessToken: any, refreshOrSecretToken: any, profile: any, done: any, req: any) => {
    // All Passport social login libraries MUST return request to match users to social media tokens
    // A user MUST also exist in the toolkit in order to match users with their social tokens
    // In the future, users might be able to sign-up/login using their social media accounts
    // But this is beyond the scope of the project at the moment.

  // Social signup, user saved to session
  const userParam = req.session.user.email;
  delete req.session.user;

  User.findOne({ email: userParam }, (err, existingUser) => {
    if (err) { return done(err); }

    if (existingUser) {
       const token: AuthToken = {
         accessToken: accessToken,
         accessSecret: refreshOrSecretToken,
         platform: provider
       };

       // Add Social Media profile id to user account
       // console.log("existingUser.profile.socialMediaUserIds: ", existingUser.profile.socialMediaUserIds);
       if (existingUser.profile.socialMediaUserIds == undefined) {
         existingUser.profile.socialMediaUserIds = {};
       }

       existingUser.profile.socialMediaUserIds[provider] = profile.id;

       // Add Users social media auth token to list of auth tokens on user account
       existingUser.tokens = existingUser.tokens.concat([token]);

       // Mongoose requires that you explicitly state that a nested object as been modified in a record.
       existingUser.markModified("profile");
       existingUser.save((err: Error) => {
         if (err) { done(err); }

         return done(err, existingUser);
       });
    } else {
      return done("User " + req.user.email + " does not exist in toolkit.");
    }
  });

}; 

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */

export const setupStrategies = (passport: any) => {


  passport.use(new FacebookStrategy({
    callbackURL: "/auth/facebook/callback",
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    passReqToCallback: true,
    profileFields: ["name", "email", "link", "locale", "timezone"],
  }, (req: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
    if (req.user) {
      User.findOne({ facebook: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          req.flash("errors", { msg: "There is already a Facebook account that belongs to you. \
          Sign in with that account or delete it, then link it with your current account." });
          done(err);
        } else {
          User.findById(req.user.id, (err, user: any) => {
            if (err) { return done(err); }
            user.facebook = profile.id;
            user.tokens.push({ kind: "facebook", accessToken });
            user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
            user.profile.gender = user.profile.gender || profile._json.gender;
            user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
            user.save((err: Error) => {
              req.flash("info", { msg: "Facebook account has been linked." });
              done(err, user);
            });
          });
        }
      });
    } else {
      User.findOne({ facebook: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          return done(undefined, existingUser);
        }
        User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
          if (err) { return done(err); }
          if (existingEmailUser) {
            req.flash("errors", {
              msg: "There is already an account using this email address. \
              Sign in to that account and link it with Facebook manually from Account Settings." });
            done(err);
          } else {
            const user: any = new User();
            user.email = profile._json.email;
            user.facebook = profile.id;
            user.tokens.push({ kind: "facebook", accessToken });
            user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
            user.profile.gender = profile._json.gender;
            user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            user.profile.location = (profile._json.location) ? profile._json.location.name : "";
            user.save((err: Error) => {
              done(err, user);
            });
          }
        });
      });
    }
  }));


  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/social/twitter/callback",
    passReqToCallback: true
  }, (req: any, token: any, tokenSecret: any, profile: any, cb: any) => {
    processSocial("twitter", token, tokenSecret, profile, cb, req);
  }));
  
  /**
   * Trello Sign In
   * Retrieves and saves trello credentials for a user, for clatoolkit data scraping later via importers
   * (user access token)
   */
  if (process.env.TRELLO_APP_ID && process.env.TRELLO_APP_SECRET) {
  //  console.log("USING TRELLO AUTH STRATEGY");
    passport.use(new TrelloStrategy({
      consumerKey: process.env.TRELLO_APP_ID,
      consumerSecret: process.env.TRELLO_APP_SECRET,
      callbackURL: "/social/trello/callback",
      passReqToCallback: true,
      trelloParams: {
        scope: "read,write",
        name: process.env.TRELLO_APP_NAME,
        expiration: "never"
      }}, (req: any, token: any, tokenSecret: any, profile: any, cb: any) => {
        processSocial("trello", token, tokenSecret, profile, cb, req);
    }));
  }

  /**
   * Slack Sign In
   * Retrieves and saves slack credentials for user, for clatoolkit data scraping later
   */
  if (process.env.SLACK_APP_ID && process.env.SLACK_APP_SECRET) {
    passport.use(new SlackStrategy({
      clientID: process.env.SLACK_APP_ID,
      clientSecret: process.env.SLACK_APP_SECRET,
      callbackURL: "/social/slack/callback",
      passReqToCallback: true,
      skipUserProfile: false,
      scope: /*["identity.basic", "channels:read", "channels:history", "files:read", "dnd:read", "groups:read", "groups:history",
               "im:history", "im:read", "pins:read", "reactions:read", "reminders:read", "search:read",
               "team:read", "stars:read"]*/
               ["users.profile:read", "channels:read", "channels:history", "files:read", "dnd:read", "groups:read", "groups:history",
               "im:history", "im:read", "pins:read", "reactions:read", "reminders:read", "search:read",
               "team:read", "stars:read"]
    }, (req: any, accessToken: any, refreshToken: any, profile: any, cb: any) => {
      console.log("USER PROFILE: ",  profile);
      processSocial("slack", accessToken, refreshToken, profile, cb, req);
    }));
  }

  /**
   * Github Sign In
   * Retrieves and saves github credentials for user, for clatoolkit data scraping later
   */
  if (process.env.GITHUB_APP_ID && process.env.GITHUB_APP_SECRET) {
    passport.use(new GithubStrategy({
      clientID: process.env.GITHUB_APP_ID,
      clientSecret: process.env.GITHUB_APP_SECRET,
      callbackURL: "/social/github/callback",
      passReqToCallback: true,
    }, (req: any, accessToken: any, refreshToken: any, profile: any, cb: any) => {
      processSocial("github", accessToken, refreshToken, profile, cb, req);
    }));
  }
};


/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.path.split("/").slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};



/**
 * Sign in using Email and Password.
 *

 TODO: Implement 
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
    if (err) { return done(err); }
    if (!user) {
      return done(undefined, false, { message: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: "Invalid email or password." });
    });
  });
}));*/