var hashtag_main;
var result = [];
var final_result = {'data': []};

function check_entity(tweet) {
	if (tweet.entities.hashtags.length) {
		for (var hashtag in tweet.entities.hashtags) {
			if (check_hashtag(tweet.entities.hashtags[hashtag].text)) {
				result.push(tweet)
			}
		}
	} 
}

function check_hashtag(hashtag) {
	return (hashtag == hashtag_main);
}

module.exports = function (tweets, hashtag) {
	hashtag_main = hashtag;
	for (var tweet in tweets) {
		check_entity(tweets[tweet]);
	}
	final_result['data'] = result;
	return final_result;
}