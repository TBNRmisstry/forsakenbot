// index.js
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const xp = require('./xpSystem');
const buildSys = require('./buildSystem');
const counters = require('./countersSystem');
const mech = require('./mechanicsSystem');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  // quick tips & training
  new SlashCommandBuilder().setName('survivor-tip').setDescription('Get a random survivor tip'),
  new SlashCommandBuilder().setName('killer-tip').setDescription('Get a random killer tip'),
  new SlashCommandBuilder().setName('daily-challenge').setDescription('Get a practice challenge'),
  new SlashCommandBuilder().setName('train').setDescription('Short training exercise for XP'),

  // stats & leaderboard
  new SlashCommandBuilder().setName('profile').setDescription('View your Trainer profile'),
  new SlashCommandBuilder().setName('win').setDescription('Record a win (gives XP)'),
  new SlashCommandBuilder().setName('loss').setDescription('Record a loss'),
  new SlashCommandBuilder().setName('leaderboard').setDescription('View the Forsaken leaderboard')
    .addStringOption(opt => opt.setName('sort')
      .setDescription('Sort by level/xp/wins')
      .addChoices(
        { name: 'level (default)', value: 'level' },
        { name: 'xp (total)', value: 'xp' },
        { name: 'wins', value: 'wins' }
      )),

  // builds
  new SlashCommandBuilder().setName('savebuild').setDescription('Save a custom build/layout')
    .addStringOption(o => o.setName('role').setDescription('survivor or killer').setRequired(true)
      .addChoices({name:'Survivor',value:'survivor'},{name:'Killer',value:'killer'}))
    .addStringOption(o => o.setName('layout').setDescription('Your layout string/settings').setRequired(true)),

  new SlashCommandBuilder().setName('getbuild').setDescription('Get your saved build')
    .addStringOption(o => o.setName('role').setDescription('survivor or killer').setRequired(true)
      .addChoices({name:'Survivor',value:'survivor'},{name:'Killer',value:'killer'})),

  // counters & wiki
  new SlashCommandBuilder().setName('counters').setDescription('Get counters and recommended settings for a character')
    .addStringOption(o => o.setName('character').setDescription('Character name (killer or survivor)').setRequired(true)),
  new SlashCommandBuilder().setName('wiki').setDescription('Get the Forsaken wiki link'),

  // mechanics: three options in one command
  new SlashCommandBuilder().setName('mechanics').setDescription('Get tips for stamina / looping / movement')
    .addStringOption(o => o.setName('topic').setDescription('stamina / looping / movement').setRequired(true)
      .addChoices(
        { name: 'stamina', value: 'stamina' },
        { name: 'looping', value: 'looping' },
        { name: 'movement', value: 'movement' }
      ))
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering commands...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Commands registered.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
})();

const survivorTips = [
  "Use natural cover & map geometry to break sight lines—peek when safe.",
  "Pair up for objectives: two players finish tasks faster and can help each other.",
  "Rotate objectives if the killer is pressuring one zone; don't get cornered.",
  "Listen for audio cues; sound is vital for predicting killer movement.",
  "Hold resources for late-game clutch plays."
];

const killerTips = [
  "Control key choke points and rotate between objectives to apply pressure.",
  "Watch survivor patterns—predictable loops are easier to counter.",
  "Use your ability to deny objectives rather than only chasing.",
  "Deny safe regroup points so survivors can't freely rescue each other.",
  "Adapt your playstyle to counter grouped teams vs split teams."
];

const challenges = [
  "Rotate objectives: switch zones when the killer shows up.",
  "Complete 2 objectives without using healing items.",
  "Rescue a teammate with minimal attention drawn to yourself.",
  "Deny two objectives as killer by patrolling them effectively.",
  "Practice sound-only runs (ignore visual HUD) to sharpen listening."
];

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const uid = interaction.user.id;

  try {
    switch (interaction.commandName) {
      case 'survivor-tip': {
        const tip = survivorTips[Math.floor(Math.random()*survivorTips.length)];
        xp.addXP(uid, 10, 'survivor');
        await interaction.reply(`💡 Survivor Tip: ${tip}\n(+10 XP)`);
        break;
      }

      case 'killer-tip': {
        const tip = killerTips[Math.floor(Math.random()*killerTips.length)];
        xp.addXP(uid, 10, 'killer');
        await interaction.reply(`🔪 Killer Tip: ${tip}\n(+10 XP)`);
        break;
      }

      case 'daily-challenge': {
        const c = challenges[Math.floor(Math.random()*challenges.length)];
        xp.addXP(uid, 20);
        await interaction.reply(`🎯 Daily Challenge: ${c}\n(+20 XP)`);
        break;
      }

      case 'train': {
        const gained = Math.floor(Math.random()*15)+5;
        xp.addXP(uid, gained);
        const s = xp.getStats(uid);
        await interaction.reply(`🏋️ You trained and gained **${gained} XP**! You are now Level ${s.level} with ${s.xp} XP.`);
        break;
      }

      case 'profile': {
        const p = xp.getProfile(uid, interaction.user.username);
        await interaction.reply(p.text);
        break;
      }

      case 'win': {
        const role = null; // optionally accept role later
        xp.recordWin(uid, role);
        await interaction.reply('🏆 Win recorded! (+50 XP)');
        break;
      }

      case 'loss': {
        xp.recordLoss(uid);
        await interaction.reply('💀 Loss recorded. Keep practicing!');
        break;
      }

      case 'leaderboard': {
        const sort = interaction.options.getString('sort') || 'level';
        const list = xp.getLeaderboard(10, sort);
        if (!list.length) await interaction.reply('📊 No leaderboard data yet — be the first to train!');
        else await interaction.reply(`📊 **Forsaken Leaderboard** (sorted by ${sort})\n${list.join('\n')}`);
        break;
      }

      case 'savebuild': {
        const role = interaction.options.getString('role');
        const layout = interaction.options.getString('layout');
        buildSys.saveLayout(uid, role, layout);
        await interaction.reply(`✅ Saved your **${role}** build: \`${layout}\``);
        break;
      }

      case 'getbuild': {
        const role = interaction.options.getString('role');
        const layout = buildSys.getLayout(uid, role);
        if (!layout) await interaction.reply(`You don't have a saved **${role}** build yet.`);
        else await interaction.reply(`Your **${role}** build: \`${layout}\``);
        break;
      }

      case 'counters': {
        const char = interaction.options.getString('character');
        const data = counters.getCounters(char);
        if (!data) {
          await interaction.reply(`No counter data found for **${char}**. Try a slightly different spelling, or ask an admin to add it.`);
        } else {
          let reply = `📊 **Counters for ${char}**\n\n`;
          reply += `**Strong Counters:** ${data.counters.join(', ')}\n\n`;
          reply += `**Recommended Settings / Advice:**\n`;
          for (const [k,v] of Object.entries(data.settings)) reply += `- ${k}: ${v}\n`;
          if (data.tips && data.tips.length) {
            reply += `\n**Extra Tips:**\n`;
            data.tips.forEach(t => reply += `- ${t}\n`);
          }
          // add source link(s) if present
          if (data.sources && data.sources.length) {
            reply += `\nSources:\n${data.sources.map(s => `<${s}>`).join('\n')}\n`;
          }
          await interaction.reply(reply);
        }
        break;
      }

      case 'wiki': {
        // give the community wiki and a possible "official" wiki if present
        await interaction.reply(`🔗 Forsaken Wiki (community): <https://forsaken2024.fandom.com/wiki/FORSAKEN_Wiki>\nIf another official wiki exists, search: "Forsaken wiki".`);
        break;
      }

      case 'mechanics': {
        const topic = interaction.options.getString('topic');
        const section = mech.getMechanicsSection(topic);
        xp.addXP(uid, 5);
        await interaction.reply(section);
        break;
      }

      default:
        await interaction.reply({ content: 'Unknown command.', ephemeral: true });
    }
  } catch (err) {
    console.error('Interaction error:', err);
    if (!interaction.replied) await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
  }
});

client.login(process.env.TOKEN);
