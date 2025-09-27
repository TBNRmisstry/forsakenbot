// mechanicsSystem.js
function getMechanicsSection(section) {
  section = section ? section.toLowerCase() : '';
  if (section === 'stamina') {
    return (
      "**Stamina Management**\n" +
      "- Avoid letting stamina reach 0 — you become vulnerable. Sprint in short bursts and use cover to regenerate.\n" +
      "- Use elevation and geometry to buy regen time when chased.\n" +
      "- Bait the killer into taking longer paths to drain their stamina first.\n" +
      "\n(See community guides & wiki for character-specific numbers.)"
    );
  }
  if (section === 'looping') {
    return (
      "**Looping & Juking**\n" +
      "- Choose maps with tight geometry (pillars, staircases, elevation).\n" +
      "- Vary your path and change lateral direction — predictable loops are punishable.\n" +
      "- Juking is a last-resort; prefer prolonging chase with safe loops and using teammates to finish objectives.\n" +
      "\n(Seeded from community tutorials and the Forsaken wiki.)"
    );
  }
  if (section === 'movement') {
    return (
      "**Movement & Chasing**\n" +
      "- Peek corners instead of hugging walls, so you have reaction time.\n" +
      "- Mix walk and sprint to make movement less predictable.\n" +
      "- Use verticality where available; vertical loops often buy more time.\n"
    );
  }
  // default: combined
  return getMechanicsSection('stamina') + '\n\n' + getMechanicsSection('looping') + '\n\n' + getMechanicsSection('movement');
}

module.exports = { getMechanicsSection };
