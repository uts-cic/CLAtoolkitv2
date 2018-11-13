"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twit_1 = __importDefault(require("twit"));
const utils_1 = require("../utils");
const importer_1 = require("./importer");
class TwitterImporter extends importer_1.Importer {
    constructor(db) {
        super(db);
    }
    createStatements(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            const unitUserList = yield this.getUnitUsers(unit);
            let res = [];
            for (const user of unitUserList) {
                const user_twitter_token = user.tokens.find((x) => x.platform == "twitter");
                let retrieval_params_for_twitter = unit.platforms.find((x) => x.platform == "twitter").retrieval_param.split(",");
                retrieval_params_for_twitter = (retrieval_params_for_twitter.length > 1) ? retrieval_params_for_twitter.join(" ") : retrieval_params_for_twitter[0];
                const twitter = twit_1.default({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token: user_twitter_token.accessToken,
                    access_token_secret: user_twitter_token.accessSecret
                });
                const posts = yield twitter.get("search/tweets", { q: retrieval_params_for_twitter, tweet_mode: "extended", lang: "en" });
                const stmts = this.mapTweetsToxAPI(posts, unitUserList);
                const lrsconf = yield this.getUnitLrsConf(unit.lrs);
                const response = yield this.insertIntoLRS(stmts, lrsconf);
                res = res.concat(response);
            }
            return res;
        });
    }
    mapTweetsToxAPI(tweets, unitUserList) {
        // Todo: add twitter name, clatoolkit names of users that where tagged, clatoolkit user id
        return tweets.data.statuses.map((tweet) => {
            const stmt = utils_1.cloneStatement();
            stmt.actor.objectType = "Agent";
            stmt.actor.account.name = unitUserList.find((user) => user.profile.socialMediaUserIds.twitter == tweet.user.id_str).email;
            stmt.actor.account.homePage = "http://clatoolkit.com";
            /* todo: verbs
            */
            stmt.verb = this.getVerbForTweet(tweet);
            stmt.object.id = "http://twitter.com/statuses/" + tweet.id;
            stmt.object.objectType = "Activity";
            stmt.object.definition.name["en-US"] = tweet.full_text;
            stmt.object.definition.description["en-US"] = tweet.source;
            stmt.context.platform = "Twitter";
            if (tweet.entities.hashtags.length > 0) {
                stmt.context["extensions"] = { "http://id.tincanapi.com/extension/tags": [] };
            }
            tweet.entities.hashtags.forEach((hashtag) => {
                stmt.context.extensions["http://id.tincanapi.com/extension/tags"].push(hashtag);
            });
            tweet.entities.user_mentions.forEach((user) => {
                let tempObject = utils_1.cloneObject();
                tempObject.definition.name["en-US"] = user.screen_name;
                tempObject.definition.type = "http://activitystream.ms/tag";
                stmt.context.contextActivities.other.push(tempObject);
            });
            console.log("stmt: ", JSON.stringify(stmt));
            return stmt;
        });
    }
    getVerbForTweet(tweet) {
        const verb = {};
        if (tweet.full_text.indexOf("RT") != -1) {
            verb["id"] = "http://id.tincanapi.com/verb/retweeted";
            verb["display"] = {};
            verb["display"]["en-US"] = "retweeted";
        }
        else {
            verb["id"] = "http://id.tincanapi.com/verb/tweeted";
            verb["display"] = {};
            verb["display"]["en-US"] = "tweeted";
        }
        return verb;
    }
}
exports.TwitterImporter = TwitterImporter;
/*export const createStatements = async (unit: any, db: Db): Promise<any> => {
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
};*/
/*const insertIntoLRS = async (stmts: any, conf: any) => {

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
}*/
/*const mapTweetsToxAPI = (tweets: any, unitUserList: any) => {
    // Todo: add twitter name, clatoolkit names of users that where tagged, clatoolkit user id
    return tweets.data.statuses.map((tweet: any) => {
        const stmt = cloneStatement();

        stmt.actor.objectType = "Agent";
        stmt.actor.account.name = unitUserList.find((user: any) => user.profile.socialMediaUserIds.twitter == tweet.user.id_str).email;
        stmt.actor.account.homePage = "http://clatoolkit.com";
        /* todo: verbs
        *
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
}*/ 
