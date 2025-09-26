const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require("discord.js");
require("dotenv").config();
const { addXP, recordWin, recordLoss, getProfile } = require("./xpSystem");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Tips & challenges
const survivorTips = [
  "Work on generators in pairs – faster and safer.",
  "Break line of sight when chased; don’t just run straight.",
  "Use lockers sparingly – killers check them often.",
  "Heal teammates when safe, but don’t risk both getting caught.",
  "Communicate! Ping or type where the killer is."
];

const killerTips = [
  "Cut survivors off instead of chasing in straight lines.",
  "Listen carefully – footsteps and breathing are giveaways.",
  "Prioritize interrupting generators over camping one survivor.",
  "Use your ability strategically instead of spamming.",
  "Control high-traffic areas where survivors must pass."
];

const challenges = [
  "Survive a match without hiding in a locker.",
  "Repair 2 generators without being downed.",
  "Escape while rescuing at least one teammate.",
  "As killer, down 2 survivors before the first generator is completed.",
  "Win a match without camping."
];

// Slash commands
const commands = [
  new SlashCommandBuilder().setName("survivor-tip").setDescription("Get a random survivor tip"),
  new SlashCommandBuilder().setName("killer-tip").setDescription("Get a random killer tip"),
  new SlashCommandBuilder().setName("daily-challenge").setDescription("Get a random daily challenge"),
  new SlashCommandBuilder().setName("quiz").setDescription("Answer a Forsaken strategy question"),
  new SlashCommandBuilder().setName("profile").setDescription("View your Forsaken Trainer profile"),
  new SlashCommandBuilder().setName("win").setDescription("Record a win in Forsaken"),
  new SlashCommandBuilder().setName("loss").setDescription("Record a loss in Forsaken"),
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log("Commands registered.");
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;

  if (interaction.commandName === "survivor-tip") {
    addXP(userId, 10);
    await interaction.reply(`💡 ${survivorTips[Math.floor(Math.random() * survivorTips.length)]}\n(+10 XP)`);
  }

  if (interaction.commandName === "killer-tip") {
    addXP(userId, 10);
    await interaction.reply(`🔪 ${killerTips[Math.floor(Math.random() * killerTips.length)]}\n(+10 XP)`);
  }

  if (interaction.commandName === "daily-challenge") {
    addXP(userId, 20);
    await interaction.reply(`🎯 Challenge: ${challenges[Math.floor(Math.random() * challenges.length)]}\n(+20 XP)`);
  }

  if (interaction.commandName === "quiz") {
    const question = {
      q: "What should survivors do when being chased by the killer?",
      options: [
        "Run in a straight line",
        "Break line of sight and loop around obstacles",
        "Hide in the nearest locker immediately",
        "Split up without communication"
      ],
      correct: 1
    };
    addXP(userId, 30);
    await interaction.reply(
      `❓ **Quiz Time!**\n${question.q}\n` +
      question.options.map((opt, i) => `${i + 1}. ${opt}`).join("\n") +
      `\n✅ Correct Answer: ${question.options[question.correct]} (+30 XP)`
    );
  }

  if (interaction.commandName === "profile") {
    await interaction.reply(getProfile(userId, interaction.user.username));
  }

  if (interaction.commandName === "win") {
    recordWin(userId);
    await interaction.reply("🏆 Win recorded! (+50 XP)");
  }

  if (interaction.commandName === "loss") {
    recordLoss(userId);
    await interaction.reply("💀 Loss recorded. Keep practicing!");
  }
});

client.login(process.env.TOKEN);
