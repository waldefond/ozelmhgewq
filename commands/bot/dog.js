const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			group: 'bot',
			memberName: 'dog',
			description: 'Responds with a random dog image.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://luscious.net/pictures/album/random-porno_64836/sorted/rating/id/2772582/@_random_porno___29');
			return msg.say(body.url);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
