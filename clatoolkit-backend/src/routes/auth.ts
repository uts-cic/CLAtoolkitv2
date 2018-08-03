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
    /*
    this.router.get("/", passportConfig.isAuthenticated, userController.getAccount);
    this.router.post("/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
    this.router.post("/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
    this.router.post("/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
    this.router.get("/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);*/
  }
}

const accountRoutes = new Account();
export default accountRoutes.router;
