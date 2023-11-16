const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');

const targetUrl = ''; // URL here
const keywords = ['', '', '']; // Keywords here (multiple supported)

const aggressive = 10000;
const moderate = 15000;
const normal = 20000;
const chill = 30000;

const interval = normal; // ms

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const axiosInstance = axios.create();
const keywordPatterns = keywords.map(keyword => new RegExp(keyword, 'i'));
const invalidKeyword = new RegExp('UNAUTHENTICATED', 'i'); // Set an keyword that indicates that you are not logged in

// Cookie stuff
const cookies = [
    'cookie1=cookie1value',
    'cookie2=cookie2value',
    'etc=etcvalue' // Add necessary cookies here
];

const cookieHeader = cookies.join('; ');
const headers = {
    headers: {
        Cookie: cookieHeader,
    },
};


// Main logic
async function checkSite(url, keywords, headers) {
    let first = true;
    let keywordFound = false;
    let wasKeywordFound = false;

    while (true) {
        try {
            const responses = await Promise.all([
                axiosInstance.get(url, headers),
            ]);

            const data = responses.map(response => response.data);
            keywordFound = keywordPatterns.some(pattern => pattern.test(data[0]));

            const currentTime = new Date();
            const formattedTime = currentTime.toTimeString().split(' ')[0]; // HH:MM:SS

            if (keywordFound) {
                if (first) {
                    // Keyword has been found for the first time
                    console.log(`[${formattedTime}] A wild "${keywords.join('" or "')}" has appeared!!!`);
                    sendDiscordMessage(client, channelId, `[${formattedTime}] A wild "${keywords.join('" or "')}" has appeared!!!`);
                    first = false;
                } else {
                    // Keyword is still present
                    console.log(`[${formattedTime}] Already found "${keywords.join('" or "')}". Go to the site now!`);
                }
                wasKeywordFound = true;
            } else if (invalidKeyword.test(data[0])) {
                console.log(`Not signed in! Please update your cookies.`);
                // sendDiscordMessage(client, channelId, `[${formattedTime}] Login expired, shutting down...`);

                await Promise.race([
                    sleep(3000),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000)),
                ]);
                process.exit();
            } else if (!keywordFound && wasKeywordFound) {
                console.log(`[${formattedTime}] "${keywords.join('" or "')}" has disappeared.`);
                sendDiscordMessage(client, channelId, `[${formattedTime}] "${keywords.join('" or "')}" has disappeared  :sob:`);
                first = true;
                wasKeywordFound = false;
            } else {
                console.log(`[${formattedTime}] No "${keywords.join('" or "')}" yet...`);
                wasKeywordFound = false;
            }

            await sleep(interval);
        } catch (error) {
            console.log('Error making HTTP request:', error.message);
            await sleep(interval);
        }
    }
}


// To send a Discord message
function sendDiscordMessage(client, channelId, message) {
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        channel.send(message);
    } else {
        console.error('Channel not found');
    }
}


// Discord stuff
const token = ''; // Discord bot token here
const channelId = ''; // Channel ID here
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    startMain();
});

client.login(token);


// Camp away!
async function startMain() {
    await checkSite(targetUrl, keywords, headers);
}