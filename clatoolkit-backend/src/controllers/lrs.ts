import * as async from "async";
import * as crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { WriteError } from "mongodb";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import { LocalStrategyInfo } from "passport-local";
import { AuthToken, default as User, UserModel } from "../models/User";

import { default as Unit, UnitModel, UnitPlatform } from "../models/Unit";
import { default as UnitUserPlatform, UnitUserPlatformModel } from "../models/UnitUserPlatform";
import { default as Lrs, LrsModel } from "../models/LearningRecordStore";


const getDbUser = async (usrEmail: string) => {
  return User.findOne({ email: usrEmail }).exec();
};

/**
 * GET /lrs/
 * Returns LRS's created by a user, as well as the clatoolkit default lrs
 * in frontend format
 * { defaultLRS: default, customLRS: [..useraddedlrs's ] }
 * !!!Does not return Ids or auth details!!!
 */
export let getLearningRecordStores = async (req: Request, res: Response) => {
	const user = await getDbUser(req.user.email);
	const lrsResponse: { [key: string ]: any} = {};

	await Lrs.findOne({ type: "default"}, (err, defaultLrs: LrsModel) => {
		if (err) { console.error("GET /lrs/, error finding default LRS: ", err); }

		lrsResponse["defaultLRS"] = {
			name: "Clatoolkit Default LRS",
			endpoint: defaultLrs.host
		};

	});

	lrsResponse["customLRS"] = [];
	await Lrs.find({ belongsTo: user._id }, (err, userLrsList) => {
		if (err) { return res.status(500).json({ error: err }); }

		console.log("GOT USER LRS: ", userLrsList);

		for (const lrs of userLrsList) {
			const lrsData: { [key: string]: any} = {};
			lrsData["id"] = lrs._id;
			lrsData["name"] = lrs.name;
			lrsData["endpoint"] = lrs.host;
			lrsResponse["customLRS"].push(lrsData);
		}

		console.log("USER LRS, RETURNING: ", lrsResponse);

		return res.status(200).json(lrsResponse);

	});
};





