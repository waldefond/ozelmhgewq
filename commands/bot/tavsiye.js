const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class TavsiyeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tavsiye',
            group: 'bot',
            memberName: 'tavsiye',
            description: 'Bot için tavsiye bildirirsiniz',
            args: [
                {
                    key: 'tavsiye',
                    prompt: 'Ne tavsiyesi bildirmek istersiniz?',
                    type: 'string'
                }
            ]
        });
    }

async run(msg, args) {

    msg.reply('Tavsiyeniz bildirildi!');
    msg.react("✅");

    const embed = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`_**${msg.author.tag}**_ adlı kullanıcının tavsiyesi`)
    .addField(`Kulanıcı Hakkında`, `İsim: ${msg.author.tag}\nID: ${msg.author.id}`)
    .addField("Tavsiye", args.tavsiye)
    .setThumbnail(msg.author.avatarURL)
    .setTimestamp()
    this.client.channels.get("451318607767535626").send(embed);
}
}