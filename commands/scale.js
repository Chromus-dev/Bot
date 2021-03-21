const scalePixelArt = require('scale-pixel-art');
const request = require('request').defaults({ encoding: null });

module.exports = {
	name: 'scale',
	description: 'Scales an image.',
	usage: `scale <attachment>`,
	execute(client, message, args, Discord) {
		const scaleAndSend = (inputAttachment, channel) => {
			if (inputAttachment == undefined) {
				message.reply(
					'There was no attachment on that message.\nPing me in a message with an image, or ping the bot in a reply to an image to scale it.'
				);
				return;
			}
			const inputAttachmentURL = inputAttachment.url;

			request.get(inputAttachmentURL, (err, res, inputBuffer) => {
				scalePixelArt(inputBuffer, 20)
					.then((outputBuffer) => {
						const outputAttachment = new Discord.MessageAttachment(outputBuffer, 'response.png');
						if (Buffer.byteLength(outputBuffer) <= 8000000) {
							channel
								.send(outputAttachment)
								.catch((error) =>
									message.reply(
										`Sending the scaled image failed for the following reason:\n\`${error}\``
									)
								);
						} else message.reply('Could not send the scaled image because the file size was too big.');
					})
					.catch((error) =>
						message.reply(`Scaling the image failed for the following reason:\n\`\`\`${error}\`\`\``)
					);
			});
		};

		if (message.reference) scaleAndSend(message.referencedMessage.attachments.first(), message.channel);
		else inputAttachment = scaleAndSend(message.attachments.first(), message.channel);
	}
};
