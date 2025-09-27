const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Get a link to the official Forsaken Wiki'),
    async execute(interaction) {
        await interaction.reply('📖 Official Forsaken Wiki: https://forsaken.fandom.com/wiki/Forsaken_Wiki');
    },
};
