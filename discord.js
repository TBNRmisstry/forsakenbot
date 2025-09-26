// index.js
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Survivor tips
const survivorTips = [
  "Work on generators in pairs – faster and safer.",
  "Break line of sight when chased; don’t just run straight.",
  "Use lockers sparingly – killers check them often.",
  "Heal teammates when safe, but don’t risk both getting caught.",
  "Communicate! Ping or type where the killer is."
];

// Killer tips
const killerTips = [
  "Cut survivors off instead of chasing in straight lines.",
  "Listen carefully – footsteps and breathing are giveaways.",
  "Prioritize interrupting generators over camping one survivor.",
  "Use your ability strategically instead of spamming.",
  "Control high-traffic areas where survivors must pass."
];

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('survivor-tip')
    .setDescription('Get a random Forsaken survivor tip'),
  new SlashCommandBuilder()
    .setName('killer-tip')
    .setDescription('Get a random Forsaken killer tip'),
  new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Forsaken strategy quiz question'),
  new SlashCommandBuilder()
    .setName('daily-challenge')
    .setDescription('Get a random daily challenge to practice'),
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Commands registered.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'survivor-tip') {
    await interaction.reply(survivorTips[Math.floor(Math.random() * survivorTips.length)]);
  }

  if (interaction.commandName === 'killer-tip') {
    await interaction.reply(killerTips[Math.floor(Math.random() * killerTips.length)]);
  }

  if (interaction.commandName === 'quiz') {
    const question = {
      q: "What should survivors do when being chased by the killer?",
      options: [
        "Run in a straight line",
        "Break line of sight and loop around obstacles",
        "Hide in the nearest locker immediately",
        "All split up without communication"
      ],
      correct: 1
    };
    await interaction.reply(
      `**Quiz Time!**\n${question.q}\n` +
      question.options.map((opt, i) => `${i + 1}. ${opt}`).join("\n") +
      `\n*(Answer: ${question.correct + 1})*`
    );
  }

  if (interaction.commandName === 'daily-challenge') {
    const challenges = [
      "Survive a match without hiding in a locker.",
      "Repair 2 generators without being downed.",
      "Escape while rescuing at least one teammate.",
      "As killer, down 2 survivors before the first generator is completed.",
      "Win a match without camping."
    ];
    await interaction.reply(challenges[Math.floor(Math.random() * challenges.length)]);
  }
});

client.login(process.env.TOKEN);
