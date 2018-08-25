const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class BattleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'savaş',
			aliases: ['fight', 'death-battle'],
			group: 'bot',
			memberName: 'battle',
			description: 'Engage in a turn-based battle against another user or the AI.',
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to battle?',
					type: 'user',
					default: ''
				}
			]
		});

		this.fighting = new Set();
	}

	async run(msg, args) { // eslint-disable-line complexity
		const opponent = args.opponent || this.client.user;
		if (opponent.id === msg.author.id) return msg.say('You may not fight yourself.');
		if (this.fighting.has(msg.channel.id)) return msg.say('Only one fight may be occurring per channel.');
		this.fighting.add(msg.channel.id);
		try {
			if (!opponent.bot) {
				await msg.say(`${opponent}, Meydan Okumayı Kabul Etmek İçin (kabul) Yazınız.`);
				const verify = await msg.channel.awaitMessages(res => res.author.id === opponent.id, {
					max: 1,
					time: 30000
				});
				if (!verify.size || !['kabul', 'yes'].includes(verify.first().content.toLowerCase())) {
					this.fighting.delete(msg.channel.id);
					return msg.say('Galiba Karşılaşmayı Red Ettin..');
				}
			}
			let userHP = 500;
			let oppoHP = 500;
			let userTurn = false;
			let guard = false;
			const reset = (changeGuard = true) => {
				if (userTurn) userTurn = false;
				else userTurn = true;
				if (changeGuard && guard) guard = false;
			};
			const dealDamage = damage => {
				if (userTurn) oppoHP -= damage;
				else userHP -= damage;
			};
			const forfeit = () => {
				if (userTurn) userHP = 0;
				else oppoHP = 0;
			};
			while (userHP > 0 && oppoHP > 0) { // eslint-disable-line no-unmodified-loop-condition
				const user = userTurn ? msg.author : opponent;
				let choice;
				if (!opponent.bot || (opponent.bot && userTurn)) {
					const id = userTurn ? msg.author.id : opponent.id;
					await msg.say(stripIndents`
						${user}, Bunlardan Birini Seç **saldır**, **savun**, **ulti**, or **topuk**?
						**${msg.author.username}**: ${userHP}HP
						**${opponent.username}**: ${oppoHP}HP
					`);
					const turn = await msg.channel.awaitMessages(res => res.author.id === id, {
						max: 1,
						time: 30000
					});
					if (!turn.size) {
						await msg.say('Zaman Bitti!');
						forfeit();
						break;
					}
					choice = turn.first().content.toLowerCase();
				} else {
					const choices = ['saldır', 'savun', 'ulti'];
					choice = choices[Math.floor(Math.random() * choices.length)];
				}
				if (choice === 'saldır') {
					const damage = Math.floor(Math.random() * (guard ? 10 : 100)) + 1;
					await msg.say(`${user} Ovv **${damage}** Hasar Vurdu!`);
					dealDamage(damage);
					reset();
				} else if (choice === 'savun') {
					await msg.say(`${user} Savundun!`);
					guard = true;
					reset(false);
				} else if (choice === 'ulti') {
					const hit = Math.floor(Math.random() * 4) + 1;
					if (hit === 1) {
						const damage = Math.floor(Math.random() * (((guard ? 300 : 150) - 100) + 1)) + 100;
						await msg.say(`${user} Şaka Maka Amq **${damage}** Hasar Vurdu!`);
						dealDamage(damage);
						reset();
					} else {
						await msg.say(`${user}'Yumruh Atamadı!`);
						reset();
					}
				} else if (choice === 'topuk') {
					await msg.say(`${user} Gaçınnn!`);
					forfeit();
					break;
				} else {
					await msg.say(`${user}, I do not understand what you want to do.`);
				}
			}
			this.fighting.delete(msg.channel.id);
			return msg.say(stripIndents`
				Ve Savaş Bitti
				**Kazanan:** ${userHP > oppoHP ? `${msg.author} (${userHP}HP)` : `${opponent} (${oppoHP}HP)`}
				**Kaybeden:** ${userHP > oppoHP ? `${opponent} (${oppoHP}HP)` : `${msg.author} (${userHP}HP)`}
			`);
		} catch (err) {
			this.fighting.delete(msg.channel.id);
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
