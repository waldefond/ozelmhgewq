const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class KillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kill',
			group: 'bot',
			memberName: 'kill',
			description: 'Kills a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	run(msg, args) {
		const { user } = args;
		return msg.say(stripIndents`
			**${msg.author.username}** *kills* **${user.username}**
			https://i.imgur.com/WxD4XMe.gif
			https://pa1.narvii.com/5823/a1ff3fbec588fdde66dd24293f2220233ce42076_hq.gif
		`);
	}
};
