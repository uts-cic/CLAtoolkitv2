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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const twit_1 = __importDefault(require("twit"));
const utils_1 = require("../utils");
const ADL = __importStar(require("adl-xapiwrapper"));
exports.createStatements = (unit, db) => __awaiter(this, void 0, void 0, function* () {
    const unitUserList = yield db.collection("users").find({
        _id: {
            $in: unit.users.map((userIdStr) => new mongodb_1.ObjectId(userIdStr))
        }
    }).toArray();
    console.log("unitUserList: ", unitUserList);
    let res = [];
    for (const user of unitUserList) {
        const user_twitter_token = user.tokens.find((x) => x.platform == "twitter");
        let retrieval_params_for_twitter = unit.platforms.find((x) => x.platform == "twitter").retrieval_param.split(",");
        retrieval_params_for_twitter = (retrieval_params_for_twitter.length > 1) ? retrieval_params_for_twitter.join(" ") : retrieval_params_for_twitter[0];
        console.log("twitter user token: ", user_twitter_token);
        const twitter = twit_1.default({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: user_twitter_token.accessToken,
            access_token_secret: user_twitter_token.accessSecret
        });
        const posts = yield twitter.get("search/tweets", { q: retrieval_params_for_twitter, tweet_mode: "extended", lang: "en" }); /*.then((posts: any) => {
            console.log("Posts: ", posts);
            const stmts = mapTweetsToxAPI(posts, unitUserList);
            const unitLrs: any = db.collection("lrs").find({ _id: new ObjectId(unit.lrs) });

            const response = insertIntoLRS(stmts, { "endpoint": unitLrs.host, "auth": "Basic " + unitLrs.token });
            console.log("InsertintoLRS response: ", response);
            res.concat(response);
        });*/
        // console.log("posts: ", posts.data.statuses);
        const stmts = mapTweetsToxAPI(posts, unitUserList);
        console.log("stmts: ", JSON.stringify(stmts));
        let unitLrs = yield db.collection("lrs").find({ _id: new mongodb_1.ObjectId(unit.lrs) }).toArray();
        unitLrs = unitLrs[0];
        const lrsconf = { "url": "https://clatoolkit.lrs.io/xapi/", "auth": {
                "user": unitLrs.config.basic_auth.key,
                "pass": unitLrs.config.basic_auth.secret
            } };
        const response = yield insertIntoLRS(stmts, lrsconf);
        console.log("InsertintoLRS response: ", response);
        res = res.concat(response);
    }
    return res;
});
const insertIntoLRS = (stmts, conf) => __awaiter(this, void 0, void 0, function* () {
    console.log("Lrs conf: ", conf);
    const result = stmts.map((stmt) => __awaiter(this, void 0, void 0, function* () {
        const ts = yield insertLRS(stmt, conf);
        return ts;
    }));
    return yield Promise.all(result);
});
const insertLRS = (stmts, conf) => {
    const LRS = new ADL.XAPIWrapper(conf);
    return new Promise((resolve, rej) => {
        LRS.sendStatements(stmts, (err, res) => {
            if (err)
                return rej(err);
            console.log("insertLRS: ", res);
            return resolve(stmts);
        });
    });
};
const mapTweetsToxAPI = (tweets, unitUserList) => {
    // Todo: add twitter name, clatoolkit names of users that where tagged, clatoolkit user id
    return tweets.data.statuses.map((tweet) => {
        const stmt = utils_1.cloneStatement();
        console.log("Statement: ", stmt);
        stmt.actor.objectType = "Agent";
        stmt.actor.account.name = unitUserList.find((user) => user.profile.socialMediaUserIds.twitter == tweet.user.id_str).email;
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
        tweet.entities.hashtags.forEach((hashtag) => {
            let tempObject = utils_1.cloneObject();
            tempObject.objectType = "Activity";
            tempObject.definition.name["en-US"] = hashtag.text;
            tempObject.definition.type = "http://activitystream.ms/tag";
            stmt.context.contextActivities.other.push(tempObject);
        });
        tweet.entities.user_mentions.forEach((user) => {
            let tempObject = utils_1.cloneObject();
            tempObject.definition.name["en-US"] = user.screen_name;
            tempObject.definition.type = "http://activitystream.ms/tag";
            stmt.context.contextActivities.other.push(tempObject);
        });
        return stmt;
    });
};
