const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({
	ws: { intents: Discord.Intents.ALL },
	partials: [ 'MESSAGE', 'CHANNEL', 'REACTION' ]
});
const keepAlive = require('./server');
const config = require('./config.json');

module.exports.client = client;

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const handlers = [ 'commandHandler', 'eventHandler' ];

handlers.forEach((handler) => {
	require(`./handlers/${handler}`)(client, Discord);
});

client.once('ready', () => {
	client.user.setActivity('for your commands', { type: 'WATCHING' }); // Status
});

// Welcome Messages
client.on('guildMemberAdd', (member) => {
	client.channels.cache
		.get(config.welcomeEmbeds.channel)
		.send(
			new Discord.MessageEmbed()
				.setDescription(
					`<@${member.id}> ${config.welcomeEmbeds.welcomeMessages[
						Math.floor(Math.random() * config.welcomeEmbeds.welcomeMessages.length)
					]} Be sure to read the <#790243052534366240>`
				)
				.setTitle(`A member has joined! \`${member.guild.memberCount}\``)
				.setColor(config.colors.green)
				.setThumbnail(config.welcomeEmbeds.waveImg)
		);
	let memberRole = member.guild.roles.cache.find((role) => role.id == '790587027745144881');
	member.roles.add(memberRole);
});
client.on('guildMemberRemove', (member) =>
	client.channels.cache
		.get(config.welcomeEmbeds.channel)
		.send(
			new Discord.MessageEmbed()
				.setDescription(
					`${config.welcomeEmbeds.leaveMessages[
						Math.floor(Math.random() * config.welcomeEmbeds.leaveMessages.length)
					]} <@${member.id}>!`
				)
				.setTitle(`A member has left... \`${member.guild.memberCount}\``)
				.setColor(config.colors.red)
				.setThumbnail(config.welcomeEmbeds.waveImg)
		)
);

// Reaction Roles
client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();
	if (!reaction.message.guild) return;

	if (reaction.message.channel.id == config.roleChannelID) {
		client.channels.cache.get(roleDataChannelID).messages.fetch({ limit: 1 }).then(async (messages) => {
			const reactionsConfig = require('./roles.json');
			let availableReactions = [];
			for (i in reactionsConfig) {
				availableReactions.push(reactionsConfig[i].emoji);
			}
			if (
				reaction.message.channel.id == config.roleChannelID &&
				availableReactions.includes(reaction.emoji.name)
			) {
				await reaction.message.guild.members.cache
					.get(user.id)
					.roles.add(reactionsConfig[availableReactions.indexOf(reaction.emoji.name)].role);
			}
		});
	} else if (reaction.message.channel.id == config.suggsetChannel) {
	}
});
client.on('messageReactionRemove', async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();
	if (!reaction.message.guild) return;
	client.channels.cache.get(roleDataChannelID).messages.fetch({ limit: 1 }).then(async (messages) => {
		const reactionsConfig = require('./roles.json');
		let availableReactions = [];
		for (i in reactionsConfig) {
			availableReactions.push(reactionsConfig[i].emoji);
		}
		if (reaction.message.channel.id == config.roleChannelID && availableReactions.includes(reaction.emoji.name)) {
			await reaction.message.guild.members.cache
				.get(user.id)
				.roles.remove(reactionsConfig[availableReactions.indexOf(reaction.emoji.name)].role);
		}
	});
});

keepAlive();
// Always Last
client.login(process.env.TOKEN);
