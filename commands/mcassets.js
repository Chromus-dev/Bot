module.exports = {
	name: 'mcassets',
	description: 'Get a link to the default Minecraft assets for a particular version.',
	usage: `mcassets <version>`,
	execute(client, message, args, Discord) {
		if (args[1] == undefined) 'You need to provide a version!';
		message.channel.send(
			`Browse the assets for version ${args[0]}: <https://github.com/InventivetalentDev/minecraft-assets/tree/${encodeURI(
				args[0]
			)}>\nDirect download link: https://github.com/InventivetalentDev/minecraft-assets/archive/${encodeURI(
				args[0]
			)}.zip\nNote: these links will not work correctly if an invalid version was specified.`
		);
	}
};
