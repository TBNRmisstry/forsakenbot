// xpSystem.js
const fs = require("fs");
const file = "./players.json";

let players = {};

// Load existing data
if (fs.existsSync(file)) {
  players = JSON.parse(fs.readFileSync(file));
}

// Save to file
function saveData() {
  fs.writeFileSync(file, JSON.stringify(players, null, 2));
}

function getRank(level) {
  if (level < 3) return "Rookie";
  if (level < 6) return "Survivor";
  if (level < 10) return "Expert";
  return "Forsaken Master";
}

function initPlayer(userId) {
  if (!players[userId]) {
    players[userId] = { xp: 0, level: 1, wins: 0, losses: 0 };
  }
}

function addXP(userId, amount) {
  initPlayer(userId);
  players[userId].xp += amount;

  while (players[userId].xp >= players[userId].level * 100) {
    players[userId].xp -= players[userId].level * 100;
    players[userId].level++;
  }
  saveData();
}

function recordWin(userId) {
  initPlayer(userId);
  players[userId].wins++;
  addXP(userId, 50);
  saveData();
}

function recordLoss(userId) {
  initPlayer(userId);
  players[userId].losses++;
  saveData();
}

function getProfile(userId, username) {
  initPlayer(userId);
  const p = players[userId];
  return (
    `📜 **${username}'s Profile**\n` +
    `Level: ${p.level} (${getRank(p.level)})\n` +
    `XP: ${p.xp}/${p.level * 100}\n` +
    `Wins: ${p.wins}\nLosses: ${p.losses}`
  );
}

module.exports = { addXP, recordWin, recordLoss, getProfile };
