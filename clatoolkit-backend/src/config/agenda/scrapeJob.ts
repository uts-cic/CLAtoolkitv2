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

const graphQLImporter: string = "http://127.0.0.1:8080/graph";

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

/**
 * Job to perform Scraping
 *
 * Retreives Unit from Mongo with supplied UnitID sent to job
 * Unit details specifies the Social Media platforms in use, to be scraped
 * Retreives user access tokens to access user data on the social media platform
 * Retreives specified LRS to send data to from unit details
 * Sends information (unit details, users in unit, SM access tokens) to third party "importer"
 * "Importer" retrieves relevent data from SM APIs, converts to xAPI statements, and sends to LRS.
 */
export let scrapeJob = (agenda: Agenda): void => {
	agenda.define("social media scrape for unit", (job: any, done: any) => {
		/* request.post(graphQLImporter, { json: { query: "twitter(unit_id:"+job.attrs.data.unitId+",type:User" } }, (err, httpResponse, body) => {
			console.log("Err: ", err);
			console.log("httpResponse: ", httpResponse);
			console.log("body: ", body);
		}); */

		// Get social media platforms to be scraped
		// Array of platforms e.g.: ["twitter", "trello", "github"]
		Unit.findOne(job.attrs.data.unitId, async (err, unit) => {
			for (const platform of unit.platforms.map(plat => plat.platform)) {
				let platType;

				switch (platform) { 
					case "twitter":
						platType = "User";
					break;
					case "slack": 
						platType = "Messages";
					break;
				}

				// {"query": "query { twitter(unit_id:\"5c57bce193aab208347e30b4\",type:\"User\"){ data { id }}}"}
				const body = { "query": "query { " + platform + "(unit_id:\"" + job.attrs.data.unitId + "\",type:\"" + platType + "\"){ data { id }}}"};
				request.post(graphQLImporter, { json: body }, (err, httpResponse, body) => {
					console.log("err: ", err);
					console.log("httpResponse: ", httpResponse);
					console.log("body: ", body);
				});
			}
		});

		done();


		/*
		// Retreives Unit from Mongo with supplied UnitID sent to job
		Unit.findOne(job.attrs.data.unitId, async (err, unit) => {
			if (err) { return done(err); }

			// Get social media platforms to be scraped
			// Array of platforms e.g.: ["twitter", "trello", "github"]
			// Unit details specifies the Social Media platforms in use, to be scraped
			for (const platform of unit.platforms.map(plat => plat.platform)) {
				const userAttachedPlatformForPlatform: any[] = [];

				// Retreives user access tokens to access user data on the social media platform
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
								// Platform Identifier is an ID of a User's attached platform (i.e.: The ID of a trello board, the ID of a github repo)
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
					// We only need the Token of one Attached platform. (E.g.: Multiple users might use the same Trello board, we only need the token of one of these users)
					if (!(platformTokens.some(platform => platform.identifier == userPlatform.platformIdentifier))) {
						const obj: any = {};
						obj.identifier = userPlatform.platformIdentifier;
						obj.token = userPlatform.userToken;
						platformTokens.push(obj);
					}
				}

				// Retreives specified LRS to send data to from unit details
				Lrs.findOne({ _id: objectId(unit.lrs)}, (err, lrs: LrsModel) => {
					// Payload is information sent to Importer to: get SM api data, compile xAPI statements with correct information, LRS details to send xAPI statements to
					const payload: any = {}; 

					payload.unit = unit;
					payload.platformTokens = platformTokens;
					payload.userPlatforms = userAttachedPlatformForPlatform; // UserPlatformForPlatform = a Trello board on Trello, a Repo on Github, etc.

					// Some social media require app key as well as app token
					if (platform == "trello") {
						payload.appKey = process.env.TRELLO_APP_ID; // Might be able to remove with GraphQL importer
					}

					payload.lrs = {};
					payload.lrs.token = lrs.token;
					payload.lrs.endpoint = lrs.host;

					payload.platform = platform;

					// Sends information (unit details, users in unit, SM access tokens) to third party "importer"
					const importerEndpoint: string = (platform in importUrlForPlatform) ? importUrlForPlatform[platform] : importUrlForPlatform["python_import"];
					request.post(importerEndpoint, { json: payload }, (err, httpResponse, body) => {
						console.log("Err: ", err);
						// console.log("httpResponse: ", httpResponse);
						// console.log("body: ", body);
					});

					done(); // call done or jobs become locked permenantly 
				});
			}	
		});*/
	});
};