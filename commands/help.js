const fs = require('fs');
const { prefix, color } = require('../config.json');

const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));

module.exports = {
	name: 'help',
	description: 'This command',
	aliaes: [ 'commands', 'cmd', 'cmds', 'command' ],
	execute(client, message, args, Discord) {
		var cmdList = [];

		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);
			if (command.name && command.description && command.usage && command.name != 'template') {
				cmdList.push(command.name);
				cmdList.push(command.description);
				cmdList.push(prefix + command.usage);
			} else {
				continue;
			}
		}

		var responseEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle(`Commands`)
			.setFooter('<required> [optional]')
			.setThumbnail('../HarvestClientTitle.png');

		for (var i = 0; i < cmdList.length; i = i + 3) {
			responseEmbed.addFields({ name: cmdList[i], value: `${cmdList[i + 1]} \n \`${cmdList[i + 2]}\`` });
		}

		message.channel.send(responseEmbed);
	}
};
