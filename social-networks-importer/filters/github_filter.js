

function filter_commits(githubData, userid) {
	const user_commits = [];
	for (const commit of githubData) {
		if (commit.author.id == userid) {
			user_commits.push(commit);
		} 
	};

	return user_commits;
}

function filter_issues(githubData, userid) {
	const user_issues = [];
	for (const issue of githubData) {
		if (issue.user.id == userid) {
			user_issues.push(issue);
		}
	}

	return user_issues;
}

module.exports = function(githubData, type="commits", userid) {

	switch(type) {
		case "commits": 
			return filter_commits(githubData, userid);
		break;
		case "issues":
			return filter_issues(githubData, userid);
		break;
	}
}