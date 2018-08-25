const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class EmbedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sunucu-ikon',
            group: 'sunucu',
            memberName: 'sunucu-ikon',
            description: 'Sunucunun ikonunu alırsınız.',
        });    
    }

    run(msg) {

            const embed = new RichEmbed()
            .setColor("RANDOM")
            .setImage(msg.guild.iconURL)
            .setAuthor(msg.guild.name)
            return msg.embed(embed)
        }
};