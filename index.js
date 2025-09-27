// index.js
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const xpSystem = require('./xpSystem');
const counters = require('./countersSystem');
const wiki = require('./wikiSystem');
const tipsSystem = require('./tipsSystem');
const matchInfo = require('./matchInfoSystem');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands
const commands = [
  new SlashCommandBuilder().setName('tip').setDescription('Get a random Forsaken survival tip'),
  new SlashCommandBuilder().setName('guide').setDescription('Forsaken beginner guide'),
  new SlashCommandBuilder().setName('xp').setDescription('Check your XP and level'),
  new SlashCommandBuilder().setName('train').setDescription('Train your survival skills and earn XP'),
  new SlashCommandBuilder()
    .setName('counters')
    .setDescription('Find counters for a Forsaken killer or survivor')
    .addStringOption(option =>
      option.setName('character')
        .setDescription('The name of the Forsaken character (killer or survivor)')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('wiki').setDescription('Link to the official Forsaken Wiki'),
  new SlashCommandBuilder()
    .setName('looping')
    .setDescription('Learn looping, juking, and stamina management')
    .addStringOption(option =>
      option.setName('topic')
        .setDescription('Choose a topic')
        .setRequired(true)
        .addChoices(
          { name: 'Looping', value: 'looping' },
          { name: 'Juking', value: 'juking' },
          { name: 'Stamina Management', value: 'stamina' }
        )
    ),
  new SlashCommandBuilder().setName('matchinfo').setDescription('Learn how Forsaken matches work'),
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering commands...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Commands registered.');
  } catch (err) {
    console.error(err);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // /tip
  if (interaction.commandName === 'tip') {
    const tip = tipsSystem.getRandomTip();
    await interaction.reply(tip);
    xpSystem.addXP(interaction.user.id, 5);
  }

  // /guide
  if (interaction.commandName === 'guide') {
    await interaction.reply(
      "📘 **Forsaken Beginner Guide**\n" +
      "1. Work together – lone wolves die first.\n" +
      "2. Manage your resources and healing items.\n" +
      "3. Learn killer patterns and play around them.\n" +
      "4. Survivors: Finish puzzles fast. Killers: Apply pressure.\n" +
      "5. Adapt – every round plays differently."
    );
    xpSystem.addXP(interaction.user.id, 10);
  }

  // /xp
  if (interaction.commandName === 'xp') {
    const stats = xpSystem.getStats(interaction.user.id);
    await interaction.reply(
      `${interaction.user.username}, you have **${stats.xp} XP** and are **Level ${stats.level}**.`
    );
  }

  // /train
  if (interaction.commandName === 'train') {
    const gained = Math.floor(Math.random() * 15) + 5;
    xpSystem.addXP(interaction.user.id, gained);
    const stats = xpSystem.getStats(interaction.user.id);
    await interaction.reply(
      `${interaction.user.username} trained their survival skills and gained **${gained} XP**! ` +
      `You are now **Level ${stats.level}** with **${stats.xp} XP**.`
    );
  }

  // /counters
  if (interaction.commandName === 'counters') {
    const char = interaction.options.getString('character');
    const data = counters.getCounters(char);

    if (!data) {
      await interaction.reply(`❌ No counter data found for **${char}**.`);
      return;
    }

    let reply = `📊 **Counters for ${char}**\n\n`;
    reply += `**Strong Counters:** ${data.counters.join(', ')}\n\n`;
    reply += `**Recommended Settings / Advice:**\n`;
    for (const [k, v] of Object.entries(data.settings)) {
      reply += `- ${k}: ${v}\n`;
    }
    if (data.tips) {
      reply += `\n**Tips:**\n`;
      data.tips.forEach(t => reply += `- ${t}\n`);
    }
    if (data.sources) {
      reply += `\nSources:\n${data.sources.map(s => `<${s}>`).join('\n')}\n`;
    }

    await interaction.reply(reply);
  }

  // /wiki
  if (interaction.commandName === 'wiki') {
    await interaction.reply(wiki.getWikiLink());
  }

  // /looping
  if (interaction.commandName === 'looping') {
    const topic = interaction.options.getString('topic');
    await interaction.reply(tipsSystem.getLoopingInfo(topic));
  }

  // /matchinfo
  if (interaction.commandName === 'matchinfo') {
    await interaction.reply(matchInfo.getMatchInfo());
  }
});

client.login(process.env.TOKEN);
