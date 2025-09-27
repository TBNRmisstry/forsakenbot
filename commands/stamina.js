const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stamina')
        .setDescription('Tips on stamina management in Forsaken'),
    async execute(interaction) {
        const tips = [
            '💨 **Don’t Sprint Constantly:** Save stamina for when the killer is chasing you.',
            '⚡ **Burst Running:** Use short sprints to dodge attacks, then walk to recharge.',
            '🪑 **Map Knowledge:** Learn safe spots so you don’t waste stamina running blindly.',
            '🧘 **Stay Calm:** Panic wastes stamina — plan your route before sprinting.',
        ].join('\n\n');

        await interaction.reply(tips);
    },
};
