const Discord = require(`discord.js`);
const Canvas = require(`canvas`);
const fs = require(`fs`);

const config = JSON.parse(fs.readFileSync(`config.json`, `utf8`));

const client = new Discord.Client();

client.on('warn', err => console.warn('[WARNING]', err));

client.on('error', err => console.error('[ERROR]', err));

client.on('uncaughtException', (err) => {
  console.log("Uncaught Exception: " + err)
  process.exit(1)
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('[FATAL] Possibly Unhandled Rejection at: Promise ', promise, ' reason: ', reason.message);
});

client.on('disconnect', () => {
  console.warn('Disconnected!')
  process.exit(0);
})

client.on('reconnecting', () => console.warn('Reconnecting...'))
resizeText = (canvas, txt, maxWidth, fontSize) => {
  // canvas created in constructor
  ctx = canvas.getContext(`2d`)
  ctx.font = `${fontSize}px League Spartan Bold`;
  var minFontSize = 10;
  var width = ctx.measureText(txt).width;
  if (width > maxWidth) {
    var newfontSize = fontSize;
    var decrement = 1;
    var newWidth;
    while (width > maxWidth) {
      newfontSize -= decrement;
      if (newfontSize < minFontSize) {
        return { fontSize: `${minFontSize}px` };
      }
      ctx.font = `${newfontSize}px League Spartan Bold`;
      newWidth = ctx.measureText(txt).width;
      if (newWidth < maxWidth && decrement === 1) {
        decrement = 0.1;
        newfontSize += 1;
      } else {
        width = newWidth;
      }
    }
    return { fontSize: `${newfontSize}px` };
  } else {
    return { fontSize: `${fontSize}px` };
  }
}

const { registerFont } = require(`canvas`);
registerFont(`league.otf`, { family: `League Spartan Bold` });
registerFont(`edo.ttf`, { family: `Edo` });

const al = ["PLAYING", "WATCHING"];
const aln = ["guild.memberCount", "Watching"];
let value = 0;
client.on(`ready`, () => {
  console.log(`${client.user.tag} is Ready!`);
  setInterval(() => {
    const index = Math.floor(Math.random() * (al.length));
    client.user.setActivity(`${aln[index]}`, { type: `${al[index]}` })
    //client.user.setUsername(value++);
  }, 1000);
});

client.on(`guildMemberAdd`, async member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === config.welchannel);
  const channels = member.guild.channels.cache.find(ch => ch.name === config.welchannels);

  if (!channel) return;
  if (!channels) return;

  client.user.setActivity(`Welcome ${member.user.username}`, { type: 'WATCHING' });
  member.client.user.setUsername(`${member.user.username}`);
  member.client.user.setAvatar`${member.user.displayAvatarURL({ dynamic: true })}`;

  const canvas = Canvas.createCanvas();
  canvas.width = 1440;
  canvas.height = 810;
  const ctx = canvas.getContext(`2d`);

  // for background
  const background = await Canvas.loadImage(`./kmc2.jpg`);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(0, 0);
  ctx.strokeStyle = `#74037b`;
  ctx.strokeRect(0, 0, canvas.width - 1, canvas.height - 1);
  ctx.restore();

  ctx.save();
  ctx.translate(79, 440);
  ctx.font = resizeText(canvas, `${member.user.username}`, 1000, 112);
  ctx.textAlign = `left`;
  ctx.fillStyle = `#ffe479`;
  ctx.fillText(`${member.user.username}`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(135, 580);
  ctx.font = `112px League Spartan`;
  ctx.textAlign = `left`;
  ctx.fillStyle = `#ffe479`;
  ctx.fillText(`#${member.user.discriminator}`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(28, 355);
  ctx.font = "28px League Spartan Bold";
  ctx.fillStyle = `#ff5757`;
  ctx.rotate(90 * Math.PI / 180);
  ctx.fillText(`${member.guild.memberCount}`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(15, 30);
  ctx.font = `22px League Spartan Bold`;
  ctx.fillStyle = `#ffffff`;
  ctx.fillText(`Join : ${member.joinedAt.toLocaleString(`id-ID`, { timeZone: `Asia/Jakarta` })}`, 0, 0);
  ctx.restore();

  // for displayAvatarURL
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: `png`, size: 1024 }));
  ctx.save();
  ctx.translate(0, 0);

  ctx.beginPath();
  ctx.arc(1068, 370, 280, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.closePath();

  ctx.clip();
  ctx.drawImage(avatar, 790, 90, 560, 560);
  ctx.restore();

//795-248 547
//1833-1286 547

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `welcome-image.png`);


  const embed = new Discord.MessageEmbed()
    .setColor(`RANDOM`)
    .setAuthor(`${member.guild.name} @${member.user.id}`, `${member.guild.iconURL()}`)
    .setTitle(config.title)
    .setDescription(`Jangan lupa baca <#786978442016194617>.\nBiar lebih akrab kenalan dulu di <#786983049929424977>.\nSelamat bersenang senang <@${member.user.id}>.`)
    .setThumbnail(`${member.user.displayAvatarURL({ format: `png` })}`)
    .setTimestamp()

  channel.send(attachment);
  channels.send(embed);
});

client.on('guildMemberRemove', async member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === config.welchannel);
  if (!channel) return;

  const canvas = Canvas.createCanvas();
  canvas.width = 1350;
  canvas.height = 650;
  const ctx = canvas.getContext(`2d`);

  // for background
  const background = await Canvas.loadImage(`./nag.png`);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(0, 0);
  ctx.strokeStyle = `#74037b`;
  ctx.strokeRect(0, 0, canvas.width - 1, canvas.height - 1);
  ctx.restore();

  ctx.save();
  ctx.translate(675, 580);
  ctx.font = resizeText(canvas, `${member.user.username}`, 725, 48);
  ctx.textAlign = `center`;
  ctx.fillStyle = `#ffe479`;
  ctx.fillText(`${member.user.username}#${member.user.discriminator}`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(0, 0);
  ctx.beginPath();
  ctx.arc(675, 210, 161, 0, Math.PI * 2, true);
  //  ctx.stroke();
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: `png`, size: 1024 }));
  ctx.drawImage(avatar, 514, 49, 322, 322);
  ctx.restore();

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `goodbye-image.png`);

  channel.send(attachment);
});
client.on(`message`, message => {
  if (message.content === `!join`) {
    client.emit(`guildMemberAdd`, message.member);
  }
  if (message.content === `!leave`) {
    client.emit(`guildMemberRemove`, message.member);
  }
});


var countx, count = 0
client.on(`message`,async message => {
  if (message.channel.id === '792358619983118351') {
    if (message.member.user.bot) return
    if (Number(message.content) === count + 1) {
      count++
      message.delete()

      message.guild.members.cache.get(client.user.id).setNickname(message.author.username)
      //client.user.setAvatar(message.author.avatarURL())
      message.channel.send(`${message.member.nickname} : ${count}`)
    }
    else if (message.member.id !== client.user.id) {
      countx = count+1
      message.delete()
      message.channel.send(` Angka selanjutnya : ${countx} `).then(msg => {
        msg.delete({ timeout: 2000 }).catch(console.error)
      })
    }
    if (message.content === `!count ${countx}`) {
      count = countx;
    }
  }
})
client.login(config.token);