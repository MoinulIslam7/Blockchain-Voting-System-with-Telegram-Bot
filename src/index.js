require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Initialize Telegraf
const bot = new Telegraf(process.env.BOT_TOKEN);

// Initialize ethers.js
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // Ganache
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Load the contract ABI and address
const contractABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../build/contracts/Voting.json'), 'utf8')).abi;
const votingContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

// Middleware to log user info and messages
bot.use((ctx, next) => {
    console.log(`Received message from ${ctx.from?.first_name + ctx.from?.last_name}: ${ctx.message?.text}`);
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
        const tx = await votingContract.vote(party);
        await tx.wait();
        console.log(tx, 'my tx');
        ctx.answerCbQuery();
        ctx.reply(`Hey ${ctx.from.first_name + ' ' + ctx.from.last_name}, You voted for ${party}`);
    } catch (error) {
        if (error.message.includes("You have already voted.")) {
            ctx.answerCbQuery();
            ctx.reply(`Hey ${ctx.from.first_name} ${ctx.from.last_name}, you have already voted.`);
        } else {
            ctx.answerCbQuery();
            ctx.reply(`Failed to vote: ${error.message}`);
        }
    }
};

bot.action('Awami_League', (ctx) => voteHandler(ctx, 'Awami League'));
bot.action('Jatiya_Party', (ctx) => voteHandler(ctx, 'Jatiya Party'));
bot.action('Bangladesh_National_Party', (ctx) => voteHandler(ctx, 'Bangladesh National Party'));
bot.action('Jatiya_Samajtantrik_Dal', (ctx) => voteHandler(ctx, 'Jatiya Samajtantrik Dal'));


// Command to see votes of each party
bot.command('votes', async (ctx) => {
    try {
        const parties = ["Awami League", "Jatiya Party", "Bangladesh National Party", "Jatiya Samajtantrik Dal"];
        let response = 'Votes so far:\n';
        for (const party of parties) {
            const votes = await votingContract.getVotes(party);
            response += `${party}: ${votes}\n`;
        }
        ctx.reply(response);
    } catch (error) {
        console.error('Failed to get votes:', error);
        ctx.reply(`Failed to get votes: ${error.message}`);
    }
});

// Command to see current results
bot.command('results', async (ctx) => {
    try {
        const [parties, votes] = await votingContract.getAllVotes();
        let response = 'Current results:\n';
        for (let i = 0; i < parties.length; i++) {
            response += `${parties[i]}: ${votes[i]}\n`;
        }
        ctx.reply(response);
    } catch (error) {
        console.error('Failed to get results:', error);
        ctx.reply(`Failed to get results: ${error.message}`);
    }
});

// Command to see the winner
bot.command('winner', async (ctx) => {
    const [winner, maxVotes] = await votingContract.getWinner();
    ctx.reply(`The winner is ${winner} with ${maxVotes} votes`);
})


// Launch the bot
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
