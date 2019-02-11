const {
	GraphQLString,
	GraphQLInt,
	GraphQLFloat,
	GraphQLList,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLSchema,
	GraphQLID
} = require('graphql');

const {mergeSchemas} = require('graphql-tools');

const g_schema = require('./general_schema');
const g_resolver = require('./general_resolver');

var Resolver = new GraphQLObjectType({
	name: 'Resolver',
	fields: {
		twitter: {
			type: g_schema.Twitter,
			args: {
				/*type: {type: GraphQLString},
				search_query: {type: GraphQLString},
				limit: {type: GraphQLInt},
				id: {type: GraphQLString},
				limit: {type: GraphQLInt},
				screen_name: {type: GraphQLString},
				hashtag: {type: GraphQLString}*/
				unit_id: { type: GraphQLString },
				type: { type: GraphQLString }
			},
			resolve: async function(root, args, context) {
				return g_resolver.Twitter(args);
			}
		},
		slack: {
			type: g_schema.Slack,
			args: {
				type: {type: GraphQLString},
				unit_id: {type: GraphQLString},
				limit: {type: GraphQLInt}
			},
			resolve: async function(root, args, context) {
				return g_resolver.Slack(args);
			}
		},
		github: {
			type: g_schema.GitHub,
			args: {
				type: {type: GraphQLString},
				/* repo: {type: GraphQLString},
				owner: {type: GraphQLString},
				sha: {type: GraphQLString},
				query: {type: GraphQLString},
				u_date: {type: GraphQLString},
				s_date: {type: GraphQLString} */
				unit_id: {type: GraphQLString}
				// date in format YYYY-MM-DDTHH:MM:SSZ
			},
			resolve: async function(root, args, context) {
				return g_resolver.GitHub(args);
			}
		},
		trello: {
			type: g_schema.Trello,
			args: {
				type: {type: GraphQLString},
				unit_id: {type: GraphQLString},
				trello_api_key: {type: GraphQLString}
			},
			resolve: async function(root, args, context) {
				return g_resolver.Trello(args);
			}
		}
	}
});

var schema = new GraphQLSchema({
	query: Resolver
});

exports.schema = schema;