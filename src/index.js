require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Initialize Telegraf
const bot = new Telegraf(process.env.BOT_TOKEN);

// Initialize ethers.js
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // Ganache
console.log(process.env.PRIVATE_KEY);
const privateKey = process.env.PRIVATE_KEY; // Your private key
const wallet = new ethers.Wallet(privateKey, provider);

// Load the contract ABI and address
const contractABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../build/contracts/Voting.json'), 'utf8')).abi;
console.log(contractABI, 'Contract Abi---------------------------------------');
const contractAddress = '0x0548a4932bC4B87498B801B8398765fEF185Da62';
const votingContract = new ethers.Contract(contractAddress, contractABI, wallet);


console.log('--------------------------------------------------------------------');
console.log(votingContract, 'voting contract');

// Middleware to log user info and messages
bot.use((ctx, next) => {
    console.log(`Received message from ${ctx.from?.username}: ${ctx.message?.text}`);
    return next();
});

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));

// Respond to stickers
bot.on('sticker', (ctx) => ctx.reply('👍'));

// Respond to text messages
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

// Inline keyboard example
bot.command('vote', (ctx) => {
    ctx.reply('Select your party to vote:', Markup.inlineKeyboard([
        [Markup.button.callback('🚤 Awami League', 'Awami_League'),
        Markup.button.callback('🌾 Jatiya Party', 'Jatiya_Party')],
        [Markup.button.callback('🌾 Bangladesh National Party', 'Bangladesh_National_Party'),
        Markup.button.callback('🎋🔥 Jatiya Samajtantrik Dal', 'Jatiya_Samajtantrik_Dal')]
    ]));
});

// Handle callback queries from inline buttons
const voteHandler = async (ctx, party) => {
    try {
        console.log(party);
        const tx = await votingContract.vote(party);
        await tx.wait();
        console.log(tx, 'my tx');
        ctx.answerCbQuery();
        ctx.reply(`You voted for ${party}`);
    } catch (error) {
        ctx.answerCbQuery();
        ctx.reply(`Failed to vote: ${error.message}`);
    }
};

bot.action('Awami_League', (ctx) => voteHandler(ctx, 'Awami League'));
bot.action('Jatiya_Party', (ctx) => voteHandler(ctx, 'Jatiya Party'));
bot.action('Bangladesh_National_Party', (ctx) => voteHandler(ctx, 'Bangladesh National Party'));
bot.action('Jatiya_Samajtantrik_Dal', (ctx) => voteHandler(ctx, 'Jatiya Samajtantrik Dal'));

// Launch the bot
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
