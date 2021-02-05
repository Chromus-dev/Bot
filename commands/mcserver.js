const util = require('minecraft-server-util');
const { color } = require('../config.json');

module.exports = {
	name: 'mcserver',
	description: 'Gets the status of a minecraft server.',
	usage: `mcserver <IP> [port]`,
	execute(client, message, args, Discord) {
		if (!args[0]) return message.reply('You must specify a Minecraft server ip.');
		if (!args[1]) serverPort = '25565';
		else serverPort = args[1];

		util
			.status(args[0], { port: parseInt(serverPort) })
			.then((response) => {
				const responseEmbed = {
					title: `${args[0]} Status`,
					fields: [
						{
							name: 'Server Ip',
							value: response.host
						},
						{
							name: 'Online Players',
							value: response.onlinePlayers
						},
						{
							name: 'Max Players',
							value: response.maxPlayers
						},
						{
							name: 'Version',
							value: response.version
						}
					],
					color: color
				};

				message.channel.send({ embed: responseEmbed });
			})
			.catch((error) => {
				message.reply('There was an error finding the server.');
				throw error;
			});
	}
};
