const { WebClient } = require('@slack/client');

require('dotenv').load();

const token = process.env.SLACK_API

// const web = new WebClient(token);

async function getUser(id) {
	const param = {
		user: id
	};
	return await web.users.info(param);
}

async function getProfile(query) {
	const param = {
		user: query.user
	};
	return await web.users.profile.get(param);
}

async function getPermaLink(message, webClient) {
	const web = webClient;

	const param = {
		channel: message.channel_id,
		message_ts: message.ts
	};
	return await web.chat.getPermalink(param);
}

async function getAllMessages(channel) {
	const web = new WebClient(channel.userToken.accessToken);

	const param = {
		channel: channel.id,
		limit: channel.limit
	};
	result = await web.conversations.history(param);
	for (var element in result.messages) {
		let message = {};
		message.channel_id = channel.id;
		message.ts = result.messages[element].ts;
		result.messages[element]['url'] = await getPermaLink(message, web);
	}
	return result;
}

async function getAllChannels() {
	const param = {
		exclude_archived: true,
		types: 'public_channel, private_channel',
		limit: 100
	};
	return await web.conversations.list(param);
}

async function main() {
	var messages;
	var result;
	const channels = await getAllChannels();
	for (var element in channels.channels) {
		messages = await getAllMessages(channels.channels[element]);
		result = messages.messages;
	};
	return result;
}

async function result() {
	return await main();
}

module.exports.profile = async function(query) {
	return await getProfile(query);
}

module.exports.links = async function(query) {
	return await getPermaLink(query);
}

module.exports.user = async function(query) {
	return await getUser(query);
}

module.exports.channels = async function() {
	return await getAllChannels();
}

module.exports.messages = async function(query) {
	return await getAllMessages(query);
}