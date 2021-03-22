const prefix = '!';
const config = require('../../config.json');

const statusMessages = {
	WAITING: {
		text: '📊 Waiting for community feedback, please vote!',
		color: '#f9b835'
	},
	ACCEPTED: {
		text: '<:check:821638085975867402> Accepted idea! Expect this soon.',
		color: '#89D071',
		emoji: '<:check:821638085975867402>'
	},
	DENIED: {
		text: '❌ Thank you for the feedback, but we are not interested in this idea at this time.',
		color: '#D32F43', // '#ff4133'
		emoji: '❌'
	},
	ACCEPTEDSPECIAL: {
		text: '<:check:821638085975867402> Accepted idea! Expect this soon:tm:',
		color: '#89D071',
		emoji: '<:check:821638085975867402>'
	}
};

module.exports = (Discord, client, message) => {
	function runCommand() {
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command =
			client.commands.get(commandName) ||
			client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (command) command.execute(client, message, args, Discord);
	}

	if (message.channel.id != '808733537984970773') {
		runCommand();
	} else {
		if (message.content.startsWith(prefix) && !message.content.startsWith(`${prefix}suggest`)) return runCommand();
		if (message.author.bot) return;

		let suggestion = message.content;
		if (message.content.startsWith(`${prefix}suggest`)) suggestion = message.content.slice(prefix.length + 7);
		const channel = message.guild.channels.cache.find((c) => c.id === config.suggsetChannel);

		let bug = message.content.match(/--?bug|<@&821083058530287646>/) ? true : false;
		let bot = message.content.match(/--?bot|<@789909103668756491>|<@!789909103668756491>/) ? true : false;
		let client = message.content.match(/--?client/) ? true : false;
		suggestion = suggestion.replace(/--?bug|<@&821083058530287646>/, '');
		suggestion = suggestion.replace(/--?bot|<@789909103668756491>|<@!789909103668756491>/, '');
		suggestion = suggestion.replace(/--?client/, '');

		let footers = [
			`Add --bug to the end of your suggestion to label it as a bug.`,
			`Add --bot to the end of your suggestion to label it as something for the bot.`,
			`Add --client to the end of your suggestion to label it as something for the client.`,
			`Send a message in this channel to create a suggestion!`,
			`If you have a suggestion send it in this channel!`,
			`Have an idea for the client? Send it here!`
		];

		message.delete(); // delete command message and replace with embed

		const status = statusMessages.WAITING;

		const embed = new Discord.MessageEmbed()
			.setColor(status.color)
			.setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(suggestion)
			.addField('Status', status.text, true);

		if (message.attachments.size > 0) {
			message.attachments.map((a) => embed.setImage(a.proxyURL));
		}
		if (bot && bug) {
			embed.setFooter(
				footers[Math.round(Math.random())],
				'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png'
			);
			embed.addField('Type', 'Bot\nBug', true);
		} else if (bot && !client) {
			embed.setFooter(
				footers[1],
				'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png'
			);
			embed.addField('Type', 'Bot', true);
		} else if (bug && !client) {
			embed.setFooter(
				footers[0],
				'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f41b.png'
			);
			embed.addField('Type', 'Bug', true);
		} else if (client && !bot && !bug) {
			embed.setFooter(
				footers[2],
				'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f5a5.png'
			);
			embed.addField('Type', 'Client', true);
		} else if (client && bug && !bot) {
			embed.setFooter(
				footers[Math.floor(Math.random()) == 1 ? 2 : 0],
				'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f5a5.png'
			);
			embed.addField('Type', 'Client\nBug', true);
		} else {
			embed.setFooter(footers[Math.round(Math.random() * footers.length)]);
		}

		channel.send(embed).then((msg) => {
			msg.react('👍').then(() => msg.react('👎'));
		});
	}
};

module.exports.statusMessages = statusMessages;
