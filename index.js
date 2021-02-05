const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const keepAlive = require('./server');
const { welcomeChannel } = require('./config.json');

module.exports.client = client;

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const handlers = [ 'commandHandler', 'eventHandler' ];

handlers.forEach((handler) => {
	require(`./handlers/${handler}`)(client, Discord);
});

client.once('ready', () => {
	client.user.setActivity('for !help', { type: 'WATCHING' }); // Status
});

// Welcome Messages
client.on('guildMemberAdd', (member) =>
	client.channels.cache.get(welcomeChannel).send(`<@${member.id}> joined the server. \`${member.guild.memberCount}\``)
);
client.on('guildMemberRemove', (member) =>
	client.channels.cache.get(welcomeChannel).send(`<@${member.id}> left the server. \`${member.guild.memberCount}\``)
);

keepAlive();
// Always Last
client.login(process.env.TOKEN);
