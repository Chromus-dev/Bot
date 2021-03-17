const prefix = '!';
const config = require('../config.json');

module.exports = (Discord, client, message) => {
	if (message.channel.id != '808733537984970773') {
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command =
			client.commands.get(commandName) ||
			client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (command) command.execute(client, message, args, Discord);
	} else {
		let suggestion = message.content;
		if (message.content.startsWith(`${prefix}suggest`)) suggestion = message.content.slice(prefix.length + 7);
		const channel = message.guild.channels.cache.find((c) => c.id === config.suggsetChannel);

		//.replace(/-bug/g, '');
		const embed = new Discord.MessageEmbed()
			.setColor(config.color)
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(suggestion);
		channel
			.send(embed)
			.then((msg) => {
				msg.react('👍');
				msg.react('👎');
				message.delete();
			})
			.catch((err) => {
				message.reply('There was an error suggesting that.');
			});
	}
};
