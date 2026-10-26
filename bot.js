const mineflayer = require('mineflayer');

// Configuration details for connecting to your server
const bot = mineflayer.createBot({
    host: 'ProgrammersSMP.aternos.me',       // Change to server IP if needed
    port: 25565,             // Change to your server port
    username: 'ExplorerBot',
    version: '26.3'        // Set to your server's Minecraft version
});

let explorationInterval = null;

bot.once('spawn', () => {
    console.log(`${bot.username} has successfully spawned in the world!`);
    bot.chat("Hello! I am an exploration bot. Running loop at 50ms interval.");

    // Start our core 50ms behavior loop (1000ms / 20 = 50ms)
    // Minecraft internally ticks every 50ms, making this perfectly synced.
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

    // --- 1. MOVE AROUND (Exploration Physics) ---
    changeMovementCooldown -= 50; // decrement by 50ms each cycle
    
    if (changeMovementCooldown <= 0) {
        // Reset cooldown to a random window between 1.5 to 4 seconds
        changeMovementCooldown = Math.floor(Math.random() * 2500) + 1500;

        // Clear existing movements
        movementControls.forEach(control => bot.setControlState(control, false));

        // Randomly pick a new directional choice
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

        // 25% chance to jump over an obstacle while moving
        if (Math.random() < 0.25) {
            bot.setControlState('jump', true);
            // Instantly clear jump state next tick so it doesn't hold it down forever
            setTimeout(() => bot.setControlState('jump', false), 50);
        }
    }

    // --- 2. SEE THINGS (Look around & analyze environment) ---
    // Find the closest loaded entity (Player, Mob, or Item Drop) excluding itself
    const targetEntity = bot.nearestEntity((entity) => entity.type !== 'object' && entity.username !== bot.username);
    
    if (targetEntity) {
        // Lock eyes onto the tracking entity's head coordinates
        bot.lookAt(targetEntity.position.offset(0, targetEntity.height, 0));
        
        // --- 3. DO SOMETHING (Interaction) ---
        // If it wanders very close to a mob or player, acknowledge them in logs
        const distance = bot.entity.position.distanceTo(targetEntity.position);
        if (distance  console.error('Mineflayer Error:', err));
