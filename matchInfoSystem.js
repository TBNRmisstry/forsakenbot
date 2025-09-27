// matchInfoSystem.js
function getMatchInfo() {
  return (
    "🎮 **Forsaken Match Overview**\n\n" +
    "**Match Setup:**\n" +
    "- 1 Player becomes the **Killer** 👹\n" +
    "- Up to 8 Players are **Survivors** 🧍‍♂️🧍‍♀️\n\n" +
    "**Objectives:**\n" +
    "- Survivors must solve **puzzles** and **activate generators** to progress the match.\n" +
    "- Survivors can also try to **outlast the timer**.\n" +
    "- Killer’s objective is to **eliminate all survivors** before they finish objectives or the timer ends.\n\n" +
    "**Survivor Gameplay:**\n" +
    "- Work together to solve puzzles quickly.\n" +
    "- Revive/help downed teammates.\n" +
    "- Use hiding spots, jukes, and map geometry to escape.\n" +
    "- Manage **stamina** carefully—don’t waste sprints.\n\n" +
    "**Killer Gameplay:**\n" +
    "- Use your unique powers (varies by myth/character).\n" +
    "- Track survivors by sound/visual cues.\n" +
    "- Apply pressure to puzzle areas to stall survivors.\n\n" +
    "**Win Conditions:**\n" +
    "- Survivors win if they **complete objectives** or **survive the timer**.\n" +
    "- Killer wins if **all survivors are eliminated** before that.\n\n" +
    "🗺️ Maps are designed with **open hiding spots and fair loops**, no lockers, so both sides rely on skill and strategy."
  );
}

module.exports = { getMatchInfo };
