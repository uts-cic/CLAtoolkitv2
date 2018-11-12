import { Db, ObjectId } from "mongodb";
import Twit from "twit";
import { cloneStatement, cloneObject } from "../utils";


/*
*  ADL XAPIwrapper no longer maintained
*   only accepts username/password LRS setups
*	Newer xapiwrapper no longer maintained eiter
*	accepts base64 auth but is FRONT END ONLY :(
*
*
*	Numerous security issues in both adl-xapiwrapper and xapiwrapper
*/
import * as ADL from "adl-xapiwrapper";


export const createStatements = async (unit: any, db: Db): Promise<any> => {
	const unitUserList = await db.collection("users").find({
		_id: {
			$in: unit.users.map((userIdStr: string) => new ObjectId(userIdStr))
		}
	}).toArray();

 	let res: Array<any> = [];
	for (const user of unitUserList) {
		const user_twitter_token = user.tokens.find((x: any) => x.platform == "twitter");
		let retrieval_params_for_twitter: any = unit.platforms.find((x: any) => x.platform == "twitter").retrieval_param.split(",");

		retrieval_params_for_twitter = (retrieval_params_for_twitter.length > 1) ? retrieval_params_for_twitter.join(" ") : retrieval_params_for_twitter[0]; 

		const twitter =  Twit({
			consumer_key: process.env.TWITTER_CONSUMER_KEY,
			consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
			access_token: user_twitter_token.accessToken,
			access_token_secret: user_twitter_token.accessSecret
		});
		
		const posts = await twitter.get("search/tweets", { q: retrieval_params_for_twitter, tweet_mode: "extended", lang: "en"});

		const stmts = mapTweetsToxAPI(posts, unitUserList);

		let unitLrs: any = await db.collection("lrs").find({ _id: new ObjectId(unit.lrs) }).toArray();
		unitLrs = unitLrs[0]
		const lrsconf = { "url": "https://clatoolkit.lrs.io/xapi/", "auth": {
			"user": unitLrs.config.basic_auth.key,
			"pass": unitLrs.config.basic_auth.secret
		}};

		const response = await insertIntoLRS(stmts, lrsconf);

		res = res.concat(response);

	}

	return res;
};

const insertIntoLRS = async (stmts: any, conf: any) => {

	const result = stmts.map(async (stmt: any) => {
		const ts = await insertLRS(stmt, conf);
		return ts;
	});

	return await Promise.all(result);
}

const insertLRS = (stmts: any, conf: any) => {
	const LRS = new ADL.XAPIWrapper(conf);
	return new Promise((resolve, rej) => {
		LRS.sendStatements(stmts, (err: any, res: any) => {
			if (err) return rej(err);

			return resolve(stmts);
		});
	});
}

const mapTweetsToxAPI = (tweets: any, unitUserList: any) => {
	// Todo: add twitter name, clatoolkit names of users that where tagged, clatoolkit user id
	return tweets.data.statuses.map((tweet: any) => {
		const stmt = cloneStatement();

		stmt.actor.objectType = "Agent";
		stmt.actor.account.name = unitUserList.find((user: any) => user.profile.socialMediaUserIds.twitter == tweet.user.id_str).email;
		stmt.actor.account.homePage = "http://clatoolkit.com";
		/* todo: verbs
		*/
		stmt.verb.id = "http://testverb.com.au/verb";
		stmt.verb.display["en-US"] = "test verb";
		stmt.object.id = "http://twitter.com/statuses/" + tweet.id;
		stmt.object.objectType = "Activity";
		stmt.object.definition.name["en-US"] = tweet.full_text;
		stmt.object.definition.description["en-US"] = tweet.source;
		stmt.context.platform = "Twitter";
		tweet.entities.hashtags.forEach((hashtag: any) => {
			let tempObject = cloneObject();
			tempObject.objectType = "Activity";
			tempObject.definition.name["en-US"] = hashtag.text;
			tempObject.definition.type = "http://activitystream.ms/tag";
			stmt.context.contextActivities.other.push(tempObject);
		});

		tweet.entities.user_mentions.forEach((user: any) => {
			let tempObject = cloneObject();
			tempObject.definition.name["en-US"] = user.screen_name;
			tempObject.definition.type = "http://activitystream.ms/tag";
			stmt.context.contextActivities.other.push(tempObject);
		});

		return stmt;
	});
}