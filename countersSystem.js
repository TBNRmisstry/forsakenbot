const data = counters.getCounters(char);
if (!data) {
  reply = `No counter data found for **${char}**.`;
} else {
  reply = `📊 **Counters for ${char}**\n\n`;
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
}
