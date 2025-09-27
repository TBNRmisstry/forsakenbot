// xpSystem.js
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, 'players.json');

let players = {};

function loadPlayers() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}, null, 2));
  try {
    players = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('players.json parse error, resetting file.', e);
    players = {};
    savePlayers();
  }
}

function savePlayers() {
  fs.writeFileSync(file, JSON.stringify(players, null, 2));
}

loadPlayers();

function initPlayer(userId) {
  if (!players[userId]) {
    players[userId] = { xp: 0, level: 1, wins: 0, losses: 0,
      roleStats: { survivor: {wins:0,losses:0,xp:0}, killer: {wins:0,losses:0,xp:0} } };
    savePlayers();
  }
}

function addXP(userId, amount, role = null) {
  initPlayer(userId);
  players[userId].xp += amount;
  if (role && players[userId].roleStats[role]) players[userId].roleStats[role].xp += amount;
  while (players[userId].xp >= players[userId].level * 100) {
    players[userId].xp -= players[userId].level * 100;
    players[userId].level++;
  }
  savePlayers();
  return players[userId];
}

function recordWin(userId, role = null) {
  initPlayer(userId);
  players[userId].wins++;
  if (role && players[userId].roleStats[role]) players[userId].roleStats[role].wins++;
  const updated = addXP(userId, 50, role);
  savePlayers();
  return updated;
}

function recordLoss(userId, role = null) {
  initPlayer(userId);
  players[userId].losses++;
  if (role && players[userId].roleStats[role]) players[userId].roleStats[role].losses++;
  savePlayers();
  return players[userId];
}

function getProfile(userId, username) {
  initPlayer(userId);
  const p = players[userId];
  const surv = p.roleStats.survivor, kill = p.roleStats.killer;
  let better = 'Balanced';
  if (surv.wins - surv.losses > kill.wins - kill.losses) better = 'Survivor';
  else if (kill.wins - kill.losses > surv.wins - surv.losses) better = 'Killer';
  const text =
    `📜 **${username}'s Profile**\n` +
    `Level: ${p.level}\nXP: ${p.xp}/${p.level*100}\n` +
    `Total W/L: ${p.wins}/${p.losses}\n` +
    `— Survivor: W ${surv.wins}/L ${surv.losses}, XP ${surv.xp}\n` +
    `— Killer: W ${kill.wins}/L ${kill.losses}, XP ${kill.xp}\n` +
    `You are likely better at: **${better}**`;
  return { text, raw: p };
}

function getStats(userId) { initPlayer(userId); return players[userId]; }

function getLeaderboard(limit = 10, sortBy = 'level') {
  loadPlayers();
  const arr = Object.entries(players);
  arr.sort((a,b) => {
    const A = a[1], B = b[1];
    if (sortBy === 'xp') {
      const totalA = A.level*100 + A.xp;
      const totalB = B.level*100 + B.xp;
      return totalB - totalA;
    } else if (sortBy === 'wins') {
      if (B.wins === A.wins) return B.level - A.level;
      return B.wins - A.wins;
    } else {
      if (B.level === A.level) return B.xp - A.xp;
      return B.level - A.level;
    }
  });
  return arr.slice(0, limit).map(([id,d], idx) => `${idx+1}. <@${id}> — Level ${d.level} (${d.xp} XP) • ${d.wins}W/${d.losses}L`);
}

module.exports = { addXP, recordWin, recordLoss, getProfile, getStats, getLeaderboard };
