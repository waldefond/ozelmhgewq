const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class AnonsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'anons',
            aliases: ['duyuru'],
            group: 'sunucu',
            memberName: 'anons',
            description: 'Anons yaparsınız',
            examples: ['Merhaba!'],
 			throttling: {
                usages: 3,
                duration: 5
            },
            args: [
                {
                    key: 'baslik',
                    prompt: 'Başlık ne olmasını istersiniz?',
                    type: 'string'
                },
                {
                    key: 'yazi',
                    prompt: 'Duyuruda ne yazmasını istersiniz?',
                    type: 'string'
                },
            ]
        });    
    }
    
    hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
    }
    
    run(msg, args) {
        const kanal = msg.guild.channels.get(msg.guild.settings.get('anonsKanal'));
        if (!kanal) return msg.reply('Anons kanalını bulamıyorum. Lütfen `anons-kanal-ayarla` komutu ile bir anons kanalı belirleyin.');
    
          msg.reply('İşlem Başarılı!');
    
          const { baslik, yazi } = args;
       kanal.send('@everyone').then(msg => msg.delete());
        const embed = new RichEmbed()
        .setAuthor(baslik)   
        .setDescription(yazi)
        .setFooter(`Komut "${msg.author.tag}" tarafından kullanıldı.`)
        .setTimestamp();
        return kanal.send(embed);
    
    }
};