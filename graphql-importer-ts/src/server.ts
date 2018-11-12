import express from "express";
import express_graphql from "express-graphql";
import * as Twit from "twit";
import * as dotenv from "dotenv";
import * as https from "https";
import * as ADL from "adl-xapiwrapper";

dotenv.load();

import * as utils from "./utils";

import { GraphQLString,
		 GraphQLInt,
		 GraphQLFloat,  
		 GraphQLList,
	     GraphQLObjectType,
	     GraphQLNonNull,
		 GraphQLSchema,
		 GraphQLID,
		 GraphQLEnumType,
		 GraphQLScalarType,
		 GraphQLInterfaceType } from "graphql";

const PostType = new GraphQLObjectType({
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

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		email: {type: new GraphQLNonNull(GraphQLString)},
		onlinePosts: {type: PostType},
		screen_name: {type: GraphQLString},
		id: {type: GraphQLID}
	})
});

const EntityType = new GraphQLObjectType({
	name: 'Entity',
	fields: () => ({
		hashtags: {type: new GraphQLList(PostType)},
		user_mentions: {type: new GraphQLList(UserType)}
	})
});

// LRS GraphQL Schemas

const ActorType = new GraphQLObjectType({
	name: "Actor",
	fields: () => ({
		objectType: {type: GraphQLString},
		account: {type: AccountType}
	})
});

const AccountType = new GraphQLObjectType({
	name: "Account",
	fields: () => ({
		name: {type: GraphQLString},
		homePage: {type: GraphQLString}
	})
});

const VerbType = new GraphQLObjectType({
	name: 'Verb',
	fields: () => ({
		id: {type: GraphQLString},
		objectType: {type: GraphQLString},
		display: {type: DictionaryType}
	})
});

const ObjectType = new GraphQLObjectType({
	name: "Object",
	fields: () => ({
		objectType: {type: GraphQLString},
		id: {type: GraphQLString},
		definition: {type: OtherType}
	})
})

const ContextType = new GraphQLObjectType({
	name: "Context",
	fields: () => ({
		platform: {type: GraphQLString},
		objectType: {type: GraphQLString},
		contextActivities: {type: ListType}
	})
});

const ListType = new GraphQLObjectType({
	name: "List",
	fields: () => ({
		other: {type: new GraphQLList(DefinitionType)}
	})
})

const DefinitionType = new GraphQLObjectType({
	name: "Definition",
	fields: () => ({
		definition: {type: OtherType}
	})
})

const OtherType = new GraphQLObjectType({
	name: "Additional",
	fields: () => ({
		name: {type: DictionaryType},
		description: {type: DictionaryType},
		type: {type: GraphQLString}
	})
});

const DictionaryType = new GraphQLObjectType({
	name: "Dictionary",
	fields: () => ({
		en_US: {type: GraphQLString}
		// text: {type: GraphQLString}
	})
});

const StatementType = new GraphQLObjectType({
	name: 'Statement',
	fields: () => ({
		actor: {type: ActorType},
		verb: {type: VerbType},
		context: {type: ContextType},
		object: {type: ObjectType}
	})
});


const MainRootResolver = new GraphQLObjectType({
	name: 'RootResolver',
	fields: {
		search: {
			type: new GraphQLList(PostType),
			args: {
				unit: {type: new GraphQLNonNull(GraphQLString)},
			},
			resolve: (root: any, args: any, context: any) => {
				
			}
		},
		search_statements: {
			type: new GraphQLList(StatementType),
			args: {
				unit: {type: new GraphQLNonNull(GraphQLString)},
			},
			resolve: async (root: any, args: any, context: any) => {
				const unitId: string = args.unit;
				return await utils.importSocialMediaStatementsForUnit(unitId);
			}
		}
	}
});

const MainSchema = new GraphQLSchema({
	query: MainRootResolver
});

const app: express.Application = express();

app.listen(3154, () => console.log("Server Started: localhost:3154"));

app.use("/graphql", express_graphql({
	schema: MainSchema,
	graphiql: true
}));

app.use("/graph", express_graphql({
	schema: MainSchema,
	graphiql: false
}))