const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

console.log("BOT START");

// 🔒 Zet hier jouw Discord ID
const OWNER_ID = "JOUW_DISCORD_ID_HIER";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on('messageCreate', (message) => {

    // Negeer bots
    if (message.author.bot) return;

    const args = message.content.split(' ');

    // !ping
    if (message.content === '!ping') {
        return message.reply('Pong! 🏓');
    }

    // Alleen doorgaan als het !wl is
    if (args[0] !== '!wl') return;

    // 🔒 OWNER CHECK (blokkeert alles meteen)
    if (message.author.id !== OWNER_ID) {
        return message.reply("❌ Alleen de owner kan dit commando gebruiken.");
    }

    // Lees whitelist.json
    const data = JSON.parse(fs.readFileSync('whitelist.json', 'utf8'));

    // !wl show
    if (args[1] === 'show') {

        if (data.players.length === 0) {
            return message.reply('❌ De whitelist is leeg.');
        }

        const lijst = data.players
            .map(player => `👤 ${player}`)
            .join('\n');

        return message.reply(
            `🌍 **MVERSE WHITELIST**\n\n${lijst}`
        );
    }

    // !wl add NAAM
    if (args[1] === 'add') {

        const name = args[2];

        if (!name) {
            return message.reply('❌ Geef een naam op!');
        }

        if (data.players.includes(name)) {
            return message.reply('❌ Die speler staat al in de whitelist!');
        }

        data.players.push(name);

        fs.writeFileSync(
            'whitelist.json',
            JSON.stringify(data, null, 2)
        );

        return message.reply(`✅ ${name} toegevoegd aan de whitelist!`);
    }

    // !wl remove NAAM
    if (args[1] === 'remove') {

        const name = args[2];

        if (!name) {
            return message.reply('❌ Geef een naam op!');
        }

        data.players = data.players.filter(
            player => player !== name
        );

        fs.writeFileSync(
            'whitelist.json',
            JSON.stringify(data, null, 2)
        );

        return message.reply(`❌ ${name} verwijderd uit de whitelist!`);
    }

});

client.login(process.env.TOKEN);