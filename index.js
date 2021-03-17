const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({
	ws: { intents: Discord.Intents.ALL },
	partials: [ 'MESSAGE', 'CHANNEL', 'REACTION' ]
});
const keepAlive = require('./server');
const config = require('./config.json');
const { statusMessages } = require('./events/guild/message');
const { Octokit } = require('@octokit/core');
const octokit_bot = new Octokit({ auth: process.env.GHTOKEN });

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
		const reactionsConfig = require('./roles.json');
		let availableReactions = [];
		for (i in reactionsConfig) {
			availableReactions.push(reactionsConfig[i].emoji);
		}
		if (availableReactions.includes(reaction.emoji.name)) {
			await reaction.message.guild.members.cache
				.get(user.id)
				.roles.add(reactionsConfig[availableReactions.indexOf(reaction.emoji.name)].role);
		}
		// suggestion system
	} else if (reaction.message.channel.id == config.suggsetChannel && !user.bot) {
		let message = reaction.message;
		const channelId = message.channel.id;

		var newStatus;

		if (reaction.emoji.name == 'check') {
			// accepted
			newStatus = statusMessages.ACCEPTED;
		} else if (reaction.emoji.name == '❌') {
			// denied
			newStatus = statusMessages.DENIED;
		} else return;

		const oldEmbed = message.embeds[0];
		const newEmbed = new Discord.MessageEmbed()
			.setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL)
			.setDescription(oldEmbed.description)
			.setColor(newStatus.color)
			.addField('Status', newStatus.text)
			.setFooter(oldEmbed.footer.text, oldEmbed.footer.iconURL);

		// if embed has bot icon in footer
		// gh auto issue
		if (
			oldEmbed.footer.iconURL ==
				'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png' &&
			newStatus == statusMessages.ACCEPTED
		) {
			let body = newEmbed.description;
			body = body.concat(
				`\n\n> This issue was created by an automation. It was authored in Discord by ${newEmbed.author
					.name}, in the Harvest Client server.`
			);

			let title;
			let titleArr = newEmbed.description.split(/ +/);

			if (titleArr.length >= 5) {
				title = `${titleArr[0]} ${titleArr[1]} ${titleArr[2]} ${titleArr[3]} ${titleArr[4]}`;
			} else {
				title = titleArr.join(' ');
			}

			repo = 'Harvester';
			owner = 'Harvest-Client-Team';
			assignee = 'Chromus-dev';
			labels = oldEmbed.bug ? [ 'bug' ] : [];

			const issueRequestArgs = {
				owner: owner,
				repo: repo,
				title: title,
				body: body,
				assignee: assignee,
				labels: labels
			};

			try {
				result = await octokit_bot.request('POST /repos/{owner}/{repo}/issues', issueRequestArgs);
				newEmbed.description = `${newEmbed.description} | [[GitHub Issue]](${result.data.html_url})`;
			} catch (error) {
				console.error(error);
			}
		}
		// edit message to have new embed
		message.edit({ embed: newEmbed });

		reaction.remove();
		message.react(newStatus.emoji);
	}
});
client.on('messageReactionRemove', async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();
	if (!reaction.message.guild) return;

	if (reaction.message.channel.id == config.roleChannelID) {
		const reactionsConfig = require('./roles.json');
		let availableReactions = [];
		for (i in reactionsConfig) {
			availableReactions.push(reactionsConfig[i].emoji);
		}
		if (availableReactions.includes(reaction.emoji.name)) {
			await reaction.message.guild.members.cache
				.get(user.id)
				.roles.remove(reactionsConfig[availableReactions.indexOf(reaction.emoji.name)].role);
		}
		// suggestion system
	} else if (reaction.message.channel.id == config.suggsetChannel && !user.bot) {
		let message = reaction.message;
		const channelId = message.channel.id;

		var newStatus;

		if (reaction.emoji.name == 'check') {
			// accepted
			newStatus = statusMessages.ACCEPTED;
		} else if (reaction.emoji.name == '❌') {
			// denied
			newStatus = statusMessages.DENIED;
		}
	}
});

keepAlive();
// Always Last
client.login(process.env.TOKEN);
