const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. SET UP EXPRESS WEB SERVER FOR RENDER ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is online and running!');
});

app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT} to keep Render service alive.`);
});

// --- 2. MINEFLAYER BOT INITIALIZATION ---
const bot = mineflayer.createBot({
    host: 'localhost',       // Change to your target Minecraft server IP
    port: 25565,             // Change to your target Minecraft server port
    username: 'ExplorerBot',
    version: '1.20.1'        // Set to your server's Minecraft version
});

let explorationInterval = null;

bot.once('spawn', () => {
    console.log(`${bot.username} has successfully spawned in the world!`);
    bot.chat("Hello! I am an exploration bot. Running loop at 50ms interval.");

    // Core 50ms behavior loop (1000ms / 20 = 50ms)
    explorationInterval = setInterval(exploreLoop, 50);
});

bot.on('end', (reason) => {
    console.log(`Bot disconnected. Reason: ${reason}`);
    if (explorationInterval) {
        clearInterval(explorationInterval);
    }
});

// Helper variables to manage random wandering timings within the loop
let changeMovementCooldown = 0;
const movementControls = ['forward', 'back', 'left', 'right', 'jump'];

function exploreLoop() {
    if (!bot.entity) return; // Guard clause if bot data isn't loaded yet

    // --- MOVE AROUND (Exploration Physics) ---
    changeMovementCooldown -= 50; 
    
    if (changeMovementCooldown <= 0) {
        changeMovementCooldown = Math.floor(Math.random() * 2500) + 1500;
        movementControls.forEach(control => bot.setControlState(control, false));

        const randomChoice = Math.random();
        if (randomChoice < 0.6) {
            bot.setControlState('forward', true);
            console.log("[Movement] Walking forward...");
        } else if (randomChoice < 0.8) {
            bot.setControlState('left', true);
            console.log("[Movement] Strafing left...");
        } else {
            bot.setControlState('right', true);
            console.log("[Movement] Strafing right...");
        }

        if (Math.random() < 0.25) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 50);
        }
    }

    // --- SEE THINGS (Look around & analyze environment) ---
    const targetEntity = bot.nearestEntity((entity) => entity.type !== 'object' && entity.username !== bot.username);
    
    if (targetEntity) {
        bot.lookAt(targetEntity.position.offset(0, targetEntity.height, 0));
        
        // --- DO SOMETHING (Interaction) ---
        const distance = bot.entity.position.distanceTo(targetEntity.position);
        if (distance  {
    console.error('Mineflayer Error:', err);
});
