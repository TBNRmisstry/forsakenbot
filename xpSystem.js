// xpSystem.js
const fs = require('fs');
const file = './players.json';

function loadPlayers() {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(file));
}

function savePlayers(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function addXP(userId, amount) {
  const players = loadPlayers();

  if (!players[userId]) {
    players[userId] = { xp: 0, level: 1 };
  }

  players[userId].xp += amount;

  // Leveling system: 100 XP per level
  const neededXP = players[userId].level * 100;
  if (players[userId].xp >= neededXP) {
    players[userId].level++;
    players[userId].xp -= neededXP;
    console.log(`${userId} leveled up to ${players[userId].level}`);
  }

  savePlayers(players);
}

function getStats(userId) {
  const players = loadPlayers();
  if (!players[userId]) {
    players[userId] = { xp: 0, level: 1 };
    savePlayers(players);
  }
  return players[userId];
}

module.exports = { addXP, getStats };
