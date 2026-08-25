const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');

// 1. НАЛАШТУВАННЯ ПІДКЛЮЧЕННЯ
const bot = mineflayer.createBot({
  host: 'ProgrammersSMP.aternos.me',
  port: 12589,
  username: 'WorkerBot',
  version: '1.21.1',
  // THIS EXPLICITLY BLOCKS THE VERSION CHECK PLUGINS BEFORE CONNECTING
  clientPlugins: {
    versionChecking: false,
    autoVersion: false
  }
});

// ХАК: Видаляємо внутрішній плагін перевірки версії, щоб обійти помилку "Please use 26.2"
if (bot._client && bot._client.plugins) {
  delete bot._client.plugins.versionChecking;
}

bot.loadPlugin(pathfinder);

// 2. ДІЇ ПРИ ВХОДІ НА СЕРВЕР
bot.on('spawn', () => {
  console.log('Бот успішно зайшов на сервер 26.2!');
  bot.chat('Всім привіт! Я зайшов і починаю працювати.');
  
  startChatLoop();
  startActionLoop();
});

// 3. ЦИКЛ РОЗМОВ (Пише в чат кожні 20 секунд)
function startChatLoop() {
  setInterval(() => {
    const phrases = [
      "Я копаю блоки під собою!", 
      "Хто хоче пвп на арені?", 
      "Шукаю ресурси...", 
      "Тут безпечно?"
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    bot.chat(randomPhrase);
  }, 20000);
}

// 4. ЦИКЛ ХОДІННЯ ТА КОПАННЯ (Кожні 8 секунд)
function startActionLoop() {
  setInterval(async () => {
    // Бот випадково йде вперед 2 секунди
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 2000);

    // Логіка копання (Mine): знайти блок під собою і зламати його
    const blockPos = bot.entity.position.offset(0, -1, 0);
    const block = bot.blockAt(blockPos);
    
    if (block && block.name !== 'air' && block.name !== 'bedrock') {
      try {
        await bot.dig(block);
      } catch (err) {
        // Пропускаємо помилку, якщо інструмент не готовий
      }
    }
  }, 8000);
}

// 5. ВТІКАННЯ ВІД МОНСТРІВ (Running from monsters)
bot.on('physicsTick', () => {
  // Шукаємо ворожих мобів у радіусі 7 блоків навколо бота
  const target = bot.nearestEntity(e => e.type === 'hostile' && bot.entity.position.distanceTo(e.position) < 7);
  
  if (target) {
    bot.chat('О ні, монстр! Тікаю!');
    bot.lookAt(target.position);
    // Включаємо біг назад на максимальній швидкості
    bot.setControlState('back', true);
    bot.setControlState('sprint', true);
  } else {
    bot.setControlState('back', false);
    bot.setControlState('sprint', false);
  }
});

// 6. АВТОМАТИЧНИЙ РЕСПАВН (Respawning після смерті)
bot.on('death', () => {
  console.log('Бот загинув. Авто-респавн через 2 секунди...');
  setTimeout(() => {
    bot.respawn(); // Клік по кнопці "Відродитися"
  }, 2000);
});

// Пропуск системних помилок для стабільності 24/7
bot.on('error', (err) => console.log('Системна помилка:', err.message));
bot.on('kick', (reason) => console.log('Бота кікнули:', reason));
