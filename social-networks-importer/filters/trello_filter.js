

module.exports = function (posts, trelloUsrId) {
	let results = [];

	for (post of posts) {
		if (post.idMemberCreator == trelloUsrId) {
			results.push(post);
		}
	}

	return results;
}