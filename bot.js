const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');

// FORCE MINECRAFT-PROTOCOL TO REGISTER 26.2 AS A VALID PROTOCOL VERSION
const mcData = require('minecraft-data')('1.21.1');
const states = require('minecraft-protocol/src/states');

// Spoof the protocol metadata structure into the core library registry
require('minecraft-data').versionsByProtocol.pc[26] = mcData.version;
require('minecraft-data').supportedVersions.pc.push('26.2');

const bot = mineflayer.createBot({
  host: 'ProgrammersSMP.aternos.me',
  port: 12589,
  username: 'WorkerBot',
  version: '1.21.1', // Loads the block layout data engine
  overrideToVersion: '26.2' // Forces the network socket to tell the server it is 26.2
});

bot.loadPlugin(pathfinder);

// ================= BOT ACTIONS & AI FUNCTIONS =================

bot.on('spawn', () => {
  console.log('Бот успішно обійшов захист і зайшов на сервер 26.2!');
  bot.chat('Всім привіт! Я зайшов і починаю працювати.');
  
  startChatLoop();
  startActionLoop();
});

function startChatLoop() {
  setInterval(() => {
    const phrases = ["Я копаю блоки під собою!", "Хто хоче пвп?", "Шукаю ресурси...", "Тут безпечно?"];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    bot.chat(randomPhrase);
  }, 20000);
}

function startActionLoop() {
  setInterval(async () => {
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 2000);

    const blockPos = bot.entity.position.offset(0, -1, 0);
    const block = bot.blockAt(blockPos);
    
    if (block && block.name !== 'air' && block.name !== 'bedrock') {
      try { await bot.dig(block); } catch (err) {}
    }
  }, 8000);
}

bot.on('physicsTick', () => {
  const target = bot.nearestEntity(e => e.type === 'hostile' && bot.entity.position.distanceTo(e.position) < 7);
  if (target) {
    bot.chat('О ні, монстр! Тікаю!');
    bot.lookAt(target.position);
    bot.setControlState('back', true);
    bot.setControlState('sprint', true);
  } else {
    bot.setControlState('back', false);
    bot.setControlState('sprint', false);
  }
});

bot.on('death', () => {
  console.log('Бот загинув. Авто-респавн...');
  setTimeout(() => { bot.respawn(); }, 2000);
});

bot.on('error', (err) => console.log('Системна помилка:', err.message));
bot.on('kick', (reason) => console.log('Бота кікнули:', reason));
