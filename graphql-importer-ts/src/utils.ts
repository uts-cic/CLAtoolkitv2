import { MongoClient, ObjectId, Db } from "mongodb";

const platforms_enabled_setting = (<string>process.env.ENABLED_PLATFORMS).split(",");
const platforms_enabled: any = {
    "twitter": platforms_enabled_setting.some(x => x == "twitter"),
    "slack": platforms_enabled_setting.some(x => x == "slack"),
    "trello": platforms_enabled_setting.some(x => x == "trello")
};

const get_importer: any = {
    "twitter": (module: any, db: Db) => {
        return new module.TwitterImporter(db);
    }
}

export const cloneObject = () => {
    let object = {
        "definition": {
            "name": {"en-US": ""},
            "type": "http://activitystrea.ms/tag"
            },
        "objectType": "",
        "id": "http://activitystrea.ms/schema/1.0.0"
    };
    return Object.assign({}, object);
};

export const cloneStatement = () => {
	const statement: any = {
        "actor": {
            "account": {
            	"name": "",
            	"homePage": "",
            },
            "objectType": "Agent"
        },
        "verb": {
            "id": "",
            "display": {"en-US": ""}
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
            	"other" : [ 
                ]
            }
        }
    };

    return (<any>Object).assign({}, statement);
};

export const makeStatements = (posts: []) => {
	const statements: Array<any> = [];

	posts.forEach( (post: any) => {
		let stmt = cloneStatement();

        stmt.actor.objectType = "Agent";
        stmt.actor.account.name = "some@example.org";
        stmt.actor.account.homePage = "http://www.twitter.com/" + post.user.screen_name;
        stmt.verb.id = "http://activitystrea.ms/create";
        stmt.verb.display["en-US"] = "created";
        stmt.object.id="http://twitter.com/statuses/" + post.id;
        stmt.object.objectType ="Activity";
        stmt.object.definition.name["en-US"] = "Tweet";
        stmt.object.definition.description["en-US"] = post.full_text;
        stmt.context.platform = "Twitter";
        post.entities.hashtags.forEach( (hashtag: any) => {
        	var tempObject = cloneObject();
        	tempObject.definition.name["en-US"] = hashtag.text
        	tempObject.objectType = "Activity"
        	tempObject.definition.type = "http://activitystrea.ms/tag"
        	stmt.context.contextActivities.other.push(tempObject)
        })
        post.entities.user_mentions.forEach( (user: any) => {
        	var tempObject = cloneObject();
        	tempObject.definition.name["en-US"] = user.screen_name
        	tempObject.objectType = "Activity"
        	tempObject.definition.type = "http://activitystrea.ms/tag"
        	stmt.context.contextActivities.other.push(tempObject)
        })
        statements.push(stmt);
    });
    return statements;
};

export const importSocialMediaStatementsForUnit = async (unitId: string): Promise<any> => {
    // Setup Mongodb connection
    const client = await MongoClient.connect(<string>process.env.MONGODB_URL);
    const db = client.db("clatoolkit-backend");
    const Units = db.collection("units");

    const unit = await Units.findOne({ _id: new ObjectId(unitId) });

    let statements_created: Array<any> = [];

    for (const platform of unit.platforms.map((x: any) => x.platform)) {
        let sts;

        if (platforms_enabled[platform]) {
            const platformImporterModule = await import("./importers/"+platform);
            const platformImporter = get_importer[platform](platformImporterModule, db);
            
            sts = await platformImporter.createStatements(unit);

            statements_created = statements_created.concat(sts);
        }
    }

    return statements_created;
};

 