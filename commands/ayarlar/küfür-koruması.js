const { Command } = require('discord.js-commando');

module.exports = class BlacklistUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'küfür-koruması',
			aliases: ['küfürkoruması'],
			group: 'ayarlar',
			memberName: 'küfür-koruması',
			description: 'küfür-koruması.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},

			args: [
				{
					key: 'string',
					prompt: 'Küfür engellensin mi? (evet ya da hayır olarak cevap yazınız)',
					type: 'string',
					validate: string => {
						if (string === 'evet' || string === 'hayır') return true;
						else return 'Lütfen `evet` ya da `hayır` yazınız';
					}
				}
			]
		});
	}

	hasPermission(msg) {
        if(!msg.guild) return this.client.isOwner(msg.author);
        return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_GUILD');
    }

	async run(message, args) {
			if (args.string === "evet") {
				const vt = this.client.provider.get(message.guild.id, 'küfürkoruma', []);
				this.client.provider.set(message.guild.id, 'küfürkoruma', true);
				return message.channel.send(` Küfür Koruma Sistemi : **✔️ Açık**.`);
			}
			if (args.string === "hayır") {
				const vt = this.client.provider.get(message.guild.id, 'küfürkoruma', []);
				this.client.provider.set(message.guild.id, 'küfürkoruma', false);
				return message.channel.send(`Küfür Koruma Sistemi :  **✖️ Kapalı**.`);
			}
	}
};