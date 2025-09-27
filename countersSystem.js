// countersSystem.js
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, 'countersData.json');
let data = {};
function loadData(){
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}, null, 2));
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
}
loadData();

function getCounters(characterName){
  loadData();
  if(!characterName) return null;
  const key = Object.keys(data).find(k => k.toLowerCase() === characterName.trim().toLowerCase());
  return key ? data[key] : null;
}

module.exports = { getCounters };
