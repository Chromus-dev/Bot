const config = require('../config.json');

module.exports = {
	name: 'suggest',
	description: 'Suggests an idea',
	usage: `suggest <idea>`,
	execute(client, message, args, Discord) {
		if (message.channel.id != '808733537984970773') return;
		if (!args) return message.reply('You must provide a suggsetion.');

		const channel = message.guild.channels.cache.find((c) => c.id === config.suggsetChannel);

		let idea = args.join(' ').replace(/-bug/g, '');
		const embed = new Discord.MessageEmbed()
			.setColor(config.color)
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(idea);
		channel
			.send(embed)
			.then((msg) => {
				msg.react('👍');
				msg.react('👎');
				message.delete();
			})
			.catch((err) => {
				message.reply('There was an error suggesting that.');
				console.log(err);
			});
	}
};
