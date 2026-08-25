const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();
const PORT = 3000;

const bot = mineflayer.createBot({
  host: 'ProgrammersSMP.aternos.me',
  port: 12589,
  username: 'WorkerBot',
  version: '1.21.1'
});

bot.loadPlugin(pathfinder);

// Brain simulation telemetry
let brainActivity = 'STABLE_IDLE';
let targetObject = 'None';

bot.on('spawn', () => {
  console.log('Neural link active. Monitoring page ready.');
});

// AI environment processing loop
setInterval(() => {
  const entity = bot.nearestEntity(e => e.type === 'player' || e.type === 'hostile');
  if (entity) {
    targetObject = `${entity.username || entity.name} (Dist: ${bot.entity.position.distanceTo(entity.position).toFixed(1)}m)`;
    brainActivity = entity.type === 'hostile' ? 'THREAT_EVASION_ACTIVE' : 'TARGET_TRACKING_MODE';
  } else {
    targetObject = 'Scanning area...';
    brainActivity = 'STABLE_IDLE';
  }
}, 1000);

// GAME CHAT COMMAND TRIGGERS
bot.on('chat', (username, message) => {
  const msg = message.toLowerCase();
  if (msg === '/camera' || msg === 'camera') {
    bot.chat(`👁️ [NEURAL LINK] Establishing visual link for ${username}...`);
    bot.chat(`🔗 VISION HUD SCREEN: https://onrender.com`);
  }
});

// SERVE THE SCI-FI 3D HUD WIREFRAME INTERFACE
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WorkerBot Brain Scanner HUD</title>
      <style>
        body {
          background-color: #050508;
          color: #00ffcc;
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: 20px;
          overflow: hidden;
        }
        .hud-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 90vh;
          border: 2px solid #005544;
          box-shadow: inset 0 0 30px #003322;
          background: radial-gradient(circle, #0a111a 0%, #030508 100%);
        }
        .screen-panel {
          width: 45%;
          height: 80%;
          border: 1px dashed #00aa88;
          background: rgba(0, 20, 15, 0.4);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }
        h2 { text-transform: uppercase; letter-spacing: 2px; color: #ffffff; text-shadow: 0 0 10px #00ffcc; }
        
        /* THE OVAL NEURAL NET BRAIN WIREFRAME */
        .brain-oval {
          width: 280px;
          height: 180px;
          border: 2px solid #00ffcc;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 20px rgba(0,255,204,0.3);
          animation: pulse 3s infinite ease-in-out;
        }
        .node {
          width: 8px;
          height: 8px;
          background-color: #ffffff;
          border-radius: 50%;
          position: absolute;
          box-shadow: 0 0 12px #ffff00;
        }
        .line {
          position: absolute;
          background-color: rgba(0, 255, 204, 0.4);
          height: 1px;
          transform-origin: top left;
        }
        
        /* TEXT BOX DATA OVERLAYS */
        .telemetry-box {
          position: absolute;
          bottom: 15px;
          left: 15px;
          font-size: 13px;
          line-height: 1.6;
          color: #88ffdd;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.03); opacity: 1; box-shadow: 0 0 30px rgba(0,255,204,0.6); }
          100% { transform: scale(1); opacity: 0.8; }
        }
      </style>
      <script>
        setInterval(async () => {
          try {
            const res = await fetch('/telemetry');
            const data = await res.json();
            document.getElementById('state').innerText = data.state;
            document.getElementById('target').innerText = data.target;
            document.getElementById('pos').innerText = data.position;
          } catch(e){}
        }, 1000);
      </script>
    </head>
    <body>
      <h2>🧠 Cybernetic Core Neural Interface // WorkerBot</h2>
      <div class="hud-container">
        
        <div class="screen-panel">
          <h2>[ Visual Input HUD ]</h2>
          <div style="width: 80%; height: 60%; border: 1px solid #ff0055; border-radius: 50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 15px rgba(255,0,85,0.2);">
            <div style="width: 10px; height: 10px; background:#ff0055; border-radius:50%; box-shadow: 0 0 10px #ff0055;"></div>
            <div style="color: #ff0055; position:absolute; top:25%;">CROSSHAIR_LOCK</div>
          </div>
          <div class="telemetry-box">
            <div>OBJECT_IN_SIGHT: <span id="target">\${targetObject}</span></div>
            <div>COORDINATES: <span id="pos">Recalculating...</span></div>
          </div>
        </div>

        <div class="screen-panel">
          <h2>[ Synaptic Matrix Loop ]</h2>
          <div class="brain-oval">
            <div class="node" style="top: 20%; left: 30%;"></div>
            <div class="node" style="top: 50%; left: 15%;"></div>
            <div class="node" style="top: 75%; left: 40%;"></div>
            <div class="node" style="top: 40%; left: 50%;"></div>
            <div class="node" style="top: 25%; left: 70%;"></div>
            <div class="node" style="top: 60%; left: 80%;"></div>
            
            <div class="line" style="top: 22%; left: 32%; width: 60px; transform: rotate(45deg);"></div>
            <div class="line" style="top: 52%; left: 17%; width: 90px; transform: rotate(-15deg);"></div>
            <div class="line" style="top: 42%; left: 52%; width: 60px; transform: rotate(20deg);"></div>
            <div class="line" style="top: 27%; left: 72%; width: 45px; transform: rotate(70deg);"></div>
            <div class="line" style="top: 77%; left: 42%; width: 110px; transform: rotate(-25deg);"></div>
          </div>
          <div class="telemetry-box">
            <div>BRAIN_CORE_STATE: <span id="state" style="color:#ffff00; font-weight:bold;">\${brainActivity}</span></div>
            <div>SYNAPSE_LOAD: 41.8 GFLOPS</div>
          </div>
        </div>

      </div>
    </body>
    </html>
  `);
});

app.get('/telemetry', (req, res) => {
  const pos = bot.entity ? bot.entity.position : { x: 0, y: 0, z: 0 };
  res.json({
    state: brainActivity,
    target: targetObject,
    position: `X: \${pos.x.toFixed(1)} Y: \${pos.y.toFixed(1)} Z: \${pos.z.toFixed(1)}`
  });
});

app.listen(PORT, () => console.log(`Dashboard listening on port \${PORT}`));
