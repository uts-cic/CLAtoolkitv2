const twit = require('./twitter');
const lrs = require('../learn_toolkit/lrs');
const twit_filter = require('../filters/twitter_filter');
const db = require('../mongodbutils').getDb();
const ObjectId = require('mongodb').ObjectId;

module.exports.Search = async function(args) {
	query = {}
	query.query = args.search_query;
	query.limit = args.limit;
	result = await twit.search(query);
	return result.data;
}

module.exports.User = async function(args) {
	query = {}
	query.id = args.screen_name; 
	query.limit = args.limit;

	var result;

	// Will need to use unit ids instead of user screen name
	// Grabs unit with information: users signed up, retrival params (e.g.: twitter is hashtag)
	db.collection('units').findOne( { _id: new ObjectId(args.unit_id) }, async (err, unit) => {
		if (err) console.error(err);

		if (unit) {
			// Find all signed up users and grab their access tokens for twitter
			// their twitter Ids
			unit.users.forEach(user => {
				db.collection('users').findOne({ _id: new ObjectId(user) }, async (err, res) => {
					if (err) console.error(err);

					if (res) {
						query = {};
						query.id = res.profile.socialMediaUserIds.twitter;
						query.limit = args.limit;
						userToken = res.tokens.find(obj => { return obj.platform == "twitter"});

						// grab users timeline using their access token and twitter ids
						tmpResult = await twit.timeline(query, userToken);
						
						hashtag = unit.platforms.find(obj => { return obj.platform == "twitter" });

						// Filter results by hashtag specified in unit data
						tmpResult = twit_filter(tmpResult.data, hashtag.retrieval_param);

						// create and send statements to LRS specified upon unit creation
						db.collection('lrs').findOne({ _id: new ObjectId(unit.lrs) }, async (err, unitLrs) => {
							if (err) console.error(err);

							if (unitLrs) {
								dataextract = await lrs(tmpResult.data, "twitter", unitLrs, res.email);
								result = dataextract.length + " statements Added for Twitter";
							}
						});
					}
				});
			});
		}

	});

	/*result = await twit.timeline(query);
	if (args.hashtag) {
		result = twit_filter(result.data, args.hashtag)
		lrs(result.data, 'twitter');
	}*/
	return result;
}