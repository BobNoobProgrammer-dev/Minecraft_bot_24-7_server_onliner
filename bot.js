const mineflayer = require('mineflayer');
const express = require('express');

// 1. Create a dummy web server for Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Minecraft AFK Bot is running perfectly!');
});

app.listen(PORT, () => {
    console.log(`[Web Server] Listening on port ${PORT}`);
});

// 2. Minecraft Bot Configuration
const botOptions = {
    host: 'donutsmp.net',
    username: process.env.MC_EMAIL,       // Kept secure using Environment Variables
    password: process.env.MC_PASSWORD,   // Only needed if you aren't using Microsoft OAuth tokens
    auth: 'microsoft',
    version: '1.21'
};

const TARGET_PLAYER = 'Tymofiiplay';
let bot;

function startBot() {
    bot = mineflayer.createBot(botOptions);

    bot.once('spawn', () => {
        console.log(`[Bot] Connected to DonutSMP`);
        
        setTimeout(() => {
            console.log(`[Bot] Sending TPA to ${TARGET_PLAYER}`);
            bot.chat(`/tpa ${TARGET_PLAYER}`);
        }, 5000);

        // Anti-AFK loop
        setInterval(() => {
            bot.setControlState('forward', true);
            setTimeout(() => {
                bot.setControlState('forward', false);
                bot.setControlState('back', true);
                setTimeout(() => bot.setControlState('back', false), 250);
            }, 250);
        }, 30000);
    });

    bot.on('end', (reason) => {
        console.log(`[Bot] Disconnected: ${reason}. Reconnecting in 15s...`);
        setTimeout(startBot, 15000);
    });

    bot.on('error', (err) => console.error('[Bot] Error:', err));
}

startBot();
