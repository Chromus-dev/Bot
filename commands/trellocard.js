const config = require('../config.json');
const { TRELLO: trello } = require('../index.js');

const boardID = '5ff1b4272f65d6300b6f2a6e';
const lists = [
	{ name: 'todo', id: '5ff1b43587fe6b0ae9058960' },
	{ name: 'progress', id: '5ff1c882e7a6157c231d6a61' },
	{ name: 'done', id: '5ff1c8874692942538b82339' },
	{ name: 'bugs', id: '5ff4536a0b827785fb4b0a4a' },
	{ name: 'fixed', id: '602d29daa9aa1383a2c2146d' }
];
const actions = [ 'add', 'cards', 'card' ];

module.exports = {
	name: 'trello',
	description: 'Actions to do stuff on trello',
	usage: 'trello <list> <action> <action_params>',
	async execute(client, message, args, Discord) {
		const action = args[0];

		if (!action) return message.reply('You must specify an action!');
		if (!actions.includes(action) && action != 'actions')
			return message.reply(`That is not a valid action!\nThe valid actions are: ${actions.join(', ')}`);

		// actions that dont require a list
		if (action == 'card') {
			// search all lists or card instead of one
			let allCards = await trello.getCardsOnBoard(boardID).then((cards) => {
				// allCards = cards;
				// console.log('setting new cards');
				return cards;
			});
			// console.log(allCards);
			const totalCards = allCards.length;

			let found = false;
			let card = '';
			let i = 0;
			args.shift();
			card = args.join(' ');
			// while not found and i is less than the total number of cards
			try {
				while (!found && i <= totalCards) {
					let c = allCards[i];
					if (c.name.toLowerCase() == card.toLowerCase()) {
						card = c;
						found = true;
					}
					i++;
				}
			} catch (error) {
				return message.reply(
					`That is not a valid card! To see the cards on a list use \`${config.prefix}trello cards <list>\``
				);
			}

			if (i >= totalCards)
				return message.reply(
					`That is not a valid card! To see the cards on a list use \`${config.prefix}trello cards <list>\``
				);

			await trello.getCard(boardID, card.id, function(error, card) {
				if (error) return message.reply('There was an error getting that card!');
				//console.log(card);

				const embed = new Discord.MessageEmbed()
					.setColor(config.colors.blue)
					.setTitle(card.name)
					.setURL(card.shortUrl)
					.setDescription(card.desc);

				if (card.labels.length > 0) {
					embed.addField('Labels', card.labels.map((label) => label.name).join(', '), true);
				}
				done = true;
				return message.channel.send(embed);
			});
		} else if (action == 'actions') {
			const embed = new Discord.MessageEmbed()
				.setColor(config.colors.blue)
				.setTitle('Trello Actions')
				.setDescription(actions.join('\n'));
			return message.channel.send(embed);
		}

		// actions that require a list
		if (!args[1]) return message.reply('You must specify a list!');

		list = lists[lists.findIndex((l) => l.name == args[1])];
		if (list == undefined)
			return message.reply(
				`That is not a valid list!\nThe valid lists are: ${lists.map((e) => e.name).join(', ')}`
			);
		cards = await trello.getCardsOnList(list.id);

		if (action == 'add') {
			if (!args[2]) return message.reply('You must specify a title for the card!');
			args.shift();
			args.shift();
			const fields = args.join(' ').split('; ');
			await trello.addCard(fields[0], fields[1] || '', list.id, function(error, card) {
				if (error) return message.reply('There was an error adding that card!');
				//console.log(card);

				const embed = new Discord.MessageEmbed()
					.setColor(config.colors.blue)
					.setTitle(card.name)
					.setURL(card.shortUrl)
					.setDescription(card.desc);
				return message.channel.send(embed);
			});
		} else if (action == 'cards') {
			const embed = new Discord.MessageEmbed()
				.setColor(config.colors.blue)
				.setFooter(`To get more info about a card, use ${config.prefix}trello card <card>`)
				.setTitle(`Cards on \`${list.name}\``);
			let desc = [];
			cards.map((c) => {
				desc.push(`[${c.name}](${c.url})`);
			});
			embed.setDescription(`${desc.join('\n')}`);
			// console.log(cards[0]);
			if (desc.join('\n').length > 2000)
				return message.channel.send(
					`There are too many cards on \`${list.name}\` to send. Here is a link to the list instead: <https://trello.com/b/${boardID}>`
				);

			return message.channel.send(embed);
		}
	}
};
