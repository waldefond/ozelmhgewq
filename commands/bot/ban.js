const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { filterTopics } = require('../../structures/Util');

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			aliases: ['at'],
			group: 'bot',
			memberName: 'ban',
			description: 'Bans a user and logs the ban to the mod logs.',
			guildOnly: true,
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			args: [
				{
					key: 'member',
					prompt: 'Kimi Banlamak İstersin?',
					type: 'member'
				},
				{
					key: 'reason',
					prompt: 'Sebebi Nedir?',
					type: 'string',
					validate: reason => {
						if (reason.length < 140) return true;
						return 'Lütfen 140 Karakteri Geçmesin.';
					}
				}
			]
		});
	}

	async run(msg, args) {
		const modLog = filterTopics(msg.guild.channels, 'modLog').first();
		const { member, reason } = args;
		if (member.id === msg.author.id) return msg.say('I don\'t think you want to ban yourself...');
		if (member.id === msg.guild.ownerID) return msg.say('Don\'t you think that might be betraying your leader?');
		if (!member.bannable) return msg.say('Onu Banlamak İçin Yetkim Yetmiyor Kusura Bakma.');
		if (member.highestRole.calculatedPosition > msg.member.highestRole.calculatedPosition - 1) {
			return msg.say('Yetkin Düşük Oldu İçin Banlıyamazsın.');
		}
		await msg.say(`Banlamak İstediğine Emin Misin? ${member.user.tag} (${member.id})?`);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 30000
		});
		if (!msgs.size || !['evet', 'yes'].includes(msgs.first().content.toLowerCase())) return msg.say('Çevaplamadın İçin Durduruldu.');
		try {
			await member.send(stripIndents`
				BANLANDINIZ ${msg.guild.name} Tarafından ${msg.author.tag}!
				**Sebeb:** ${reason}
			`);
		} catch (err) {
			await msg.say('Özleden Dm Atılamadı');
		}
		await member.ban({
			days: 7,
			reason: `${msg.author.tag}: ${reason}`
		});
		await msg.say(`Başarı Bir Şekilde Banlandı ${member.user.tag}.`);
		if (!modLog || !modLog.permissionsFor(this.client.user).has('SEND_MESSAGES')) {
			return msg.say('Şuanlık Bir Mod-log Kanalı Belirlenmemiş.');
		} else if (modLog.permissionsFor(this.client.user).has('EMBED_LINKS')) {
			const embed = new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
				.setColor(0xFF0000)
				.setTimestamp()
				.setDescription(stripIndents`
					**Atılan Kişi:** ${member.user.tag} (${member.id})
					**Türü:** Ban
					**Sebeb:** ${reason}
				`);
			return modLog.send({ embed });
		} else {
			return modLog.send(stripIndents`
				**Atılan Kişi ** ${member.user.tag} (${member.id})
				**Türü:** Ban
				**Sebeb:** ${reason}
				**Yetkili Kişi:** ${msg.author.tag}
			`);
		}
	}
};
