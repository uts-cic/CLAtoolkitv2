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

// Schemas

var UserType = new GraphQLObjectType({
	name: 'twitter_user',
	fields: () => ({
		screen_name: {type: GraphQLString},
		id: {type: GraphQLID},
		online_posts: {type: new GraphQLList(PostType)}
	})
});

var PostType = new GraphQLObjectType({
	name: 'twitter_note',
	fields: () => ({
		id: {type: GraphQLString},
		text: {type: GraphQLString},
		full_text: {type: GraphQLString},
		user: {type: UserType},
		created_at: {type: GraphQLString},
		entities: {type: EntityType}
	})
});

var EntityType = new GraphQLObjectType({
	name: 'twitter_entity',
	fields: () => ({
		hashtags: {type: new GraphQLList(PostType)},
		user_mentions: {type: new GraphQLList(UserType)}
	})
});

exports.User = UserType;
exports.Post = PostType;
exports.Entity = EntityType;