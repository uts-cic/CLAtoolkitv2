import * as async from "async";
import * as crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { WriteError } from "mongodb";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import { LocalStrategyInfo } from "passport-local";
import { AuthToken, default as User, UserModel } from "../models/User";

import { default as Unit, UnitModel, UnitPlatform } from "../models/Unit";

let getDbUser = async (usrEmail: string) => {
  return User.findOne({ email: usrEmail }).exec();
}

let createUnitFromData = (user: any, unit: any, social_media: any, lrs: any) => {
	const unitPlatforms = [];

	// Build unit platforms for unitmodel
	for (let mediaKey in social_media) {
		if (social_media[mediaKey] != false) {
			let unit_platform: UnitPlatform = {
				platform: mediaKey
			}

			// Twitter hashtag/Facebook group id/Youtube Channel id, etc
			if (typeof social_media[mediaKey] == "string") {
				unit_platform['retrieval_param'] = social_media[mediaKey];
			}

			unitPlatforms.push(unit_platform);
		}
	}

	// Check LRS 
	if ('default' in lrs) {
		// get lrs id from DB (need to setup models)
		// for now.. a placeholder
		lrs = "5b5e9879ec90179bb2a70a15";
	} else {
		// Custom lrs..
		// create and insert into db, get id
	}

	return new Unit({
		name: unit.name,
		code: unit.code,
		semester: unit.semester,
		description: unit.description,
		ethics_statement: unit.ethicsStatement,

		start_date: unit.startDate,
		end_date: unit.endDate,

		users: [],
		enabled: true,

		platforms: unitPlatforms,

		attached_user_platforms: [],

		lrs: lrs,

		created_by: user._id
	});
}

/**
 * POST Units
 * Endpoint to create a new Unit
 */
export let postUnit = async (req: Request, res: Response) => {
	const user = await getDbUser(req.user.email);
	const unit = req.body.unit;
	const social_media = req.body.social_media;
	const lrs = req.body.lrs

	// Check to see if a unit of the same name exists already before anything
	Unit.find({ name: unit.name }, (err, alreadyExists) => {
		if (alreadyExists.length > 0) {
			console.log("ALREADY EXISTS: ", alreadyExists);
			return res.status(400).json({ error: "Unit titled: " + unit.name + " already exists."});
		}

		const unitObj = createUnitFromData(user, unit, social_media, lrs);

		Unit.create(unitObj, (err: any, unit: any) => {
			if (err) { return res.status(400).json({ error: err }); }

			return res.status(200).json({ success: true });
		});
	})
}





