const mineflayer = require('mineflayer');
const fs = require('fs');

// Load configuration from config.json
let config;
try {
  const rawdata = fs.readFileSync('config.json');
  config = JSON.parse(rawdata);
} catch (error) {
  console.error('Error loading config.json:', error);
  process.exit(1); // Exit if config loading fails
}

const { host, port, username } = config;

// Bot creation with error handling
let bot;
try {
  bot = mineflayer.createBot({
    host,
    port,
    username,
  });
} catch (error) {
  console.error('Error creating bot:', error);
  process.exit(1);
}


// Constants and variables
const actions = ['forward', 'back', 'left', 'right'];
let lastAction = null;
let lastTime = -1;
const moveInterval = 2000; // Movement interval in milliseconds
const maxRandomDelay = 5000; // Maximum random delay in milliseconds


// Event handlers

bot.on('login', () => {
  console.log('Logged in!');
});

bot.on('error', (err) => {
  console.error('Bot error:', err);
});

bot.on('end', (reason) => {
  console.log('Disconnected:', reason);
});

bot.on('spawn', () => {
  console.log('Spawned in the world!');
  // Start movement after spawning
  startMovement();
});


function getRandomDelay() {
    return Math.random() * maxRandomDelay;
}

function startMovement() {
    setInterval(() => {
        moveBot();
    }, moveInterval + getRandomDelay());
}

function moveBot() {
    if (lastAction) {
        bot.clearControlState(lastAction);
        lastAction = null;
    } else {
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        bot.setControlState(randomAction, true);
        lastAction = randomAction;
    }
}



// Keep the process running
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
