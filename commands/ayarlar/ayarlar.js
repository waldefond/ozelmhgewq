const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');

module.exports = class channelinfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ayarlar',
			group: 'sunucu',
			memberName: 'ayarlar',
			description: 'Sunucudaki ayarları gösterir.',
			guildOnly: true,
		});
	}
	
	    hasPermission(msg) {
        if(!msg.guild) return this.client.isOwner(msg.author);
        return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES');
    }
	
	async run(msg) {
        
        const modlog = msg.guild.channels.get(msg.guild.settings.get('modLog'))
        const anons = msg.guild.channels.get(msg.guild.settings.get('anonsKanal'))
	    const girisCikis = msg.guild.channels.get(msg.guild.settings.get('girisCikis'))
	    const linkEngel = msg.guild.channels.get(msg.guild.settings.get('linkEngel'))
	    const küfürkoruma = msg.guild.channels.get(msg.guild.settings.get('küfürkoruma'))		
		
		
        const embed = new RichEmbed()
        .setAuthor(msg.guild.name, msg.guild.iconURL)	
        .addField('Mod-Log Kanalı', modlog ? modlog : 'Ayarlanmamış.', true)
        .addField('Anons kanalı', anons ? anons : 'Ayarlanmamış.', true)
        .addField('Giriş-Çıkış', girisCikis ? girisCikis : 'Ayarlanmamış.', true)
	    .addField('Link-Engelleme', linkEngel ? linkEngel : 'Kapalı.', false)
	    .addField('Küfür-Koruması', küfürkoruma ? küfürkoruma : 'Kapalı.', false)
		return msg.embed(embed)

	}
}