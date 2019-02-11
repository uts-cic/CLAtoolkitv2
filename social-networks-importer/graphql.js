const express = require('express');
const express_graphql = require('express-graphql');
const mongodbutil = require('./mongodbutils');

const app = express();

mongodbutil.connectToDb((err) => {
	(err) ? console.log("Could not start importers: " + err) : app.listen(8080, () => console.log('Server activated'));

	const Schema = require('./graph_resolvers/resolvers').schema;

	app.use('/graphql', express_graphql({
		schema: Schema,
		graphiql: true
	}));

	app.use('/graph', express_graphql({
		schema: Schema,
		graphiql: false
	}));
	
});


