const lrs = require('../learn_toolkit/lrs');
const slack = require('./slack');
const db = require('../mongodbutils').getDb();
const ObjectId = require('mongodb').ObjectId;

module.exports.Messages = async function(args) {
	query = {}
	// query.id = args.id;
	query.limit = args.limit;

	// console.log("MESSAGES");

	var result;

	db.collection('units').findOne({_id: new ObjectId(args.unit_id) }, async (err, unit) => {
		if (err) console.error(err);

		if (unit) {
			unit.users.forEach(usr => {
				db.collection('users').findOne({ _id: new ObjectId(usr) }, async (err, res) => {
					if (err) console.error(err);


					if (res) {

						query.userToken = res.tokens.find(obj => { return obj.platform == "slack" });
						console.log("criteria: ", { belongsTo: usr.toString(), platform: "slack" });
						db.collection('unituserplatforms').findOne({ belongsTo: usr.toString(), platform: "slack" }, async (err, attachedSlack) => {
							if (err) console.error(err);

							console.log('unituserplatform: ', attachedSlack);

							if (attachedSlack) {
								query.id = attachedSlack.platformIdentifier;
								result = await slack.messages(query);
								result.messages['channel'] = args.id;

								console.log("SLACK RESULTS: ", result);

								db.collection('lrs').findOne({ _id: new ObjectId(unit.lrs)}, async (err, unitLrs) => {
									dataextract = await lrs(result.messages, "slack", unitLrs, res);
									result = dataextract.length + " statements Added for Slack";

								});
								
							}
						});
					}
				});
			});
		}
	});

	// result = await slack.messages(query);
	// for (var element in result.messages) {
	// 	user = await slack.profile(result.messages[element]);
	// 	result.messages[element]['user'] = user.profile;
	// }
	
	// console.log(result.messages)
	//lrs(result.messages, 'slack');
	return result;
}

module.exports.Channels = async function(args) {
	result = await slack.channels();
	return result;
}