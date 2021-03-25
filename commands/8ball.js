const responses = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes — definitely',
	'You may rely on it',
	'As I see it, yes',
	'Most likely',
	'Outlook good',
	'Yes',
	'Signs point to yes',
	'Reply hazy, try again',
	'Ask again later',
	'Better not tell you now',
	'Cannot predict now',
	'Concentrate and ask again',
	'Don’t count on it',
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful',
	'lol'
];
const { colors } = require('../config.json');

module.exports = {
	name: '8ball',
	description: 'Magic 8ball oooo',
	usage: `8ball <quetion>`,
	execute(client, message, args, Discord, cmd) {
		if (!args[0]) return message.reply(`You must ask the magic 8 ball a question!`);
		message.channel.send(
			new Discord.MessageEmbed()
				.setColor(colors.blue)
				.setAuthor(
					`${message.author.username} asked: ${args.join(' ')}`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTitle(responses[Math.floor(Math.random() * responses.length)])
		);
	}
};
