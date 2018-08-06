import { NextFunction, Request, Response, Router } from "express";

import * as passport from "passport";

import * as apiController from "../controllers/api";

import * as Auth from "../config/jwtAuth.middleware";

import * as passportConfig from "../config/passport";
class Oauth {
  public router: Router;
  public constructor() {
    this.router = Router();
    this.init();
  }
  private init() {
    this.router.get("/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
    this.router.get("/facebook/callback",
      passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
        res.redirect(req.session.returnTo || "/");
      });

    this.router.get("/trello", Auth.JwtAuthorized, passport.authenticate("trello"));
    this.router.get("/trello/callback", passport.authenticate("trello"), (req: Request, res: Response) => {
      // console.log("TRELLO CALLBACK: ", req);
      const returnURL = req.session.clatkReturnTo;
      delete req.session.clatkReturnTo;

      res.redirect(returnURL);
    });
    this.router.get("/trello/boards", Auth.JwtAuthorized, apiController.getTrelloBoards);
  

  }
}

const oauthRoutes = new Oauth();
export default oauthRoutes.router;
