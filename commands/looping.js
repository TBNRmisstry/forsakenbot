const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('looping')
        .setDescription('Learn how to loop and juke killers efficiently'),
    async execute(interaction) {
        const tips = [
            '🏃 **Looping Basics:** Always use walls, trees, and map structures to break line of sight.',
            '↪️ **Juking:** Fake running in one direction, then quickly turn back to throw the killer off.',
            '🔁 **Efficient Loops:** Use pallets and windows effectively — drop pallets only when necessary.',
            '👀 **Camera Control:** Always look behind you while running to predict killer movements.',
        ].join('\n\n');

        await interaction.reply(tips);
    },
};
