const sourcebin = require('sourcebin_js');

module.exports = {
	name: 'code',
	description: 'Uploads code to sourcebin',
	aliases: [ 'bin', 'sourcebin', 'srcbin', 'src' ],
	usage: `code <code>`,
	async execute(client, message, args, cmd) {
		if (!args.join(' ')) return message.reply('You must specify code to upload.');
		const originalCode = args.join(' ');
		code = originalCode.substring(5, originalCode.length - 3);
		codeLang = originalCode.substring(3, 5);

		await sourcebin
			.create(
				[
					{
						content: code,
						languageId: codeLang
					}
				],
				{
					title: `Code by ${message.author.tag}`,
					description: `Automagically uploaded by Harvester`
				}
			)
			.then((src) => {
				return message.channel.send(`You code has been automagically uploaded to SourceBin: ${src.short}`);
			})
			.catch((e) => {
				message.reply(`There was an error uploading your code.`);
				console.log(e);
			});
	}
};
