# forsakenbot
a bot that gives tips to be better at forsaken

NOTE:  CURRENTLY NOT FINISHED I UPDATED THIS WHEN IT FINISHED AND BELOW IS A INCOMPLETE COMMAND LIST!


Forsaken Discord Bot

A helpful Discord bot for Roblox Forsaken, designed to improve gameplay by providing tips, counters, recommended settings, and XP tracking.

🛠 Features

Character counters: Know which killers or survivors to watch out for.

Gameplay tips: Looping, juking, and stamina management strategies.

Recommended settings: Optimize your gameplay experience.

Wiki links: Quick access to the official Forsaken Wiki.

XP tracking: Monitor your progress and stats.

Profile system: View your Forsaken stats and XP.

📜 Command List
Command	Description
/wiki	Provides a link to the official Forsaken Wiki for quick reference.
/looping	Gives tips on looping and juking efficiently as a survivor to avoid killers.
/stamina	Offers advice on stamina management during chases and general gameplay.
/counters <character>	Shows all counters for a specific character. For survivors, it lists the killers they struggle against; for killers, it provides tips and strategies against survivors.
/xp	Tracks and displays your current XP progress in the bot. (Requires your XP system integration)
/profile	Shows your Forsaken stats, XP, and other personal data stored by the bot.
/help	Displays the list of all commands and what they do.
/settings	Provides recommended in-game settings for optimal performance and gameplay experience.
/tips	Shares general tips and strategies from YouTube guides, Forsaken Wiki, and community sources.


🗂 Folder Structure
forsaken-bot/
├─ commands/
│  ├─ counters.js
│  ├─ wiki.js
│  ├─ looping.js
│  ├─ stamina.js
│  └─ xp.js
├─ countersData.json
├─ config.json
└─ index.js

⚙️ Setup

Install dependencies:

npm install discord.js


Configure your bot:

Add your bot token in .env:

{
  "token": "YOUR_BOT_TOKEN"
}


Run the bot:

node index.js




🔗 Additional Notes

The /counters command is data-driven via countersData.json. Update this file to add new characters, tips, or settings.

Commands are modular, each in a separate file in the commands/ folder.

Designed for current Forsaken in-game characters only; unreleased characters are excluded.



📊 Example Outputs
/counters Noob
📊 Counters for Noob

Strong Counters: Slasher, C00lkidd, John Doe

Recommended Settings:
- FOV: 90
- Audio: Enable footsteps & ambient sounds

Tips:
- Noob is a baseline survivor—use teamwork and map knowledge to outplay killers.
- Don’t stick close to walls; leave yourself room to sprint and dodge.
- Predict killer movement and lead escapes to cover early.

Sources:
<https://forsaken.fandom.com/wiki/Survivors>


/tips looping
🌀 Looping & Juking Tips:

- Use unpredictable movement paths to avoid killer tracking.
- Break line of sight frequently to force killer reposition.
- Pair with teammates to bait killers into long loops.
- Observe killer patterns to anticipate skill usage.


/wiki

📖 Official Forsaken Wiki: 
https://forsaken.fandom.com/wiki/Forsaken_Wiki
