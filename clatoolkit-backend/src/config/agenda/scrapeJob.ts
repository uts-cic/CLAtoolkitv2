import * as Agenda from "agenda";
import { default as Unit } from "../../models/Unit";
import { default as UnitUserPlatform, UnitUserPlatformModel } from "../../models/UnitUserPlatform";
import { default as User, UserModel } from "../../models/User";
import { default as Lrs, LrsModel } from "../../models/LearningRecordStore";
import * as mongoose from "mongoose";

import * as request from "request";

/**
 * Scrape Job
 * Job task for sending data off to data importer
 * to create and send xAPI statements
 */

// Temporary Mapping between social media and importer method as we transition from
// python importers to new GraphQL importer
// Add new social media here as they become available for import in GraphQL
const importUrlForPlatform: any = {
	"twitter": process.env.GRAPHQL_IMPORTER_URL,
	"python_import": process.env.PYTHON_IMPORTER_URL
};

const objectId = mongoose.Types.ObjectId;

const getAttachedUserPlatforms = async (userPlatformIds: Array<string>): Promise<Array<UnitUserPlatformModel>> => {
	const userPlatformObjectIds = userPlatformIds.map(id => objectId(id));
	return UnitUserPlatform.find({
		"_id": {
			$in: userPlatformObjectIds
		}
	}, (err, userAttachedPlatforms: UnitUserPlatformModel[]) => {
		if (err) { throw err; }

		return userAttachedPlatforms;
	});
};

export let scrapeJob = (agenda: Agenda): void => {
	agenda.define("social media scrape for unit", (job: any, done: any) => {
		Unit.findOne(job.attrs.data.unitId, async (err, unit) => {
			if (err) { return done(err); }

			// Get social media platforms to be scraped
			// Array of platforms e.g.: ["twitter", "trello", "github"]
			// const socialMediaPlatforms = unit.platforms.map(plat => plat.platform);


			for (const platform of unit.platforms.map(plat => plat.platform)) {
				const userAttachedPlatformForPlatform: any[] = [];

				// If a particular platform (trello board/slack channel/github repo)
				// appears multiple times - we only need to grab one user token per board
				const platformTokens: any[] = []; 

				if (platform == "twitter") {
					// get user ids for twitter
					// and retrieval param for sending below;
				} else {
					// const attachedUserPlatforms: UnitUserPlatformModel[] = await getAttachedUserPlatforms(unit.attached_user_platforms);
					for (const userPlatform of await getAttachedUserPlatforms(unit.attached_user_platforms)) {
					
						if (userPlatform.platform == platform) {
							const details: any = { 
								platformIdentifier: undefined, 
								username: undefined, 
								userSMId: undefined,
								userToken: undefined 
							};
							
							await User.findOne({ _id: objectId(userPlatform.belongsTo)}, (err, user: UserModel) => {
								details.platformIdentifier = userPlatform.platformIdentifier;
								details.username = user.email;
								details.userSMId = user.profile.socialMediaUserIds[platform];
								details.userToken = user.tokens.find(tok => tok.platform == platform).accessToken;
								userAttachedPlatformForPlatform.push(details);
							});
						}
					}
				}

				// Get platform target (trello board/slack channel/github repo):token mappings
				for (const userPlatform of userAttachedPlatformForPlatform) {
					if (!(platformTokens.some(platform => platform.identifier == userPlatform.platformIdentifier))) {
						const obj: any = {};
						obj.identifier = userPlatform.platformIdentifier;
						obj.token = userPlatform.userToken;
						platformTokens.push(obj);
					}
				}

				// post request to ~~platform~~ endpoint with user details
				// Some social media require app key as well as app token
				Lrs.findOne({ _id: objectId(unit.lrs)}, (err, lrs: LrsModel) => {
					const payload: any = {};

					payload.unit = unit;
					payload.platformTokens = platformTokens;
					payload.userPlatforms = userAttachedPlatformForPlatform;

					if (platform == "trello") {
						payload.appKey = process.env.TRELLO_APP_ID;
					}

					payload.lrs = {};
					payload.lrs.token = lrs.token;
					payload.lrs.endpoint = lrs.host;

					payload.platform = platform;

					// console.log("---------------------");
					// console.log("UNIT SCRAP JOB");
					// console.log("PAYLOAD: ", payload);
					// console.log("---------------------");

					const importerEndpoint: string = (platform in importUrlForPlatform) ? importUrlForPlatform[platform] : importUrlForPlatform["python_import"];
					request.post(importerEndpoint, { json: payload }, (err, httpResponse, body) => {
						console.log("Err: ", err);
						// console.log("httpResponse: ", httpResponse);
						// console.log("body: ", body);
					});

					done(); // call done or jobs become locked permenantly 
				});
			}	
		});
	});
};