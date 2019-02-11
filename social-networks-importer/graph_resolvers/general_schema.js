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

const twit_graph = require('../graph_models/twit_schema');
const slack_graph = require('../graph_models/slack_schema');
const lrs_graph = require('../graph_models/lrs_schema');
const github_graph = require('../graph_models/github_schema');
const trello_graph = require('../graph_models/trello_schema');


var github = new GraphQLObjectType({
	name: "github",
	fields: () => ({
		data: {type: new GraphQLList(github_graph.GitHub)},

	})
});

var twitter = new GraphQLObjectType({
	name: "twitter",
	fields: () => ({
		data: {type: new GraphQLList(twit_graph.Post)},
		statuses: {type: new GraphQLList(twit_graph.Post)}
	})
});

var slack = new GraphQLObjectType({
	name: "slack",
	fields: () => ({
		channels: {type: new GraphQLList(slack_graph.Channel)},
		messages: {type: new GraphQLList(slack_graph.Message)},
		data: {type: new GraphQLList(slack_graph.Message)}
	})
});

var trello = new GraphQLObjectType({
	name: "trello",
	fields: () => ({
		data: { type: new GraphQLList(trello_graph.Trello)}
	})
});

exports.Slack = slack;
exports.Twitter = twitter;
exports.GitHub = github;
exports.Trello = trello;