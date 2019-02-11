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

const graphql = require('graphql');
const tools = require('graphql-tools');
const {schema} = require('@octokit/graphql-schema');

var RepositoryType = new GraphQLObjectType({
	name: "github_repository",
	fields: () => ({
		issues: {type: IssueType},
		ref: {type: TargetType}
	})
});

var TargetType = new GraphQLObjectType({
	name: "github_target",
	fields: () => ({
		target: {type: HistoryType}
	})
});

var HistoryType = new GraphQLObjectType({
	name: "github_history",
	fields: () => ({
		history: {type: CommitMessageType}
	})
});

var IssueType = new GraphQLObjectType({
	name: "github_issues",
	fields: () => ({
		body: {type: GraphQLString},
		id: {type: GraphQLString}
	})
});

var UserType = new GraphQLObjectType({
	name: "github_user",
	fields: () => ({
		login: {type: GraphQLString},
		name: {type: GraphQLString},
		email: {type: GraphQLString}
	})
});

var AuthorType = new GraphQLObjectType({
	name: "github_author",
	fields: () => ({
		name: {type: GraphQLString},
		user: {type: UserType},
		email: {type: GraphQLString}
	})
});

var CommitMessageType = new GraphQLObjectType({
	name: "github_messages",
	fields: () => ({
		nodes: {type: new GraphQLList(CommitType)}
	})
});

var NodeType = new GraphQLObjectType({
	name: "github_nodes",
	fields: () => ({
		commit: {type: CommitType},
		issues: {type: IssueType}
	})
});

var CommitType = new GraphQLObjectType({
	name: "github_commit",
	fields: () => ({
		message: {type: GraphQLString},
		author: {type: AuthorType}
	})
});

exports.Repository = RepositoryType;

module.exports.github_schema = graphql.buildClientSchema(schema.json);