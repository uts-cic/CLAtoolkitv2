var MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
var _db;

require("dotenv").load();

module.exports = {
	connectToDb: function (callback) {
		MongoClient.connect(process.env.MONGO_URI, function( err, dbClient) {
			if (err) console.error("ERROR: ", err + ". MONGO_URL: " + process.env.MONGO_URI);
			_db = dbClient.db("clatoolkit-backend");
			return callback( err );
		});
	},

	getDb: function () {
		return _db;
	},

	/* getDetailsForUnitByPlatform: async function(unitId, platform) {
		details = {};

		if (!_db) { console.error("DATABASE NOT SETUP."); }

		await _db.collection('users').findOne({ _id: new ObjectId(unitId) }, async (err, unit) => {
			if (err) console.error(err);

			if (unit) {

			}
		});

	} */
};