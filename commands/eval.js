const { devID } = require('../config.json');

const clean = (text) => {
	if (typeof text === 'string')
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
};
const config = require('../config.json');

module.exports = {
	name: 'eval',
	description: 'Runs direct JS code.',
	async execute(client, message, args, Discord) {
		if (!message.member.roles.cache.some((role) => role.id == devID))
			return message.channel.send("You don't have permission to do that!");

		try {
			const code = args.join(' ');
			let evaled = await eval(`(async () => {${code}})()`);

			if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
			if (evaled.includes(client.token)) return message.channel.send('Token blocked!');

			message.channel.send(clean(evaled), { code: 'js' });
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`js\n${clean(err)}\n\`\`\``);
		}
	}
};
