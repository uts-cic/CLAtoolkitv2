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


const getDbUser = async (usrEmail: string) => {
  return User.findOne({ email: usrEmail }).exec();
};

const createUnitFromData = (user: any, unit: any, social_media: any, lrs: any) => {
	const unitPlatforms = [];

	// Build unit platforms for unitmodel
	for (const mediaKey in social_media) {
		if (social_media[mediaKey] != false) {
			const unit_platform: UnitPlatform = {
				platform: mediaKey
			};

			// Twitter hashtag/Facebook group id/Youtube Channel id, etc
			if (typeof social_media[mediaKey] == "string") {
				unit_platform["retrieval_param"] = social_media[mediaKey];
			}

			unitPlatforms.push(unit_platform);
		}
	}

	// Check LRS 
	if ("default" in lrs) {
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
};

/**
 * GET Unit/:id
 * Returns a Unit (by id) to Frontend as JSON
 */
export let getUnitById = async (req: Request, res: Response) => {
	const unitId = req.params.id;

	Unit.findById(unitId, (err, unit) => {
		if (err) { return res.status(400).json({ error: err }); }

		return res.status(200).json({ unit: unit });
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
	const lrs = req.body.lrs;

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
	});
};

/**
 * POST userSignUp
 * Endpoint for users/student sign-up to a specific class
 * 
 */
export let postSignUp = async (req: Request, res: Response) => {
	const user = await getDbUser(req.user.email);
	const unitId = req.body.unitId;
	const userPlatforms = req.body.userPlatforms;

	// Check that user is not already in the unit
	Unit.findById(unitId, (err: any, unit: UnitModel) => {
		if (err) { return res.status(400).json({ error: err }); }

		if (!unit) { return res.status(400).json({error: "Unit does not exist."}); }

		if (unit.users.indexOf(user._id) > -1) {
			return res.status(400).json({error: "User already signed up to unit."});
		}

		unit.users.push(user._id);
		
		// Add user Platform information to UnitUserPlatform collection in mongodb
		// We don't add this to Unit because of potientially sensetive information (social media IDs)
		// And Units are sent to frontend where anyone technically inclined could 
		// read that information

		for (const key in userPlatforms) {
			const platform = userPlatforms[key];
			// Create Userplatform record
			const userPlatform = new UnitUserPlatform({
				platform: platform.platform,
				platformIdentifier: platform.identifier,
				belongsTo: user._id
			});

			// Save userplatform record and save ID to unit.attached_user_platforms for reference
			userPlatform.save((err, savedUserPlatform) => {
				unit.attached_user_platforms.push(savedUserPlatform._id);
			});
		}

		// Update the Unit
		unit.save((err) => {
			if (err) { return res.status(400).json({error: err}); }

			return res.status(200).json({success: true});
		});


	});
};




