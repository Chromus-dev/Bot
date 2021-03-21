const { octokit_chromus, octokit_bot } = require('../index.js');
const config = require('../config.json');

module.exports = {
	name: 'githubissue',
	aliases: [ 'ghissue', 'github', 'gh' ],
	description: 'Opens an issue on GitHub.',
	usage: 'githubissue [repo] [issue title]\n<issue body>\n<options>',
	parameters:
		'**Repo**: In the format `owner/reponame`. If no owner is specified, it will default to `Chromus`. The shortcuts `lic` and `liv` can also be used.\n**Issue Title**: The title of the issue to open.\n**Issue Body**: *optional* The description of the issue. Supports full [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).\n**Options**: *optional* Only works for <@634776327299399721> `; assign [assignee]; label [labels, separated by commas]`',
	availableTo: '@everyone',
	execute(client, message, args, Discord) {
		(async function() {
			let body = message.content.split('\n');
			body.splice(0, 1);
			hasArgs = false;
			if (body.length != 0) {
				if (body[body.length - 1].startsWith('; ')) {
					hasArgs = true;
					issueArgs = body[body.length - 1];
					body.splice(body.length - 1, body.length);
				}
			}
			body = body.join('\n');
			body = body.concat(
				`\n\n> This issue was created by an automation. It was authored in Discord by ${message.author
					.username}, in the Harvest Client server.`
			);

			let title = message.content.split('\n')[0].split(' ');
			title.splice(0, 2);
			title = title.join(' ');

			const specifiedownerrepo = message.content.split('\n')[0].split(' ')[1];

			assignee = null;
			labels = [];
			if (hasArgs)
				for (i of issueArgs.split('; ')) {
					if (i.startsWith('assign ')) {
						assignee = i.split(' ')[1];
					} else if (i.startsWith('label ')) {
						labels = i.substring(6).split(', ');
					}
				}

			if (specifiedownerrepo == 'client') {
				owner = 'Harvest-Client-Team';
				repo = 'Harvest-Client';
			} else if (specifiedownerrepo == 'bot') {
				owner = 'Harvest-Client-Team';
				repo = 'Harvester';
			} else if (!specifiedownerrepo.includes('/')) {
				owner = 'Chromus-dev';
				repo = specifiedownerrepo.split('/')[0];
			} else {
				owner = specifiedownerrepo.split('/')[0];
				repo = specifiedownerrepo.split('/')[1];
			}

			const issueRequestArgs = {
				owner: owner,
				repo: repo,
				title: title,
				body: body,
				assignee: assignee,
				labels: labels
			};
			// console.log(issueRequestArgs);

			try {
				if (message.author.id == '511758610720751626')
					result = await octokit_chromus.request('POST /repos/{owner}/{repo}/issues', issueRequestArgs);
				else result = await octokit_bot.request('POST /repos/{owner}/{repo}/issues', issueRequestArgs);
				// result = await octokit_bot.request('POST /repos/{owner}/{repo}/issues', issueRequestArgs);
				// console.log(result);
				const embed = new Discord.MessageEmbed()
					.setTitle(result.data.title)
					.setURL(result.data.html_url)
					.setAuthor(result.data.user.login, result.data.user.avatar_url)
					.setFooter(result.data.html_url)
					.setColor(config.colors.blue)
					.addField(
						'Repository',
						result.data.repository_url.replace('api.github.com/repos', 'github.com'),
						true
					)
					.addField('Issue #', result.data.number, true);

				var des = result.data.body.split('\n');
				des.pop();
				des.pop();
				embed.setDescription(des.join('\n'));

				message.channel.send(embed);
			} catch (error) {
				console.log(error);
				const embed = new Discord.MessageEmbed()
					.setColor('#ff4133')
					.setTitle('Error')
					.setDescription(`\`\`\`${error}\`\`\``);
				message.channel.send(embed);
			}
		})();
	}
};
