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
import { default as Lrs, LrsModel, CreateLrsFromData } from "../models/LearningRecordStore";


const getDbUser = async (usrEmail: string) => {
  return User.findOne({ email: usrEmail }).exec();
};

const createUnitFromData = async (user: any, unit: any, social_media: any, lrs: any) => {
	const unitPlatforms: any = [];

	// Build unit platforms for unitmodel
	for (const mediaKey in social_media) {
		if (social_media[mediaKey].selected != false) {
			const unit_platform: UnitPlatform = {
				platform: mediaKey,
				required: social_media[mediaKey].required
			};

			// Twitter hashtag/Facebook group id/Youtube Channel id, etc
			// This is instead of { selected: boolean, required: boolean }
			if (typeof social_media[mediaKey] == "string") {
				unit_platform["retrieval_param"] = social_media[mediaKey];
			}

			unitPlatforms.push(unit_platform);
		}
	}

	let lrsId;
	// Check LRS 
	if (lrs.default) {
		await Lrs.findOne({ type: "default" }, (err, defaultLrs) => {
			if (err) { console.error("Create UNIT: Error attempting to find default LRS: ", err); }

			// lrs = defaultLrs._id;
			lrsId = defaultLrs._id;

		});
	} else if (!lrs.default) {
		if (lrs.lrs.id != undefined) {
			lrsId = lrs.lrs.id;
		} else {
			const lrsData = CreateLrsFromData(lrs.lrs, user._id);

			await Lrs.create(lrsData, (err: any, savedLrs: LrsModel) => {
				if (err) { console.error("Create UNIT: Error saving user defined custom lrs: ", err); }
				// lrs = savedLrs._id;

				lrsId = savedLrs._id;
			});
		}
	}

	return {
		name: unit.name,
		code: unit.code,
		semester: unit.semester,
		description: unit.description,
		ethics_statement: unit.ethicsStatement,

		start_date: unit.startDate,
		end_date: unit.endDate,

		// users: [],
		enabled: true,

		platforms: unitPlatforms,

		// attached_user_platforms: [],

		lrs: lrsId,

		created_by: user._id
	};
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
};

/**
 * POST Update Unit
 * Endpoint to update unit 
 */

 // THIS IS PROBABLY INEFFICIENT AND NEEDS REFACTORING
export let updateUnit = async (req: Request, res: Response) => {
	const user = await getDbUser(req.user.email);
	const unit = req.body.unit;
	const social_media = req.body.social_media;
	const lrs = req.body.lrs;

	Unit.findById(req.body.id, async (err: any, unitDoc: any) => {
		if (user._id == unitDoc.created_by) {
			const unitObj = await createUnitFromData(user, unit, social_media, lrs);

			// unitDoc.set(unitObj);
			Unit.findByIdAndUpdate(req.body.id, { $set: unitObj }, (err: any, updatedUnit: any) => {
				if (err) { return res.status(400).json({ error: err }); }
				
				return res.status(200).json({ success: true });
			});
		}
	});
};

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
	Unit.find({ name: unit.name }, async (err, alreadyExists) => {
		if (alreadyExists.length > 0) {
			console.log("ALREADY EXISTS: ", alreadyExists);
			return res.status(400).json({ error: "Unit titled: " + unit.name + " already exists."});
		}

		const unitObj = await createUnitFromData(user, unit, social_media, lrs);

		console.log("unitObj: ", unitObj);

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
	const unitId = req.params.id;
	const userPlatforms = req.body;

	// Check that user is not already in the unit
	Unit.findById(unitId, (err: any, unit: UnitModel) => {
		if (err) { return res.status(400).json({ error: err }); }

		if (!unit) { return res.status(400).json({error: "Unit does not exist."}); }

		if (unit.users.indexOf(user._id) > -1) {
			return res.status(400).json({error: "User already signed up to unit."});
		}

		unit.users = unit.users.concat([user._id]);
		
		// Add user Platform information to UnitUserPlatform collection in mongodb
		// We don't add this to Unit because of potientially sensetive information (social media IDs)
		// And Units are sent to frontend (where anyone technically inclined could 
		// read that information)

		// e.g: { 'trello': 'trello-board-id' }
		const savedUserPlatformIds: string[] = [];
		const userPlatformDocs: UnitUserPlatformModel[] = [];
		for (const key in userPlatforms) {
			// Create Userplatform record
			const userPlatform = new UnitUserPlatform({
				platform: key,
				platformIdentifier: userPlatforms[key],
				belongsTo: user._id
			});

			userPlatformDocs.push(userPlatform);

			// console.log("userPlatform: ", userPlatform);

			/* Save userplatform record and save ID to unit.attached_user_platforms for reference
			userPlatform.save((err, savedUserPlatform) => {
				console.log("savedUserPlatform: ", savedUserPlatform);
				//unit.attached_user_platforms = unit.attached_user_platforms.concat([savedUserPlatform._id]);
				savedUserPlatformIds.push(savedUserPlatform._id);
			}); */
		}

		UnitUserPlatform.collection.insertMany(userPlatformDocs, (err, savedDocs) => {
			
			unit.attached_user_platforms = unit.attached_user_platforms.concat(
				savedDocs.insertedIds.map((doc) => doc.toString())
			);

			// Update the Unit
			unit.save((err) => {
				if (err) { return res.status(400).json({error: err}); }

				return res.status(200).json({success: true});
			});
		});

		// unit.attached_user_platforms = unit.attached_user_platforms.concat(savedUserPlatformIds);
	});
};




