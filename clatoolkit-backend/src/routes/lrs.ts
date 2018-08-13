import { NextFunction, Request, Response, Router } from "express";

import * as Auth from "../config/jwtAuth.middleware";

import * as lrsController from "../controllers/lrs";

class Lrs {
  public router: Router;
  public constructor() {
    this.router = Router();
    this.init();
  }
  private init() {
    this.router.get("/", Auth.JwtAuthorized, lrsController.getLearningRecordStores);
    // this.router.get("/units", Auth.JwtAuthorized, userController.getUnits);

  }
}

const lrsRoutes = new Lrs();
export default lrsRoutes.router;
