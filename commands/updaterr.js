const { color, roleChannelID, roleDataChannelID } = require('../config.json');
const config = require('../config.json');
const roles = require('../roles.json');

module.exports = {
	name: 'updaterr',
	description: 'Updates reaction role message',
	usage: `updaterr`,
	execute(client, message, args, Discord) {
		if (
			message.member.roles.cache.some((role) => role.id == config.devID) ||
			message.author.id == '634776327299399721'
		) {
			const roleData = roles;
			let fields = [];
			for (i in roleData) {
				fields.push({
					name: String.fromCharCode(8203),
					value: `${roleData[i].emoji} - <@&${roleData[i].role}>`,
					inline: true
				});

				const embed = {
					color: config.colors.yellow,
					title: 'Select your roles!',
					description: 'Choose when you want to be notified.',
					fields: fields
				};
				client.channels.cache
					.get(roleChannelID)
					.messages.fetch({ limit: 1 })
					.then((messages) => messages.last().edit({ embed: embed }));
				// .send({ embed: embed })
				// .then((message) => message.react('📢'));
			}
		}
	}
};
