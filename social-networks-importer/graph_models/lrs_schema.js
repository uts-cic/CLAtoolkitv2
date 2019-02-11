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

exports.Actor = ActorType;
exports.Dictionary = DictionaryType;
exports.Account = AccountType;
exports.Verb = VerbType;
exports.Object = ObjectType;
exports.Context = ContextType;
exports.List = ListType;
exports.Other = OtherType;
exports.Statement = StatementType;