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

var TrelloActionType = new GraphQLObjectType({
	name: "trello_action_type",
	fields: () => ({
		id: {type: GraphQLString},
		idMemberCreator: {type: GraphQLString},
		data: {type: TrelloDataType},
		type: {type: GraphQLString},
		date: {type: GraphQLString},
		memberCreator: {type: UserType},
		display: {type: DisplayType},

	})
});

var TrelloDataType = new GraphQLObjectType({
	name: "trello_data",
	fields: () => ({
		list: {type: ListType},
		board: {type: BoardType},
		card: {type: CardType},
		old: {type: CardType}
	})
});

var UserType = new GraphQLObjectType({
	name: "trello_user",
	fields: () => ({
		id: {type: GraphQLString},
		avatarHash: {type: GraphQLString},
		fullName: {type: GraphQLString},
		initials: {type: GraphQLString},
		username: {type: GraphQLString}
	})
});

var DisplayType = new GraphQLObjectType({
	name: "trello_display",
	fields: () => ({
		translationKey: {type: GraphQLString},
		entities: {type: EntitiesType},	
	})
});

var EntitiesType = new GraphQLObjectType({
	name: "trello_entities",
	fields: () => ({
		card: {type: CardType}
	})
});

var ListType = new GraphQLObjectType({
	name: "trello_list_type",
	fields: () => ({
		name: {type: GraphQLString},
		id: {type: GraphQLString}
	})
});

var BoardType = new GraphQLObjectType({
	name: "trello_board_type",
	fields: () => ({
		shortLink: {type: GraphQLString},
		name: {type: GraphQLString},
		id: {type: GraphQLString}
	})
});

var CardType = new GraphQLObjectType({
	name: "trello_card_type",
	fields: () => ({
		shortLink: {type: GraphQLString},
		idShort: {type: GraphQLInt},
		name: {type: GraphQLString},
		id: {type: GraphQLString},
		due: {type: GraphQLString}
	})
});

exports.Trello = TrelloActionType;