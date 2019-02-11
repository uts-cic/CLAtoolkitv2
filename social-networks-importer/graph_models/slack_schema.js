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

const slack = require('../slack/slack');

// Schemas

var UserType = new GraphQLObjectType({
	name: 'slack_user',
	fields: () => ({
		name: {type: GraphQLString},
		id: {type: GraphQLString}
	})
});

var MessageType = new GraphQLObjectType({
	name: 'slack_note',
	fields: () => ({
		id: {type: GraphQLString},
		user: {
			type: UserType,
			resolve: async function(root, args, context) {
				user = await slack.user(root.user);
				return user.user
			}
		},
		text: {type: GraphQLString},
		ts: {type: GraphQLString},
		files: {type: new GraphQLList(EntityType)}
	})
});

var EntityType = new GraphQLObjectType({
	name: 'slack_entity',
	fields: () => ({
		id: {type: GraphQLString},
		created: {type: GraphQLString},
		timestamp: {type: GraphQLString},
		title: {type: GraphQLString},
		name: {type: GraphQLString},
		user: {type: UserType},
		permalink: {type: GraphQLString}
	})
});

var ChannelInfoType = new GraphQLObjectType({
	name: 'slack_channel',
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString}
	})
});

exports.User = UserType;
exports.Message = MessageType;
exports.Entity = EntityType;
exports.Channel = ChannelInfoType;