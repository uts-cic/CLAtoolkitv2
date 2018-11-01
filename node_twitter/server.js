// Importing Libraries

const express = require('express');
const express_graphql = require('express-graphql');
const Twit = require('twit');
const _ = require("lodash");
require('dotenv').load();

var https = require("https");
var ADL = require("adl-xapiwrapper");

// // Configuration for LRS

// var conf = {
//     "url" : process.env.HOST_URL,  
//     "auth" : {
//         user : process.env.LRS_USERNAME,
//         pass : process.env.LRS_PASSWORD
//     }
// };

// // Presets

// var LRS = new ADL.XAPIWrapper(conf);

// Handle (is it necessary?)

exports.handler = async (event, context) => {


    let inserted = await insertIntoLRS(statements);
    return inserted;
};

// Create Statements

function makeStatements (posts) {
    let statements = [];
    posts.forEach( (post) => {
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
        post.entities.hashtags.forEach( (hashtag) => {
        	var tempObject = cloneObject();
        	tempObject.definition.name["en-US"] = hashtag.text
        	tempObject.objectType = "Activity"
        	tempObject.definition.type = "http://activitystrea.ms/tag"
        	stmt.context.contextActivities.other.push(tempObject)
        })
        post.entities.user_mentions.forEach( (user) => {
        	var tempObject = cloneObject();
        	tempObject.definition.name["en-US"] = user.screen_name
        	tempObject.objectType = "Activity"
        	tempObject.definition.type = "http://activitystrea.ms/tag"
        	stmt.context.contextActivities.other.push(tempObject)
        })
        statements.push(stmt);
    });
    return statements;
}

// Clone Statements

function cloneObject() {
	let object = {
		"definition": {
            "name": {"en-US": ""},
            "type": "http://activitystrea.ms/tag"
        	},
        "objectType": "",
        "id": "http://activitystrea.ms/schema/1.0.0"
	};
	return Object.assign({}, object);
}

function cloneStatement() {
    let statement = {
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
    return Object.assign({}, statement);
}

// Upload to LRS

async function insertIntoLRS(statements, conf) {

    let result = statements.map( async (stmt) => {
        let ts = await insertLRS(stmt, conf);
        return ts;
    });
    const data_extract = await Promise.all(result);
    return data_extract;
}

function insertLRS(stmts, conf) {
	var LRS = new ADL.XAPIWrapper(conf);
    return new Promise((resolve, reject) => {
        LRS.sendStatements(stmts, (err, res) => {
            //need to implement better error handling
            if(err) return reject(err);
            return resolve('Added');
        });
    });
}

// Importing GraphQL Objects

const {
	GraphQLString,
	GraphQLInt,
	GraphQLFloat,
	GraphQLList,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLSchema,
	GraphQLID,
	GraphQLEnumType,
	GraphQLScalarType,
	GraphQLInterfaceType
} = require('graphql');

// Connecting to Twitter API

var twitter = new Twit({
	consumer_key:process.env.TWITTER_CONSUMER_KEY,
	consumer_secret:process.env.TWITTER_CONSUMER_SECRET,
	access_token:process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret:process.env.TWITTER_ACCESS_SECRET,
});

// Defining Data Types

var PostType = new GraphQLObjectType({
	name: 'Note',
	fields: () => ({
		id: {type: new GraphQLNonNull(GraphQLString)},
		title: {type: new GraphQLNonNull(GraphQLString)},
		text: {type: GraphQLString},
		full_text: {type: GraphQLString},
		user: {type: UserType},
		created_at: {type: GraphQLString},
		entities: {type: EntityType}
	})
});

var UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		email: {type: new GraphQLNonNull(GraphQLString)},
		onlinePosts: {type: PostType},
		screen_name: {type: GraphQLString},
		id: {type: GraphQLID}
	})
});

var EntityType = new GraphQLObjectType({
	name: 'Entity',
	fields: () => ({
		hashtags: {type: new GraphQLList(PostType)},
		user_mentions: {type: new GraphQLList(UserType)}
	})
});

// LRS GraphQL Schemas

var ActorType = new GraphQLObjectType({
	name: "Actor",
	fields: () => ({
		objectType: {type: GraphQLString},
		account: {type: AccountType}
	})
});

var AccountType = new GraphQLObjectType({
	name: "Account",
	fields: () => ({
		name: {type: GraphQLString},
		homePage: {type: GraphQLString}
	})
});

var VerbType = new GraphQLObjectType({
	name: 'Verb',
	fields: () => ({
		id: {type: GraphQLString},
		objectType: {type: GraphQLString},
		display: {type: DictionaryType}
	})
});

var ObjectType = new GraphQLObjectType({
	name: "Object",
	fields: () => ({
		objectType: {type: GraphQLString},
		id: {type: GraphQLString},
		definition: {type: OtherType}
	})
})

var ContextType = new GraphQLObjectType({
	name: "Context",
	fields: () => ({
		platform: {type: GraphQLString},
		objectType: {type: GraphQLString},
		contextActivities: {type: ListType}
	})
});

var ListType = new GraphQLObjectType({
	name: "List",
	fields: () => ({
		other: {type: new GraphQLList(DefinitionType)}
	})
})

var DefinitionType = new GraphQLObjectType({
	name: "Definition",
	fields: () => ({
		definition: {type: OtherType}
	})
})

var OtherType = new GraphQLObjectType({
	name: "Additional",
	fields: () => ({
		name: {type: DictionaryType},
		description: {type: DictionaryType},
		type: {type: GraphQLString}
	})
});

var DictionaryType = new GraphQLObjectType({
	name: "Dictionary",
	fields: () => ({
		en_US: {type: GraphQLString}
		// text: {type: GraphQLString}
	})
});

var StatementType = new GraphQLObjectType({
	name: 'Statement',
	fields: () => ({
		actor: {type: ActorType},
		verb: {type: VerbType},
		context: {type: ContextType},
		object: {type: ObjectType}
	})
});

// Defining GraphQL Root Resolver

var MainRootResolver = new GraphQLObjectType({
	name: 'RootResolver',
	fields: {
		post: {
			type: PostType,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: function(root, args, context) {
				id = args.id
				return twitter.get('statuses/show/:id', {id, tweet_mode: 'extended'}).then(post => {
					for (var data in post) {
						return post[data]
					}
				})
			}
		},
		user: {
			type: UserType,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLInt)
				}
			},
			resolve: function(root, args, context) {
				id = args.id
				return twitter.get('users/show', {id}).then(user => {
					for (var data in user) {
						return user[data]
					}
				})
			}
		},
		search: {
			type: new GraphQLList(PostType),
			args: {
				search_query: {type: new GraphQLNonNull(GraphQLString)},
				hashtag: {type: GraphQLString},
				author: {type: GraphQLString},
				limit: {type: GraphQLInt},
				lrs_host: {type: GraphQLString},
				lrs_user: {type: GraphQLString},
				lrs_key: {type: GraphQLString}
			},
			resolve: function(root, args, context) {
				search_query = args.search_query + " "
				limit = args.limit
				if (args.author == undefined) {
					author = ""
				} else {
					author ="from:" + args.author
				}
				if (args.hashtag == undefined) {
					hashtag = ""
				} else {
					hashtag = args.hashtag + " "
				}
				search_query = search_query + hashtag + author
				return twitter.get('search/tweets', {q: search_query, count: limit, tweet_mode: "extended", lang: "en"}).then(posts => {
					// let statements = makeStatements(posts.data.statuses)
					// let response = insertIntoLRS(statements)
					let statements = makeStatements(posts.data.statuses)
					var conf = {
						    "url" : args.lrs_host,  
						    "auth" : {
						        user : args.lrs_user,
						        pass : args.lrs_key
						    }
						};
					let response = insertIntoLRS(statements, conf)
					console.log(statements[0].object)
					return posts.data.statuses
				})
			}
		},
		search_statements: {
			type: new GraphQLList(StatementType),
			args: {
				search_query: {type: new GraphQLNonNull(GraphQLString)},
				hashtag: {type: GraphQLString},
				author: {type: GraphQLString},
				limit: {type: GraphQLInt},
				course_code: {type: GraphQLInt},
				lrs_host: {type: GraphQLString},
				lrs_user: {type: GraphQLString},
				lrs_key: {type: GraphQLString}
			},
			resolve: function(root, args, context) {
				search_query = args.search_query + " "
				limit = args.limit
				if (args.author == undefined) {
					author = ""
				} else {
					author ="from:" + args.author
				}
				if (args.hashtag == undefined) {
					hashtag = ""
				} else {
					hashtag = args.hashtag + " "
				}
				search_query = search_query + hashtag + author
				return twitter.get('search/tweets', {q: search_query, count: limit, tweet_mode: "extended", lang: "en"}).then(posts => {
					let statements = makeStatements(posts.data.statuses, args.course_code)
					var conf = {
						    "url" : args.lrs_host,  
						    "auth" : {
						        user : args.lrs_user,
						        pass : args.lrs_key
						    }
						};
					let response = insertIntoLRS(statements, conf)
					console.log(statements)
					return statements
				})
			}
		}
	}
});

// Defining GraphQL Schema

var MainSchema = new GraphQLSchema({
	query: MainRootResolver
});

// Launching ExpressJS App

const app = express();

// App Routing

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3154, () => console.log('Server activated'));

// GraphQL Interactive Interface

app.use('/graphql', express_graphql({
	schema: MainSchema,
	graphiql: true
}));

app.use('/graph', express_graphql({
	schema: MainSchema,
	graphiql: false
}));