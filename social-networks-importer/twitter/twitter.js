const Twit = require('twit');
const db = require('../mongodbutils').getDb();
require('dotenv').load();

var twitter = new Twit({
	consumer_key:process.env.TWITTER_CONSUMER_KEY,
	consumer_secret:process.env.TWITTER_CONSUMER_SECRET,
	access_token:process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret:process.env.TWITTER_ACCESS_SECRET,
});

async function search_twitter(search_query, limit) {
	return await twitter.get('search/tweets', {q: search_query, count: limit, tweet_mode: "extended", lang: "en"});
}

async function result(query, limit) {
	return await search_twitter(query, limit);
}

async function user_timeline(id, count, user_token) {
	var twitter = new Twit({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token: user_token.accessToken,
		access_token_secret: user_token.accessSecret
	});

	return await twitter.get('statuses/user_timeline', {user_id: id, count: count, tweet_mode: "extended", include_rts: "false", exclude_replies: "true"});
}

module.exports.search = async function(query) {
	return await result(query.query, query.limit);
}

module.exports.timeline = async function(query, user_token) {
	return await user_timeline(query.id, query.limit, user_token);
}