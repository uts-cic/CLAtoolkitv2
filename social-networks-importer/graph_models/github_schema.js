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

var GitHubType = new GraphQLObjectType({
	name: "github_type",
	fields: () => ({
		id: {type: GraphQLInt},
		name: {type: GraphQLString},
		full_name: {type: GraphQLString},
		title:  {type: GraphQLString},
		node_id: {type: GraphQLString},
		html_url: {type: GraphQLString},
		login: {type: GraphQLString},
		url: {type: GraphQLString},
		language: {type: GraphQLString},
		user: {type: UserType},
		state: {type: GraphQLString},
		body: {type: GraphQLString},
		stats: {type: StatsType},
		author: {type: UserType},
		files: {type: new GraphQLList(FileType)},
		commit: {type: CommitType},
		issues: {type: IssuesType},
		owner: {type: UserType}
	})
});

var RepositoryType = new GraphQLObjectType({
	name: "github_repository",
	fields: () => ({
		id: {type: GraphQLInt},
		node_id: {type: GraphQLString},
		name: {type: GraphQLString},
		full_name: {type: GraphQLString},
		private: {type: GraphQLString},
		fork: {type: GraphQLString},
		language: {type: GraphQLString},
		license: {type: LicenseType},
		html_url: {type: GraphQLString},
		description: {type: GraphQLString},
		commit: {type: CommitType},
		issues: {type: IssuesType},
		owner: {type: UserType}
	})
});

var UserType = new GraphQLObjectType({
	name: "github_user",
	fields: () => ({
		login: {type: GraphQLString},
		id: {type: GraphQLInt},
		node_id: {type: GraphQLString},
		url: {type: GraphQLString},
		html_url: {type: GraphQLString}
	})
});

var AuthorCommitType = new GraphQLObjectType({
	name: "github_author_commit",
	fields: () => ({
		name: {type: GraphQLString},
		email: {type: GraphQLString},
		date: {type: GraphQLString}
	})
});

var LicenseType = new GraphQLObjectType({
	name: "github_license",
	fields: () => ({
		key: {type: GraphQLString},
		name: {type: GraphQLString},
		url: {type: GraphQLString},
		node_id: {type: GraphQLString}
	})
});

var IssuesType = new GraphQLObjectType({
	name: "github_issues",
	fields: () => ({
		url: {type: GraphQLString},
		title:  {type: GraphQLString},
		id: {type: GraphQLInt},
		user: {type: UserType},
		state: {type: GraphQLString},
		body: {type: GraphQLString}
	})
});

var CommitType = new GraphQLObjectType({
	name: "github_commits",
	fields: () => ({
		url: {type: GraphQLString},
		author: {type: AuthorCommitType},
		message: {type: GraphQLString}
	})
}); 

var StatsType = new GraphQLObjectType({
	name: "github_stats",
	fields: () => ({
		total: {type: GraphQLInt},
		additions: {type: GraphQLInt},
		deletions: {type: GraphQLInt}
	})
});

var FileType = new GraphQLObjectType({
	name: "github_files",
	fields: () => ({
		sha: {type: GraphQLString},
		filename: {type: GraphQLString},
		status: {type: GraphQLString},
		additions: {type: GraphQLInt},
		deletions: {type: GraphQLInt},
		changes: {type: GraphQLInt},
		patch: {type: GraphQLString}
	})
});

exports.GitHub = GitHubType;
exports.Repository = RepositoryType;
exports.User = UserType;
exports.Commit = CommitType;
exports.Issues = IssuesType;