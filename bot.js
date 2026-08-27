const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

const botArgs = {
  host: 'ProgrammersSMP.aternos.me',
  port: 12589,
  username: 'WorkerBot',
  version: '1.21.1'
};

let bot;
let currentObjective = 'SYSTEM_INITIALIZATION';
let totalDiamondsMined = 0;
let totalPlayersKilled = 0;

// 📡 Переменные высокоточного сигнала
let triggerCameraSignal = false;
let signalData = null; 

const SCAN_DISTANCE = 32; 

function initBot() {
  bot = mineflayer.createBot(botArgs);
  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    console.log('⚡ [150 IQ NEURAL CORE] Core system online. Signal Matrix calibrated.');
    const defaultMove = new Movements(bot);
    defaultMove.canDig = true;            
    defaultMove.allow1x1Tower = true;     
    defaultMove.allowParkour = true;      
    bot.pathfinder.setMovements(defaultMove);
  });

  bot.on('chat', (username, message) => {
    if (message.toLowerCase().trim() === 'bot') {
      bot.chat('👁️ [TACTICAL LINK] Pinging matrix satellite. Syncing radar nodes...');
      emitTacticalSignal('MANUAL_PING', bot.entity.position, 0);
    }
  });

  bot.on('death', () => {
    bot.chat('⚡ [CORE REBOOT] Tactical unit destroyed. Signaling backup node.');
    emitTacticalSignal('BOT_DEATH', bot.entity.position, 0);
    setTimeout(() => bot.respawn(), 2000);
  });

  bot.on('end', () => {
    setTimeout(initBot, 5000);
  });
}

// Вспомогательная функция для генерации чистого, информативного сигнала
function emitTacticalSignal(type, position, distance) {
  triggerCameraSignal = true;
  signalData = {
    type: type,
    targetX: position.x.toFixed(1),
    targetY: position.y.toFixed(1),
    targetZ: position.z.toFixed(1),
    distance: distance.toFixed(1),
    timestamp: Date.now()
  };
  // Сигнал активен в течение 2.5 секунд, затем тухнет, если нет новых целей
  setTimeout(() => {
    if (signalData && Date.now() - signalData.timestamp >= 2400) {
      triggerCameraSignal = false;
      signalData = null;
    }
  }, 2500);
}

initBot();

// Высокоскоростной цикл ИИ (800мс)
setInterval(async () => {
  if (!bot || !bot.entity || bot.pathfinder.isMoving()) return;

  // 1. Приоритет №1: Поиск выпавших алмазов на земле
  const droppedDiamond = bot.nearestEntity(e => 
    e.type === 'object' && 
    e.name === 'item' && 
    e.metadata && 
    JSON.stringify(e.metadata).includes('diamond') &&
    bot.entity.position.distanceTo(e.position)  b.name.includes('diamond_ore') || b.name.includes('deepslate_diamond_ore'),
    maxDistance: SCAN_DISTANCE
  });

  if (diamondBlock) {
    currentObjective = 'EXECUTE_TASK: MINE_DIAMOND';
    const dist = bot.entity.position.distanceTo(diamondBlock.position);
    
    // Стабильно посылаем сигнал о нахождении залежей руды
    emitTacticalSignal('DIAMOND_ORE_VEIN', diamondBlock.position, dist);
    
    if (dist <= 4) {
      try {
        bot.clearControlStates();
        await bot.lookAt(diamondBlock.position.offset(0.5, 0.5, 0.5));
        await bot.dig(diamondBlock);
        totalDiamondsMined++;
      } catch (e) {}
    } else {
      execute150IQPath(diamondBlock.position, 'ROUTING_TO_DIAMOND_ORE', 3);
    }
    return;
  }

  // 3. Приоритет №3: Охота на игроков
  const enemy = bot.nearestEntity(e => 
    e.type === 'player' && 
    e.username !== 'Tymofiiplay' && 
    e.username !== 'tymofiiospro2285' && 
    e.username !== bot.username &&
    bot.entity.position.distanceTo(e.position)  0.6) {
        bot.setControlState('jump', true);
      } else {
        bot.setControlState('jump', false);
      }
      bot.swingHand('mainhand');
      bot.attack(enemy);
    } else {
      execute150IQPath(enemy.position, 'APPROACHING_TARGET', 2);
    }
    return;
  }

  // 4. Свободный поиск
  currentObjective = 'STRATEGIC_SCANNING_&_EXPLORATION';
  const randomVector = bot.entity.position.offset(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 20
  );
  execute150IQPath(randomVector, 'EXPLORING_UNKNOWN_SECTOR', 2);

}, 800);

function execute150IQPath(targetPosition, subObjective, range) {
  try {
    const goal = new goals.GoalNear(targetPosition.x, targetPosition.y, targetPosition.z, range);
    bot.pathfinder.setGoal(goal);
  } catch (err) {
    bot.pathfinder.setGoal(null);
  }
}

// Обновленный эндпоинт связи с расширенной телеметрией сигнала
app.get('/cloud-link', (req, res) => {
  const pos = (bot && bot.entity) ? bot.entity.position : { x: 0, y: 0, z: 0 };
  res.json({
    objective: currentObjective,
    position: 'X: ' + pos.x.toFixed(1) + ' Y: ' + pos.y.toFixed(1) + ' Z: ' + pos.z.toFixed(1),
    diamonds: totalDiamondsMined,
    kills: totalPlayersKilled,
    // Мощный телеметрический сигнал для внешнего HUD
    signalActive: triggerCameraSignal,
    signalData: signalData, 
    intelligenceLevel: "150 IQ (Hyper-Calculated & Signal Matrix Mode)",
    pathfinderStatus: bot.pathfinder ? bot.pathfinder.isMoving() : false
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('⚡ 150 IQ Tactical Core Matrix + Telemetry Signal online on port ' + PORT);
});

