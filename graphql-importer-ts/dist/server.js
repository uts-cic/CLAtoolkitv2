"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const dotenv = __importStar(require("dotenv"));
dotenv.load();
const utils = __importStar(require("./utils"));
const graphql_1 = require("graphql");
const PostType = new graphql_1.GraphQLObjectType({
    name: 'Note',
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        text: { type: graphql_1.GraphQLString },
        full_text: { type: graphql_1.GraphQLString },
        user: { type: UserType },
        created_at: { type: graphql_1.GraphQLString },
        entities: { type: EntityType }
    })
});
const UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: () => ({
        email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        onlinePosts: { type: PostType },
        screen_name: { type: graphql_1.GraphQLString },
        id: { type: graphql_1.GraphQLID }
    })
});
const EntityType = new graphql_1.GraphQLObjectType({
    name: 'Entity',
    fields: () => ({
        hashtags: { type: new graphql_1.GraphQLList(PostType) },
        user_mentions: { type: new graphql_1.GraphQLList(UserType) }
    })
});
// LRS GraphQL Schemas
const ActorType = new graphql_1.GraphQLObjectType({
    name: "Actor",
    fields: () => ({
        objectType: { type: graphql_1.GraphQLString },
        account: { type: AccountType }
    })
});
const AccountType = new graphql_1.GraphQLObjectType({
    name: "Account",
    fields: () => ({
        name: { type: graphql_1.GraphQLString },
        homePage: { type: graphql_1.GraphQLString }
    })
});
const VerbType = new graphql_1.GraphQLObjectType({
    name: 'Verb',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        objectType: { type: graphql_1.GraphQLString },
        display: { type: DictionaryType }
    })
});
const ObjectType = new graphql_1.GraphQLObjectType({
    name: "Object",
    fields: () => ({
        objectType: { type: graphql_1.GraphQLString },
        id: { type: graphql_1.GraphQLString },
        definition: { type: OtherType }
    })
});
const ContextType = new graphql_1.GraphQLObjectType({
    name: "Context",
    fields: () => ({
        platform: { type: graphql_1.GraphQLString },
        objectType: { type: graphql_1.GraphQLString },
        contextActivities: { type: ListType }
    })
});
const ListType = new graphql_1.GraphQLObjectType({
    name: "List",
    fields: () => ({
        other: { type: new graphql_1.GraphQLList(DefinitionType) }
    })
});
const DefinitionType = new graphql_1.GraphQLObjectType({
    name: "Definition",
    fields: () => ({
        definition: { type: OtherType }
    })
});
const OtherType = new graphql_1.GraphQLObjectType({
    name: "Additional",
    fields: () => ({
        name: { type: DictionaryType },
        description: { type: DictionaryType },
        type: { type: graphql_1.GraphQLString }
    })
});
const DictionaryType = new graphql_1.GraphQLObjectType({
    name: "Dictionary",
    fields: () => ({
        en_US: { type: graphql_1.GraphQLString }
        // text: {type: GraphQLString}
    })
});
const StatementType = new graphql_1.GraphQLObjectType({
    name: 'Statement',
    fields: () => ({
        actor: { type: ActorType },
        verb: { type: VerbType },
        context: { type: ContextType },
        object: { type: ObjectType }
    })
});
const MainRootResolver = new graphql_1.GraphQLObjectType({
    name: 'RootResolver',
    fields: {
        search: {
            type: new graphql_1.GraphQLList(PostType),
            args: {
                unit: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (root, args, context) => {
            }
        },
        search_statements: {
            type: new graphql_1.GraphQLList(StatementType),
            args: {
                unit: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (root, args, context) => __awaiter(this, void 0, void 0, function* () {
                const unitId = args.unit;
                return yield utils.importSocialMediaStatementsForUnit(unitId);
            })
        }
    }
});
const MainSchema = new graphql_1.GraphQLSchema({
    query: MainRootResolver
});
const app = express_1.default();
app.listen(3154, () => console.log("Server Started: localhost:3154"));
app.use("/graphql", express_graphql_1.default({
    schema: MainSchema,
    graphiql: true
}));
app.use("/graph", express_graphql_1.default({
    schema: MainSchema,
    graphiql: false
}));
