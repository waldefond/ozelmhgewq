const Discord = require('discord.js');
const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const Jimp = require('jimp')
const fs = require('fs');
path = require('path'),
moment = require('moment'),
sqlite = require('sqlite');


const ayarlar = require('./data/ayarlar.json');

const client = new CommandoClient({
    commandPrefix: ayarlar.PREFIX,
    unknownCommandResponse: false,
    owner: ayarlar.SAHIP,
    disableEveryone: false
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
		['sunucu', 'Sunucu Komutları'],
		['bot', 'Bot Komutları'],
		['ayarlar', 'Ayarlar'],
		['admin', 'Admin'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

	sqlite.open(path.join(__dirname, "database.sqlite3")).then((db) => {
		client.setProvider(new SQLiteProvider(db));
	});

	
	
  client.on("guildMemberAdd", async member => {
    const channel = client.provider.get(member.guild.id, 'girisCikis', []);
    if (!channel) return;
    if (member.guild.channels.get(channel) === undefined || member.guild.channels.get(channel) === null) return;
    if (member.guild.channels.get(channel).type === "text") {
              const bg = await Jimp.read("https://cdn.discordapp.com/attachments/475267849460645922/475270776035999752/guildAdds.png");
              const userimg = await Jimp.read(member.user.avatarURL);
              var font;
              if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
              else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
              else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
              await bg.print(font, 430, 170, member.user.tag);
              await userimg.resize(362, 362);
              await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
                setTimeout(function () {
                  member.guild.channels.get(channel).send(new Discord.Attachment("./img/" + member.id + ".png"));
                }, 1000);
                setTimeout(function () {
                  fs.unlink("./img/" + member.id + ".png");
                }, 10000);
          }
      })

      client.on("guildMemberRemove", async member => {
        const channel = client.provider.get(member.guild.id, 'girisCikis', []);
        if (!channel) return;
        if (member.guild.channels.get(channel) === undefined || member.guild.channels.get(channel) === null) return;
        if (member.guild.channels.get(channel).type === "text") {         
                              const bg = await Jimp.read("https://cdn.discordapp.com/attachments/475267849460645922/475270789134811136/guildRemoves.png");
                  const userimg = await Jimp.read(member.user.avatarURL);
                  var font;
                  if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
                  else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
                  else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                  await bg.print(font, 430, 170, member.user.tag);
                  await userimg.resize(362, 362);
                  await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
                    setTimeout(function () {
                      member.guild.channels.get(channel).send(new Discord.Attachment("./img/" + member.id + ".png"));
                    }, 1000);
                    setTimeout(function () {
                      fs.unlink("./img/" + member.id + ".png");
                    }, 10000);
              }
          })
		  
		  
  client.on('message', message => {
    if (!message.guild) return;
    const veri = client.provider.get(message.guild.id, 'linkEngel', []);
    if (veri !== true) return;
    if (veri === true) {
    const swearWords = ["discord.gg", "discord.me", "discordapp.com", "discord.io", "discord.tk"];
    if (swearWords.some(word => message.content.includes(word))) {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.delete();

      return message.reply('Link Engelleme Sistemi **Açık**!').then(message => message.delete(3000));
      }
    }

    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if (regex.test(message.content)==true) {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.delete();
        
        return message.reply('Link Engelleme Sistemi **Açık**!').then(message => message.delete(3000));
      } else {
        return;
      };
    } else {
      return;
    };
    };
  })
  
  client.on('message', message => {
    if (!message.guild) return;
    const veri = client.provider.get(message.guild.id, 'küfürkoruma', []);
    if (veri !== true) return;
    if (veri === true) {
    const swearWords = ["amk", "oç", "gavat", "lan", "öç"];
    if (swearWords.some(word => message.content.includes(word))) {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.delete();

      return message.reply('Küfür Koruması **Aktif**!').then(message => message.delete(3000));
      }
    }

    var regex = new RegExp("");
    if (regex.test(message.content)==true) {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.delete();
        
        return message.reply('Küfür Koruması **Aktif**!').then(message => message.delete(3000));
      } else {
        return;
      };
    } else {
      return;
    };
    };
  })
	
client.on('error', err => {
	console.log(err)
});

client.login(process.env.TOKEN);