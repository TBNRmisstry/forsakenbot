// buildSystem.js
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, 'builds.json');

let builds = {};
function loadBuilds() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}, null, 2));
  builds = JSON.parse(fs.readFileSync(file, 'utf8'));
}
function saveBuilds() { fs.writeFileSync(file, JSON.stringify(builds, null, 2)); }
loadBuilds();

function saveLayout(userId, role, layout) {
  if (!builds[userId]) builds[userId] = { survivor: null, killer: null };
  builds[userId][role] = layout;
  saveBuilds();
}
function getLayout(userId, role) {
  loadBuilds();
  return builds[userId] ? builds[userId][role] : null;
}
module.exports = { saveLayout, getLayout };
