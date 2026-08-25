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
    
    // Запуск 3D-камеры глаз бота на внутреннем порту 3001
    try {
      mineflayerViewer(bot, { port: 3001, firstPerson: true });
      console.log('3D Visual eye sockets tracking on port 3001.');
    } catch (e) {
      console.log('Camera frame error:', e.message);
    }
  });

  bot.on('chat', (username, message) => {
    if (message.toLowerCase().trim() === 'bot') {
      bot.chat('👁️ [MATRIX INTERCEPT] Establishing visual eye link to your panel...');
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

// Главный цикл ИИ
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

// НОВЫЙ ИНТЕРФЕЙС: КАМЕРА ВНУТРИ КРУГА, МОЗГ В НИЖНЕМ ЛЕВОМ УГЛУ
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WorkerBot System Core Matrix</title>
      <style>
        body { background-color: #030305; color: #00ffcc; font-family: 'Courier New', monospace; padding: 20px; overflow: hidden; }
        .hud-container { display: flex; justify-content: space-around; align-items: center; height: 85vh; border: 2px solid #005544; background: radial-gradient(circle, #091316 0%, #020305 100%); position: relative; }
        .screen-panel { width: 45%; height: 85%; border: 1px dashed #00aa88; background: rgba(0, 15, 12, 0.4); position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 8px; }
        h2 { text-shadow: 0 0 10px #00ffcc; color: #ffffff; text-transform: uppercase; }
        
        /* КРУГЛЫЙ ИНТЕРФЕЙС ДЛЯ КАМЕРЫ (ГЛАЗ БОТА) */
        .eye-camera-frame {
          width: 75%;
          height: 55%;
          border: 2px solid #ff0055;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 25px rgba(255, 0, 85, 0.4);
          background: #000;
        }
        .camera-stream {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        /* МОЗГ БОТА ПЕРЕЕХАЛ В НИЖНИЙ ЛЕВЫЙ УГОЛ */
        .brain-shifted-panel {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 180px;
          height: 110px;
          border: 2px solid #00ffcc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(5, 15, 15, 0.8);
          box-shadow: 0 0 15px rgba(0,255,204,0.3);
          animation: pulse 2.5s infinite ease-in-out;
        }

        .right-radar-oval {
          width: 300px;
          height: 190px;
          border: 2px solid #00ffcc;
          border-radius: 50%;
          position: relative;
        }
        
        .node { width: 6px; height: 6px; background: #ffffff; border-radius: 50%; position: absolute; box-shadow: 0 0 8px #ffff00; }
        .line { position: absolute; background: rgba(0, 255, 204, 0.35); height: 1px; transform-origin: top left; }
        .data-overlay { position: absolute; bottom: 20px; left: 20px; font-size: 13px; line-height: 1.7; }
        .right-overlay { position: absolute; bottom: 20px; left: 20px; font-size: 13px; line-height: 1.7; }
        
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); box-shadow: 0 0 25px rgba(0,255,204,0.5); } 100% { transform: scale(1); } }
      </style>
    </head>
    <body>
      <h2>📡 COGNITIVE CYBER-HUD MAIN MATRIX // LINK ONLINE</h2>
      <div class="hud-container">
        
        <!-- ЛЕВАЯ ПАНЕЛЬ: ТЕПЕРЬ С РЕАЛЬНОЙ 3D КАМЕРОЙ ГЛАЗ БОТА ВНУТРИ КРУГА -->
        <div class="screen-panel">
          <h2>[ Eye Sensor HUD ]</h2>
          <div class="eye-camera-frame">
            <!-- Сюда транслируются живые чанки, которые видит бот перед собой -->
            <iframe class="camera-stream" src="http://localhost:3001"></iframe>
          </div>
          
          <!-- Данные под камерой -->
          <div class="data-overlay" style="margin-top: 130px; position: static; width: 85%;">
            <div style="height: 40px;"></div> <!-- Отступ под мозг -->
            <div>CURRENT OBJECTIVE: <span id="obj-ui" style="color:#fff; font-weight:bold;">${currentObjective}</span></div>
            <div>SECTOR VECTOR: <span id="pos-ui">Tracking coordinates...</span></div>
          </div>

          <!-- МОЗГ СЮДА! Твой красный квадрат "Brain Here!" -->
          <div class="brain-shifted-panel">
            <div style="position: relative; width: 100%; height: 100%;">
              <div class="node" style="top: 25%; left: 30%;"></div>
              <div class="node" style="top: 55%; left: 20%;"></div>
              <div class="node" style="top: 45%; left: 65%;"></div>
              <div class="node" style="top: 70%; left: 45%;"></div>
              <div class="line" style="top: 27%; left: 32%; width: 45px; transform: rotate(45deg);"></div>
              <div class="line" style="top: 47%; left: 67%; width: 35px; transform: rotate(110deg);"></div>
              <div style="position: absolute; bottom: 5px; width: 100%; text-align: center; color: #00ffcc; font-size: 10px; font-weight: bold;">BRAIN_MATRIX</div>
            </div>
          </div>
        </div>

        <!-- ПРАВАЯ ПАНЕЛЬ: ЧИСТЫЙ ТРЕКЕР СИНАПТИЧЕСКОЙ МАТРИЦЫ -->
        <div class="screen-panel">
          <h2>[ Synaptic Matrix Array ]</h2>
          <div class="right-radar-oval">
            <div class="node" style="top: 35%; left: 25%;"></div>
            <div class="node" style="top: 65%; left: 55%;"></div>
            <div class="line" style="top: 37%; left: 27%; width: 110px; transform: rotate(35deg);"></div>
          </div>
          <div class="right-overlay">
            <div>DIAMONDS ACQUIRED: <span id="dm-ui" style="color:#00ffcc;">${totalDiamondsMined}</span></div>
            <div>PLAYER COMBAT KILLS: <span id="pk-ui" style="color:#ff0055;">${totalPlayersKilled}</span></div>
          </div>
        </div>

      </div>

      <script>
        setInterval(async () => {
          try {
            const res = await fetch('/cloud-link');
            const data = await res.json();
      // Keep checking the telemetry updates every 1 second
      script
        setInterval(async () => {
          try {
            const res = await fetch('/cloud-link');
            const data = await res.json();
            document.getElementById('obj-ui').innerText = data.objective;
            document.getElementById('pos-ui').innerText = data.position;
            document.getElementById('dm-ui').innerText = data.diamonds;
            document.getElementById('pk-ui').innerText = data.kills;
          } catch (e) {
            // Standby if transmission lapses
          }
        }, 1000);
      script
    </body>
    </html>
  `);
});

// JSON API API endpoint layout for the local computer to query tracking updates
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

// Start the Express network server listener channel
app.listen(PORT, '0.0.0.0', () => {
  console.log('Web server listening on port ' + PORT);
});
