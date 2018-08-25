const { Command } = require('discord.js-commando');

module.exports = class ModChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'anons-kanal-ayarla',
            aliases: ['anonskanal'],
            group: 'ayarlar',
            memberName: 'anons-kanal-ayarla',
            description: 'Anonslar kanalı ayarlar.',
            guildOnly: true,
			throttling: {
                usages: 3,
                duration: 5
            },
            args: [
                {
                    key: 'channel',
                    prompt: 'Hangi kanal anons kanalı olarak kullanılsın?',
                    type: 'channel'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        if(!msg.guild) return this.client.isOwner(msg.author);
        return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
    }
    

    async run(msg, args) {
        
        const { channel } = args;
        msg.guild.settings.set('anonsKanal', channel.id);
        return msg.reply(`Artık anons kanalımız: <#${channel.id}>`);
    }
};
