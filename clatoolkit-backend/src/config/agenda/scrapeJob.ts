import * as Agenda from "agenda";
import { default as Unit } from "../../models/Unit";
import { default as UnitUserPlatform, UnitUserPlatformModel } from "../../models/UnitUserPlatform";
import { default as User, UserModel } from "../../models/User";
import { default as Lrs, LrsModel } from "../../models/LearningRecordStore";
import * as mongoose from "mongoose";

/**
 * Scrape Job
 * Job task for sending data off to data importer
 * to create and send xAPI statements
 */

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
	agenda.define("social media scrape for unit", (job, done) => {
		Unit.findOne(job.attrs.data.unitId, async (err, unit) => {
			if (err) { return done(err); }

			// Get social media platforms to be scraped
			// Array of platforms e.g.: ["twitter", "trello", "github"]
			// const socialMediaPlatforms = unit.platforms.map(plat => plat.platform);


			for (const platform of unit.platforms.map(plat => plat.platform)) {
				const userAttachedPlatformForPlatform: any[] = [];
				if (platform == "twitter") {
					// get user ids for twitter
					// and retrieval param for sending below;
				} else {
					// const attachedUserPlatforms: UnitUserPlatformModel[] = await getAttachedUserPlatforms(unit.attached_user_platforms);
					for (const userPlatform of await getAttachedUserPlatforms(unit.attached_user_platforms)) {
					
						if (userPlatform.platform == platform) {
							const details: any = { platformIdentifier: undefined, 
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
				// post request to ~~platform~~ endpoint with user details
				// Some social media require app key as well as app token
				Lrs.findOne({ _id: objectId(unit.lrs)}, (err, lrs: LrsModel) => {
					const payload: any = {};

					payload.unit = unit;
					payload.userPlatforms = userAttachedPlatformForPlatform;

					if (platform == "trello") {
						payload.appKey = process.env.TRELLO_APP_ID;
					}

					payload.lrs = {};
					payload.lrs.token = lrs.token;
					payload.lrs.endpoint = lrs.host;

					payload.platform = platform;

					console.log("---------------------");
					console.log("UNIT SCRAP JOB");
					console.log("PAYLOAD: ", payload);
					console.log("---------------------");

					done(); // call done or jobs become locked permenantly 
				});
			}	
		});
	});
};