require('dotenv').config();

const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
console.log(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send Me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply(''));
bot.hears('hi', (ctx) => ctx.reply('Hey There'));
bot.launch();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));