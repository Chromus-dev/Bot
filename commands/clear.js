const { devID } = require('../config.json');

module.exports = {
	name: 'clear',
	description: 'Clears a listed amount of messages.',
	aliaes: [ 'delete', 'purge' ],
	usage: `clear <amount>`,
	async execute(client, message, args, Discord) {
		if (!message.member.roles.cache.some((role) => role.id == devID)) return message.reply("You can't do that!");
		if (!args[0]) return message.reply('You must specify an amount of messages to clear.');
		if (isNaN(args[0])) return message.reply('That is not a number!');
		if (args[0] > 100) return message.reply('You cannot delete more than 100 messages.');
		if (args[0] < 1) return message.reply('You must delete at least 1 message.');

		await message.channel.messages.fetch({ limit: args[0] }).then((messages) => {
			message.channel.bulkDelete(Number(args[0]) + 1);
		});
	}
};
