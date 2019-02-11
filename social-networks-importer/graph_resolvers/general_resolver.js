const twit = require('../twitter/twitter_resolver');
const slack = require('../slack/slack_resolver');
const github = require('../github/github_resolver');
const trello = require('../trello/trello_resolver');

async function twitter(args) {
	if (args.type == 'User') {
		return await twit.User(args);
	}
	if (args.type == 'Search') {
		return await twit.Search(args);
	}
	if (args.type == 'Import') {
		return await twit.User(args);
	}
}

async function slack_req(args) {
	if (args.type == 'Messages') {
		return await slack.Messages(args);
	} 
	if (args.type == 'Channels') {
		return await slack.Channels(args);
	}
	if (args.type == 'Import') {
		return await slack.Messages(args);
	}
}

async function github_req(args) {
	if (args.type == "Repository") {
		return await github.Repository(args);
	}
	if (args.type == "Issues") {
		return await github.Issues(args);
	}
	if (args.type == "Commits") {
		return await github.Commits(args);
	}
	if (args.type == "Commit") {
		return await github.Commit(args);
	}
	if (args.type == "Import") {
		return await github.Import(args);
	}
}

async function trello_req(args) {
	if (args.type == "Import") {
		return await trello.Actions(args);
	} 
}

module.exports.Twitter = twitter;
module.exports.GitHub = github_req;
module.exports.Slack = slack_req;
module.exports.Trello = trello_req;
