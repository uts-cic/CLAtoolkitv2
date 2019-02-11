require('dotenv').load();

token = 'token ' + process.env.GITHUB_API;

// https://octokit.github.io/rest.js/
// Documentation for @octokit/rest

const Octokit = require('@octokit/rest');
/*const octokit = new Octokit ({
	auth: token,
	userAgent: 'octokit/rest.js v1.2.3',
	baseUrl: 'https://api.github.com'
});*/

async function repo(args) {
	let array= [];
	let dict = {};
	result = await octokit.repos.get({
		owner: args.owner,
		repo: args.repo
	});
	array.push(result.data)
	dict['data'] = array;
	return dict;
}

async function issues(args) {
	const octokit = new Octokit ({
		auth: args.userToken.accessToken,
		userAgent: 'CLAToolkit-Importer',
		baseUrl: 'https://api.github.com'
	});

	query = `repo:${args.id}`

	return await octokit.search.issuesAndPullRequests({
		q: query
	});
}

async function commits(args) {
	const octokit = new Octokit ({
		auth: args.userToken.accessToken,
		userAgent: 'CLAToolkit-Importer',
		baseUrl: 'https://api.github.com'
	});

	const splitArgs = args.id.split("/")

	console.log("Owner: ", splitArgs[0]);
	console.log("Repo: ", splitArgs[1]);

	return await octokit.repos.listCommits({
		owner: splitArgs[0],
		repo: splitArgs[1],
	});
}

async function commit(args) {
	let array= [];
	let dict = {};
	result = await octokit.repos.getCommit({
		owner: args.owner,
		repo: args.repo,
		sha: args.sha
	});
	array.push(result.data)
	dict['data'] = array;
	return dict;
}

// "curl -i https://api.github.com/repos/chezecz/mygameslist/commits/d6d5cb4" 

module.exports.Repository = repo;
module.exports.Issues = issues;
module.exports.Commits = commits;
module.exports.Commit = commit;