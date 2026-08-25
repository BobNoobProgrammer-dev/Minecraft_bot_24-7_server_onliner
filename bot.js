const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000; // Render требует порт 10000 по умолчанию для веб-служб

const botArgs = {
  host: 'ProgrammersSMP.aternos.me',
  port: 12589,
  username: 'WorkerBot',
  version: '1.21.1'
};

let bot;
const BrainMemory = {};
const ACTIONS = ['move_and_explore', 'mine_diamonds', 'hunt_target_player', 'jump_clear'];
let lastSituation = null;
let lastDecision = null;

let currentObjective = 'LEARN_HOW_TO_PLAY';
let totalDiamondsMined = 0;
let totalPlayersKilled = 0;
let triggerCameraSignal = false;
let neuralChaos = 0.5;

function initBot() {
  bot = mineflayer.createBot(botArgs);
  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    console.log('Neural Core Online. AI is now active and autonomous.');
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
  });

  bot.on('chat', (username, message) => {
    if (message.toLowerCase().trim() === 'bot') {
      bot.chat(`👁️ [SIGNAL SENT] Syncing matrix with your local PC screen device...`);
      triggerCameraSignal = true;
      setTimeout(() => { triggerCameraSignal = false; }, 3000);
    }
  });

  bot.on('death', () => {
    bot.chat(`❌ [KARMA DROP] WorkerBot died. Punishment: No cake from user Tymofiiplay.`);
    setTimeout(() => bot.respawn(), 2000);
  });

  // ЕСЛИ БОТА КИКНУЛО, ОН МГНОВЕННО ЗАЙДЕТ ОБРАТНО ТАК ЧТО ОН БУДЕТ 24/7
  bot.on('end', () => {
    console.log('Connection lost. Reconnecting in 5 seconds...');
    setTimeout(initBot, 5000);
  });

  bot.on('error', (err) => console.log('System Error:', err.message));
}

// Запускаем бота
initBot();

// Искусственный интеллект (Decision Loop)
setInterval(async () => {
  if (!bot || !bot.entity) return;
  const situation = analyzeEnvironment();
  
  if (!BrainMemory[situation]) {
    BrainMemory[situation] = {};
    ACTIONS.forEach(act => BrainMemory[situation][act] = 0);
  }

  let decision;
  if (Math.random() < neuralChaos) {
    decision = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  } else {
    const rewards = BrainMemory[situation];
    decision = Object.keys(rewards).reduce((a, b) => rewards[a] > rewards[b] ? a : b);
  }

  await executeCoreAction(decision);
  if (neuralChaos > 0.05) neuralChaos -= 0.002;
}, 1500);

function analyzeEnvironment() {
  if (!bot || !bot.entity) return 'idle_void';
  const diamondBlock = bot.findBlock({ matching: (b) => b.name.includes('diamond'), maxDistance: 16 });
  const targetPlayer = bot.nearestEntity(e => e.type === 'player' && e.username !== 'Tymofiiplay' && e.username !== 'tymofiiospro2285' && e.username !== 'WorkerBot');
  return `${diamondBlock ? 'diamonds' : 'no_minerals'}_${targetPlayer ? 'player' : 'no_targets'}`;
}

async function executeCoreAction(action) {
  if (!bot || !bot.entity) return;
  bot.clearControlStates();
  const diamondBlock = bot.findBlock({ matching: (b) => b.name.includes('diamond'), maxDistance: 16 });
  const enemy = bot.nearestEntity(e => e.type === 'player' && e.username !== 'Tymofiiplay' && e.username !== 'tymofiiospro2285');

  if (diamondBlock) currentObjective = 'TARGET: GET A DIAMOND';
  else if (enemy) currentObjective = 'TARGET: KILL ONE PLAYER';
  else currentObjective = 'NEVER AFK: LEARNING TO PLAY';

  switch (action) {
    case 'move_and_explore':
      bot.setControlState('forward', true);
      if (Math.random() > 0.7) bot.look(Math.random() * Math.PI * 2, 0);
      break;
    case 'mine_diamonds':
      if (diamondBlock) {
        try {
          bot.lookAt(diamondBlock.position);
          bot.setControlState('attack', true);
          await bot.dig(bot.blockAt(diamondBlock.position));
          totalDiamondsMined++;
        } catch(e){}
      } else {
        bot.setControlState('forward', true);
      }
      break;
    case 'hunt_target_player':
      if (enemy) {
        bot.lookAt(enemy.position.offset(0, 1.6, 0));
        bot.setControlState('sprint', true);
        bot.setControlState('forward', true);
        if (bot.entity.position.distanceTo(enemy.position) < 3.5) {
          bot.swingHand('mainhand');
          bot.attack(enemy);
        }
      } else {
        bot.setControlState('left', true);
      }
      break;
    case 'jump_clear':
      bot.setControlState('forward', true);
      bot.setControlState('jump', true);
      break;
  }
}

// ВЕБ-ИНТЕРФЕЙС ЭКРАНА
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WorkerBot System Matrix</title>
      <style>
        body { background-color: #030305; color: #00ffcc; font-family: 'Courier New', monospace; padding: 20px; overflow: hidden; }
        .hud-container { display: flex; justify-content: space-around; align-items: center; height: 85vh; border: 2px solid #005544; background: radial-gradient(circle, #091316 0%, #020305 100%); }
        .screen-panel { width: 45%; height: 85%; border: 1px dashed #00aa88; background: rgba(0, 15, 12, 0.4); position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 8px; }
        h2 { text-shadow: 0 0 10px #00ffcc; color: #ffffff; text-transform: uppercase; }
        .brain-oval { width: 300px; height: 190px; border: 2px solid #00ffcc; border-radius: 50%; position: relative; animation: pulse 2.5s infinite ease-in-out; }
        .node { width: 8px; height: 8px; background: #ffffff; border-radius: 50%; position: absolute; box-shadow: 0 0 10px #ffff00; }
        .line { position: absolute; background: rgba(0, 255, 204, 0.35); height: 1px; transform-origin: top left; }
        .data-overlay { position: absolute; bottom: 20px; left: 20px; font-size: 13px; line-height: 1.7; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); box-shadow: 0 0 35px rgba(0,255,204,0.5); } 100% { transform: scale(1); } }
      </style>
    </head>
    <body>
      <h2>📡 COGNITIVE CYBER-HUD MAIN MATRIX</h2>
      <div class="hud-container">
        <div class="screen-panel">
          <h2>[ Eye Sensor HUD ]</h2>
          <div style="width: 70%; height: 50%; border: 2px solid #ff0055; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <div style="width: 12px; height: 12px; background: #ff0055; border-radius: 50%; box-shadow: 0 0 10px #ff0055;"></div>
          </div>
          <div class="data-overlay">
            <div>CURRENT OJBECTIVE: <span id="obj-ui" style="color:#fff; font-weight:bold;">\${currentObjective}</span></div>
            <div>SECTOR VECTOR: <span id="pos-ui">Tracking...</span></div>
          </div>
        </div>
        <div class="screen-panel">
          <h2>[ Synaptic Matrix Array ]</h2>
          <div class="brain-oval">
            <div class="node" style="top: 25%; left: 25%;"></div>
            <div class="node" style="top: 55%; left: 15%;"></div>
            <div class="line" style="top: 27%; left: 27%; width: 95px; transform: rotate(45deg);"></div>
          </div>
          <div class="data-overlay">
            <div>DIAMONDS ACQUIRED: <span id="dm-ui" style="color:#00ffcc;">\${totalDiamondsMined}</span></div>
            <div>PLAYER COMBAT KILLS: <span id="pk-ui" style="color:#ff0055;">\${totalPlayersKilled}</span></div>
          </div>
        </div>
      </div>
      <script>
        setInterval(async () => {
          try {
            const res = await fetch('/cloud-link');
            const data = await res.json();
            document.getElementById('obj-ui').innerText = data.objective;
            document.getElementById('pos-ui').innerText = data.position;
            document.getElementById('dm-ui').innerText = data.diamonds;
            document.getElementById('pk-ui').innerText = data.kills;
          } catch(e){}
        }, 1000);
      </script>
    </body>
    </html>
  `);
});

app.get('/cloud-link', (req, res) => {
  const pos = (bot && bot.entity) ? bot.entity.position : { x: 0, y: 0, z: 0 };
  res.json({
    objective: currentObjective,
    position: `X: \${pos.x.toFixed(1)} Y: \${pos.y.toFixed(1)} Z: \${pos.z.toFixed(1)}`,
    diamonds: totalDiamondsMined,
    kills: totalPlayersKilled,
    openWindowTrigger: triggerCameraSignal
  });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Web server listening on port \${PORT}`));
