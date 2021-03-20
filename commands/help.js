const fs = require('fs');
const config = require('../config.json');

const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));

module.exports = {
	name: 'help',
	description: 'This command',
	aliaes: [ 'commands', 'cmd', 'cmds', 'command' ],
	execute(client, message, args, Discord) {
		var cmdList = [];

		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);
			if (
				command.name &&
				command.description &&
				command.usage &&
				command.name != 'sendrr' &&
				command.name != 'updaterr'
			) {
				cmdList.push(command.name);
				cmdList.push(command.description);
				cmdList.push(config.prefix + command.usage);
			} else {
				continue;
			}
		}

		var responseEmbed = new Discord.MessageEmbed()
			.setColor(config.colors.blue)
			.setTitle(`Commands`)
			.setFooter('<required> [optional]')
			.setImage('https://raw.githubusercontent.com/Chromus-dev/Bot/master/HarvestClientTitle.png');

		for (var i = 0; i < cmdList.length; i = i + 3) {
			responseEmbed.addFields({
				name: cmdList[i],
				value: `${cmdList[i + 1]} \n ${cmdList[i + 2]}`,
				inline: true
			});
		}

		message.channel.send(responseEmbed);
	}
};
