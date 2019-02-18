import { NextFunction, Request, Response, Router } from "express";

import * as authController from "../controllers/auth";

import * as passportConfig from "../config/passport";

import * as Auth from "../config/jwtAuth.middleware";

class Account {
  public router: Router;
  public constructor() {
    this.router = Router();
    this.init();
  }
  private init() {
    this.router.post("/login", authController.postLogin);
    this.router.post("/register", authController.postSignup);
    this.router.post("/tokenCheck", Auth.JwtAuthorized, authController.postUserSocialTokenExists);
    this.router.post("/jwt", authController.postAAFLogin);
  }
}

const accountRoutes = new Account();
export default accountRoutes.router;
