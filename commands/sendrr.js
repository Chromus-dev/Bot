const config = require('../config.json');

module.exports = {
	name: 'sendrr',
	description: 'Sends the reaction role message.',
	usage: `rr`,
	async execute(client, message, args, Discord) {
		if (!message.member.roles.cache.has('811229287184859178')) return;

		const channel = config.reactionRoles.channel;
		const title = config.reactionRoles.title;

		let description = config.reactionRoles.description;
		let roleDescription = config.reactionRoles.roleDescription;
		if (roleDescription.startsWith(' ')) roleDescription = roleDescription.substr(1, roleDescription.length);
		if (roleDescription.endsWith(' ')) roleDescription = roleDescription.substr(0, roleDescription.length - 1);
		config.reactionRoles.roles.forEach((role) => {
			description += `\n${role.emoji} ${roleDescription} ${role.name}`;
		});

		const embed = new Discord.MessageEmbed().setColor(config.color).setTitle(title).setDescription(description);

		let messageEmbed = await message.channel.send(embed);

		config.reactionRoles.roles.forEach((role) => {
			messageEmbed.react(role.emoji);
		});
		message.delete();
	}
};
