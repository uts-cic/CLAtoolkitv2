const trello = require('./trello');
const lrs = require('../learn_toolkit/lrs');
const db = require('../mongodbutils').getDb();
const ObjectId = require('mongodb').ObjectId;
const trello_filter = require('../filters/trello_filter');

module.exports.Actions = async function(args) {
	var re = {};
	var query = {};
	query.trello_api_key = args.trello_api_key;
	re.data = [];

	return new Promise((resolve, reject) => {
		db.collection('units').findOne({ _id: new ObjectId(args.unit_id) }, (err, unit) => {
			if (err) { console.error(err); reject(err); }

			if (unit) {
				for (usr of unit.users) {
					result = [];

					db.collection('users').findOne({ _id: new ObjectId(usr) }, async (err, res) => {
						if (err) { console.error(err); reject(err); }


						if (res){
							query.trelloUsrId = res.profile.socialMediaUserIds.trello;
							query.userToken = res.tokens.find(obj => { return obj.platform == "trello" });

							db.collection('unituserplatforms').findOne({ belongsTo: usr.toString(), platform: "trello" }, async (err, attachedTrello) => {
								if (err) { console.error(err); reject(err); }

								if (attachedTrello) {
									query.id = attachedTrello.platformIdentifier;
									result = await trello.Actions(query);
									result = trello_filter(result, query.trelloUsrId);

									db.collection('lrs').findOne({ _id: new ObjectId(unit.lrs) }, async (err, unitLrs) => {
										if (err) { console.error(err); reject(err); }

										if (unitLrs) {
											await lrs(result, "trello", unitLrs, res); 
											re.data = re.data.concat(result);
											resolve(re);
										}
									});
								}
							});
						}

					});
				}
			}
		});
	});
}