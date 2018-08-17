/**
 * Module dependencies.
 */
import * as bodyParser from "body-parser";
import * as compression from "compression";  // compresses requests
import * as mongo from "connect-mongo"; // (session)
import * as dotenv from "dotenv";
import * as errorHandler from "errorhandler";
import * as express from "express";
import * as flash from "express-flash";
import * as session from "express-session";
import * as lusca from "lusca";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import * as passport from "passport";
import * as path from "path";
import expressValidator = require("express-validator");

import { default as LRS, LrsModel } from "./models/LearningRecordStore";

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env.example" });

/**
 * Routes
 */
import accountRouter from "./routes/account";
import apiRouter from "./routes/api";
import oauthRouter from "./routes/oauth";
import authRouter from "./routes/auth";
import unitRouter from "./routes/unit";
import lrsRouter from "./routes/lrs";


/**
 * API keys and Passport configuration.
 */
import * as passportConfig from "./config/passport";
class App {

  // ref to Express instance
  public express: express.Application;
  private readonly MongoStore = mongo(session);

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.launchConf();

  }
  private middleware(): void {
    this.express.set("port", process.env.PORT || 3000);
    this.express.use(compression());
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(expressValidator()); // Might not need this
    this.express.use(session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: new this.MongoStore({
        autoReconnect: true,
        url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
      }),
    }));
    this.express.use(passport.initialize());
    // this.express.use(passport.session());
    // this.express.use(flash());
    // this.express.use(lusca.xframe("SAMEORIGIN"));
    this.express.use(lusca.xssProtection(true));
    this.express.use((req, res, next) => {
      res.locals.user = req.user;
      next();
    });
    this.express.use((req, res, next) => {
      // After successful login, redirect back to the intended page
      if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
      } else if (req.user &&
        req.path === "/account") {
        req.session.returnTo = req.path;
      }
      next();
    });
    this.express.use((req, res, next) => { // Enable CORS
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.set("Access-Control-Allow-Headers", "Content-Type,Origin,X-Requested-With,Accept,Authorization");
      next();
    });
    // this.express.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));
  }
  /**
   * Primary app routes.
   */
  private routes(): void {
    this.express.use("/units", unitRouter);
    this.express.use("/auth", authRouter);
    this.express.use("/api", apiRouter);
    this.express.use("/social", oauthRouter);
    this.express.use("/account", accountRouter);
    this.express.use("/lrs", lrsRouter);
  }

  private launchConf() {
    // mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

    mongoose.connection.on("error", () => {
      // tslint:disable-next-line:no-console
      console.log("MongoDB connection error. Please make sure MongoDB is running.");
      process.exit();
    });

    // Add default LRS on startup if it doesnt exist
    mongoose.connection.once("open", () => {
      LRS.findOne({ type: "default" }, (err, defaultLrs) => {
        if (err) { console.error("SERVER STARTUP: Error looking for default lrs: ", err); }
        if (!defaultLrs) {
          const lrsType = process.env.DEFAULT_LRS_AUTH_TYPE;
          let token;
          const configObj = {
            basic_auth: {
              key: <any>undefined,
              secret: <any>undefined,
              enabled: false
            },
            token: {
              enabled: false
            }
          };

          if (lrsType == "basic") {
            configObj.basic_auth.key = process.env.DEFAULT_LRS_AUTH_USERNAME;
            configObj.basic_auth.secret = process.env.DEFAULT_LRS_AUTH_SECRET;
            configObj.basic_auth.enabled = true;
            token =  Buffer.from(process.env.DEFAULT_LRS_AUTH_USERNAME + ":" + process.env.DEFAULT_LRS_AUTH_SECRET).toString("base64");
          } else if (lrsType == "token") {
            configObj.token.enabled = true;
            token = process.env.DEFAULT_LRS_AUTH_SECRET;
          }
            

          const defaultLrs = {
            name: "CLAtoolkit Default LRS",
            token: token,
            host: process.env.DEFAULT_LRS_XAPI_URL,
            config: configObj,
            belongsTo: <any>undefined,
            type: "default"
          };

          LRS.create(defaultLrs, (err: any, result: any) => {
            if (err) { console.error("SERVER STARTUP: Error creating default lrs: ", err ); }
          });
        }
      });
    });

    this.express.use(errorHandler());

    /**
     * Start Express server.
     */
    this.express.listen(this.express.get("port"), () => {
      // tslint:disable-next-line:no-console
      console.log(("  App is running at http://localhost:%d \
      in %s mode"), this.express.get("port"), this.express.get("env"));
      // tslint:disable-next-line:no-console
      console.log("  Press CTRL-C to stop\n");

      // tslint:disable-next-line:no-console
      console.log("GOT ENVVARS: ", process.env);

    });
  }
}

export default new App().express;
