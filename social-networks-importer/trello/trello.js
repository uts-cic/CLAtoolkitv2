const Trello = require('node-trello');

async function actions(args) {

	console.log("ARGS: ", args);

	const t = new Trello(args.trello_api_key, args.userToken.accessToken);

	trello_actions = await new Promise((resolve, reject) => {
		t.get('/1/boards/' + args.id + '/actions', (err, body) => {
			if (err) { console.error(err); reject(err); }

			resolve(body);
		});
	});

	 

	// console.log("Trello data: ", JSON.stringify(trello_actions, null, 2));

	return trello_actions;
}


module.exports.Actions = actions;