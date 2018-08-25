const { Command } = require('discord.js-commando');

module.exports = class BlacklistUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giriş-çıkış-ayarla',
			group: 'ayarlar',
			memberName: 'giriş-çıkış-ayarla',
			description: 'Giriş çıkış kanalı ayarlamanızı/değiştirmenizi sağlar.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},

			args: [
				{
					key: 'kanal',
					prompt: 'Giriş çıkış kanalı hangi kanal olsun? (#kanalismi şeklinde yazınız)',
					type: 'channel',
				}
			]
		});
	}

	hasPermission(msg) {
        if(!msg.guild) return this.client.isOwner(msg.author);
        return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_GUILD');
    }

	async run(message, args) {
			const vt = this.client.provider.get(message.guild.id, 'girisCikis', []);
			const db = this.client.provider.get(message.guild.id, 'girisCikisK', []);
			if (vt === args.kanal.id) {
				this.client.provider.set(message.guild.id, 'girisCikisK', true);
				message.channel.send(` **Giriş çıkış kanalı zaten **<#${args.kanal.id}>** kanalı olarak ayarlı.**`);
			} else {
				this.client.provider.set(message.guild.id, 'girisCikis', args.kanal.id);
				this.client.provider.set(message.guild.id, 'girisCikisK', true);
				return message.channel.send(` **Giriş çıkış kanalı **<#${args.kanal.id}>** kanalı olarak ayarlandı.**`);
			}
	}
};