const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const mineflayerViewer = require('prismarine-viewer').mineflayer;

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
    console.log('Neural Core Online. AI is now active.');
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    
    // START 3D FIRST-PERSON EYES EYE-STREAMER
    try {
      mineflayerViewer(bot, { port: 3001, firstPerson: true });
      console.log('3D Visual eye sockets tracking on port 3001.');
    } catch (e) {
      console.log('Camera frame error:', e.message);
    }
  });

  bot.on('chat', (username, message) => {
    if (message.toLowerCase().trim() === 'bot') {
      bot.chat('👁️ [MATRIX INTERCEPT] Activating first-person overlay on your PC screen...');
      triggerCameraSignal = true;
      setTimeout(() => { triggerCameraSignal = false; }, 3000);
    }
  });

  bot.on('death', () => {
    bot.chat('❌ [KARMA DROP] WorkerBot died. Punishment: No cake from user Tymofiiplay.');
    setTimeout(() => bot.respawn(), 2000);
  });

  bot.on('end', () => {
    setTimeout(initBot, 5000);
  });
}

initBot();

// AI brain loop
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

// THE NEW SCREEN LAYOUT: FIRST-PERSON WORLD VIEWER WITH BRAIN IN THE CORNER
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WorkerBot First-Person Core</title>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #000; font-family: 'Courier New', monospace; overflow: hidden; }
        
        /* FULLSCREEN FIRST PERSON EYES CANVAS */
        .camera-viewport {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          border: none;
          z-index: 1;
        }
        
        /* THE SCI-FI OVERLAY HUD LAYER */
        .hud-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          pointer-events: none;
          border: 4px solid #00ffcc;
          box-sizing: border-box;
          box-shadow: inset 0 0 50px rgba(0,255,204,0.3);
        }
        
        .header-title {
          position: absolute;
          top: 15px;
          left: 20px;
          color: #ffffff;
          text-shadow: 0 0 10px #00ffcc;
          margin: 0;
          font-size: 20px;
          letter-spacing: 2px;
        }

        .telemetry-data {
          position: absolute;
          bottom: 20px;
          left: 20px;
          color: #00ffcc;
          font-size: 14px;
          background: rgba(0,5,5,0.7);
          padding: 15px;
          border: 1px solid #00aa88;
          border-radius: 5px;
        }
        
        /* CORNER BRAIN OVAL CONFIGURATION */
        .brain-corner-panel {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 220px;
          height: 140px;
          background: rgba(3, 5, 8, 0.9);
          border: 2px dashed #00ffcc;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(0,255,204,0.4);
        }

        .brain-oval {
          width: 180px;
          height: 100px;
          border: 2px solid #00ffcc;
          border-radius: 50%;
          position: relative;
          animation: pulse 2s infinite ease-in-out;
        }
        
        .node { width: 6px; height: 6px; background: #fff; border-radius: 50%; position: absolute; box-shadow: 0 0 8px #ffff00; }
        .line { position: absolute; background: rgba(0, 255, 204, 0.4); height: 1px; transform-origin: top left; }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      </style>
    </head>
    <body>

      <!-- EYE SCREEN: RENDERS REAL-TIME MINECRAFT CHUNKS HE LOOKS AT -->
      <iframe class="camera-viewport" src="http://localhost:3001"></iframe>

      <!-- INTERFACE LAYER -->
      <div class="hud-overlay">
        <h2 class="header-title">👁️ LIVE CORE MATRIX OVERLAY // WORKERBOT FIRST-PERSON EYE CHANNELS</h2>
        
        <!-- TEXT STATS LEFT CORNER -->
        <div class="telemetry-data">
          <div style="font-weight: bold; color: #fff; margin-bottom: 5px;">[ SATELLITE TELEMETRY ]</div>
          <div>OBJECTIVE: <span id="obj-ui" style="color: #ffff00;">${currentObjective}</span></div>
          <div>COORDINATES: <span id="pos-ui">Syncing...</span></div>
          <div>DIAMONDS: <span id="dm-ui" style="color: #fff;">${totalDiamondsMined}</span></div>
          <div>KILLS: <span id="pk-ui" style="color: #ff0055;">${totalPlayersKilled}</span></div>
        </div>

        <!-- BRAIN SCENE IN RIGHT CORNER -->
        <div class="brain-corner-panel">
          <div class="brain-oval">
            <div class="node" style="top: 25%; left: 30%;"></div>
            <div class="node" style="top: 60%; left: 20%;"></div>
            <div class="node" style="top: 45%; left: 60%;"></div>
            <div class="node" style="top: 65%; left: 75%;"></div>
            <div class="line" style="top: 27%; left: 32%; width: 50px; transform: rotate(40deg);"></div>
            <div class="line" style="top: 47%; left: 62%; width: 35px; transform: rotate(30deg);"></div>
          </div>
          <div style="position: absolute; top: -22px; right: 10px; color: #00ffcc; font-size: 11px; background: #000; padding: 2px 5px;">BRAIN_MATRIX</div>
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
    position: 'X: ' + pos.x.toFixed(1) + ' Y: ' + pos.y.toFixed(1) + ' Z: ' + pos.z.toFixed(1),
    diamonds: totalDiamondsMined,
    kills: totalPlayersKilled,
    openWindowTrigger: triggerCameraSignal
  });
});

app.listen(PORT, '0.0.0.0', () => console.log('Web server listening on port ' + PORT));
