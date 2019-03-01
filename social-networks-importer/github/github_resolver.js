const github = require('./github');
const lrs = require('../learn_toolkit/lrs');
const db = require('../mongodbutils').getDb();
const ObjectId = require('mongodb').ObjectId;
const github_filter = require('../filters/github_filter');

module.exports.Repository = async function(args) {
	result = await github.Repository(args);
	lrs(result.data, 'github');
	return await github.Repository(args);
}

module.exports.Issues = async function(args) {
	result = await github.Issues(args);
	lrs(result.data, 'github');
	return await github.Issues(args);
}

module.exports.Import = function(args) {
	var query = {};
	var re = {};
	re.data = [];

	return new Promise((resolve, reject) => {

		db.collection('units').findOne({ _id: new ObjectId(args.unit_id) }, async (err, unit) => {
			if (err) console.error(err);



			if (unit) {
				for (usr of unit.users) {
					result = [];
					db.collection('users').findOne({ _id: new ObjectId(usr) }, async (err, res) => {
						if (err) console.error(err);

						query.githubUsrId = res.profile.socialMediaUserIds.github;

						if (res) {

							query.userToken = res.tokens.find(obj => { return obj.platform == "github"});
							 db.collection('unituserplatforms').findOne({ belongsTo: usr.toString(), platform: "github" }, async (err, attachedRepo) => {
								if (err) console.error(err);

								if (attachedRepo) {
									query.id = attachedRepo.platformIdentifier;
									result = await github.Commits(query);
									result = github_filter(result.data, "commits", query.githubUsrId);
									issues = await github.Issues(query);
									issues = github_filter(issues.data.items, "issues", query.githubUsrId);


									// console.log("ISSUES: ", JSON.stringify(issues, null, 2));

									 db.collection('lrs').findOne({ _id: new ObjectId(unit.lrs) }, async (err, unitLrs) => {
										if (err) console.error(err);

										if (unitLrs) {
											await lrs(result, "github", unitLrs, res);
											await lrs(issues, "github", unitLrs, res);
											
											re.data = result.concat(issues);
											resolve(re);
										}
									}); 

								}


							});

						}
					});
				};
			}
		});
	});
}

module.exports.Commits = function(args) {
	var query = {};

	return new Promise((resolve, reject) => {

		db.collection('units').findOne({ _id: new ObjectId(args.unit_id) }, async (err, unit) => {
			if (err) console.error(err);

			if (unit) {
				for (usr of unit.users) {
					db.collection('users').findOne({ _id: new ObjectId(usr) }, async (err, res) => {
						if (err) console.error(err);

						query.githubUsrId = res.profile.socialMediaUserIds.github;

						if (res) {

							query.userToken = res.tokens.find(obj => { return obj.platform == "github"});
							 db.collection('unituserplatforms').findOne({ belongsTo: usr.toString(), platform: "github" }, async (err, attachedRepo) => {
								if (err) console.error(err);

								if (attachedRepo) {
									query.id = attachedRepo.platformIdentifier;
									result = await github.Commits(query);
									result = github_filter(result.data, "commits", query.githubUsrId);
									
									db.collection('lrs').findOne({ _id: new ObjectId(unit.lrs) }, async (err, unitLrs) => {
										if (err) console.error(err);

										if (unitLrs) {
											await lrs(result, "github", unitLrs, res);
											re = {}
											re.data = result;
											resolve(re);
										}
									});

								}


							});

						}
					});
				};
			}
		});
	});
}

module.exports.Commit = async function(args) {
	result = await github.Commit(args);
	lrs(result.data, 'github');
	return await github.Commit(args);
}