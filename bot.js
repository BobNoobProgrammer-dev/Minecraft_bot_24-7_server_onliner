const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'ProgrammersSMP.aternos.me',
  port: 12589,
  username: 'WorkerBot',
  version: '1.21.1' // Завдяки ViaVersion бот спокійно зайде на сервер 26.2
});

bot.loadPlugin(pathfinder);

// ================= ШТУЧНИЙ ІНТЕЛЕКТ БОТА =================

bot.on('spawn', () => {
  console.log('Бот успішно зайшов на сервер!');
  bot.chat('Всім привіт! Я зайшов через сумісність версій.');
  
  startChatLoop();
  startActionLoop();
});

function startChatLoop() {
  setInterval(() => {
    const phrases = ["Я тут!", "Хто хоче пвп?", "Копаю блоки...", "Тут безпечно?"];
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
  console.log('Авто-респавн...');
  setTimeout(() => { bot.respawn(); }, 2000);
});

bot.on('error', (err) => console.log('Помилка:', err.message));
bot.on('kick', (reason) => console.log('Кік із сервера:', reason));
