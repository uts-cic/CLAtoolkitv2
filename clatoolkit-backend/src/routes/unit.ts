import { NextFunction, Request, Response, Router } from "express";

import * as Auth from "../config/jwtAuth.middleware";

import * as unitController from "../controllers/unit";

class Unit {
  public router: Router;
  public constructor() {
    this.router = Router();
    this.init();
  }
  private init() {
    this.router.post("/", Auth.JwtAuthorized, unitController.postUnit);
    this.router.get("/:id", Auth.JwtAuthorized, unitController.getUnitById);
    this.router.post("/:id", Auth.JwtAuthorized, unitController.updateUnit);
    this.router.post("/:id/register", Auth.JwtAuthorized, unitController.postSignUp);
    this.router.get("/:id/import", Auth.JwtAuthorized, unitController.importNow);
    // this.router.get("/units", Auth.JwtAuthorized, userController.getUnits);

  }
}

const unitRoutes = new Unit();
export default unitRoutes.router;
