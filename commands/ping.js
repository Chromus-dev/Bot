module.exports = {
	name: 'ping',
	description: 'Gets the current ping of the bot',
	usage: `ping`,
	execute(client, message, args, Discord) {
		message.channel.send(`:ping_pong: Pong! The game lasted ${Date.now() - message.createdTimestamp}ms.`);
	}
};
