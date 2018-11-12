"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const platforms_enabled_setting = process.env.ENABLED_PLATFORMS.split(",");
const platforms_enabled = {
    "twitter": platforms_enabled_setting.some(x => x == "twitter"),
    "slack": platforms_enabled_setting.some(x => x == "slack"),
    "trello": platforms_enabled_setting.some(x => x == "trello")
};
exports.cloneObject = () => {
    let object = {
        "definition": {
            "name": { "en-US": "" },
            "type": "http://activitystrea.ms/tag"
        },
        "objectType": "",
        "id": "http://activitystrea.ms/schema/1.0.0"
    };
    return Object.assign({}, object);
};
exports.cloneStatement = () => {
    const statement = {
        "actor": {
            "account": {
                "name": "",
                "homePage": "",
            },
            "objectType": "Agent"
        },
        "verb": {
            "id": "",
            "display": { "en-US": "" }
        },
        "object": {
            "id": "",
            "definition": {
                "name": {},
                "description": {}
            },
            "objectType": "Activity"
        },
        "context": {
            "platform": "",
            "contextActivities": {
                "other": []
            }
        }
    };
    return Object.assign({}, statement);
};
exports.makeStatements = (posts) => {
    const statements = [];
    posts.forEach((post) => {
        let stmt = exports.cloneStatement();
        stmt.actor.objectType = "Agent";
        stmt.actor.account.name = "some@example.org";
        stmt.actor.account.homePage = "http://www.twitter.com/" + post.user.screen_name;
        stmt.verb.id = "http://activitystrea.ms/create";
        stmt.verb.display["en-US"] = "created";
        stmt.object.id = "http://twitter.com/statuses/" + post.id;
        stmt.object.objectType = "Activity";
        stmt.object.definition.name["en-US"] = "Tweet";
        stmt.object.definition.description["en-US"] = post.full_text;
        stmt.context.platform = "Twitter";
        post.entities.hashtags.forEach((hashtag) => {
            var tempObject = exports.cloneObject();
            tempObject.definition.name["en-US"] = hashtag.text;
            tempObject.objectType = "Activity";
            tempObject.definition.type = "http://activitystrea.ms/tag";
            stmt.context.contextActivities.other.push(tempObject);
        });
        post.entities.user_mentions.forEach((user) => {
            var tempObject = exports.cloneObject();
            tempObject.definition.name["en-US"] = user.screen_name;
            tempObject.objectType = "Activity";
            tempObject.definition.type = "http://activitystrea.ms/tag";
            stmt.context.contextActivities.other.push(tempObject);
        });
        statements.push(stmt);
    });
    return statements;
};
exports.importSocialMediaStatementsForUnit = (unitId) => __awaiter(this, void 0, void 0, function* () {
    // Setup Mongodb connection
    const client = yield mongodb_1.MongoClient.connect(process.env.MONGODB_URL);
    const db = client.db("clatoolkit-backend");
    const Units = db.collection("units");
    const unit = yield Units.findOne({ _id: new mongodb_1.ObjectId(unitId) });
    /* console.log("unitId: ", unitId);
    console.log("objectId(unitId): ", new ObjectId(unitId));
    console.log("unit: ", unit);
    console.log("units: ", await Units.find({}).toArray()); */
    let statements_created = [];
    for (const platform of unit.platforms.map((x) => x.platform)) {
        let sts;
        console.log("platform: ", platform);
        console.log("platforms_enabled:  ", platforms_enabled);
        console.log("platforms_enabled[platform]: ", platforms_enabled[platform]);
        if (platforms_enabled[platform]) {
            const platformImporter = yield Promise.resolve().then(() => __importStar(require("./importers/" + platform)));
            sts = yield platformImporter.createStatements(unit, db);
            console.log("STS: ", sts);
            statements_created = statements_created.concat(sts);
        }
    }
    return statements_created;
});
