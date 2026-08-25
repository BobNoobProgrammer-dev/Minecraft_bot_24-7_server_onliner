const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'ProgrammersSMP.aternos.me', // Пряма текстова адреса в лапках
  port: 12589,                       // Твій точний порт з Атерносу
  username: 'WorkerBot',             // Нікнейм бота
  version: false                     // Вимикає сувору перевірку версії
});


bot.loadPlugin(pathfinder);

bot.on('spawn', () => {
  console.log(`${bot.username} successfully connected to the server!`);
  bot.chat('Всім привіт! Я запущений на Render.com і готовий працювати.');
  startChatLoop();
  startActionLoop();
});

function startChatLoop() {
  setInterval(() => {
    const phrases = ["Я працюю 24/7!", "Хто хоче пвп?", "Шукаю ресурси...", "Тут безпечно?"];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    bot.chat(randomPhrase);
  }, 30000);
}

function startActionLoop() {
  setInterval(async () => {
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 1500);

    const blockPos = bot.entity.position.offset(0, -1, 0);
    const block = bot.blockAt(blockPos);
    if (block && block.name !== 'air' && block.name !== 'bedrock') {
      try {
        await bot.dig(block);
      } catch (err) {}
    }
  }, 10000);
}

bot.on('physicsTick', () => {
  const target = bot.nearestEntity(e => e.type === 'hostile' && bot.entity.position.distanceTo(e.position) < 7);
  if (target) {
    bot.lookAt(target.position);
    bot.setControlState('back', true);
    bot.setControlState('sprint', true);
  } else {
    bot.setControlState('back', false);
    bot.setControlState('sprint', false);
  }
});

bot.on('death', () => {
  setTimeout(() => bot.respawn(), 2000);
});

bot.on('error', (err) => console.log('Bot Error:', err));
bot.on('kicked', (reason) => console.log('Bot was kicked:', reason));
