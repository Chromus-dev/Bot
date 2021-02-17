const config = require('../config.json');

module.exports = {
	name: 'rrtset',
	description: 'Sets up a reaction role message.',
	usage: `rr`,
	async execute(client, message, args, Discord) {
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
		client.on('messageReactionAdd', async (reaction, user) => {
			if (reaction.message.partial) await reaction.message.fetch();
			if (reaction.partial) await reaction.fetch();
			if (!reaction.message.guild) return;
			client.channels.cache.get(roleDataChannelID).messages.fetch({ limit: 1 }).then(async (messages) => {
				const reactionsConfig = JSON.parse(messages.last().content);
				let availableReactions = [];
				for (i in reactionsConfig) {
					availableReactions.push(reactionsConfig[i].emoji);
				}
				if (reaction.message.channel.id == roleChannelID && availableReactions.includes(reaction.emoji.name)) {
					await reaction.message.guild.members.cache
						.get(user.id)
						.roles.add(reactionsConfig[availableReactions.indexOf(reaction.emoji.name)].role);
				}
			});
		});
		client.on('messageReactionRemove', async (reaction, user) => {
			if (reaction.message.partial) await reaction.message.fetch();
			if (reaction.partial) await reaction.fetch();
			if (user.bot) return;
			if (!reaction.message.guild) return;

			try {
				if (reaction.message.channel.id == channel) {
					config.reactionRoles.roles.forEach(async (role) => {
						if (reaction.emoji.name === role.emoji) {
							await reaction.message.guild.members.cache.get(user.id).roles.remove(role.id);
						} else {
							return;
						}
					});
				}
			} catch (e) {
				console.log(e);
			}
		});
	}
};
