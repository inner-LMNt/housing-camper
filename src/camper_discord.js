const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
var count = 0;

const targetUrl = ''; // URL here
const keywords = ['', '']; // Keywords here

const aggressive = 10000;
const moderate = 15000;
const normal = 20000;
const chill = 30000;

const interval = normal; // ms

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const axiosInstance = axios.create();
const keywordPatterns = keywords.map(keyword => new RegExp(keyword, 'i'));
const invalidKeyword = new RegExp('UNAUTHENTICATED', 'i');

// Cookie stuff
const cookies = [
    'cookie1=cookie1data',
    'cookie2=cookie2data',
    'etc=etcdata', // Copy and paste your cookies here
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

            if (keywordFound) {
                if (first) {
                    // Keyword has been found for the first time
                    console.log(`A wild "${keywords.join('" or "')}" has appeared!!!`);
                    sendDiscordMessage(client, channelId, `A wild "${keywords.join('" or "')}" has appeared!!!`);
                    first = false;
                    count = 0;
                } else {
                    // Keyword is still present
                    console.log(`Already found "${keywords.join('" or "')}". Go to the site now! ${count++}`);
                }
                wasKeywordFound = true;
            } else if (invalidKeyword.test(data[0])) {
                console.log(`Not signed in! Please update your cookies.`);
                sendDiscordMessage(client, channelId, `Login expired, shutting down...`);
                
                await Promise.race([
                    sleep(3000),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000)),
                ]);
                process.exit();
            } else if (!keywordFound && wasKeywordFound) {
                console.log(`"${keywords.join('" or "')}" has disappeared.`);
                sendDiscordMessage(client, channelId, `"${keywords.join('" or "')}" has disappeared :(`);
                first = true;
                count = 0;
                wasKeywordFound = false;
            } else {
                console.log(`No "${keywords.join('" or "')}" yet... ${count++}`);
                wasKeywordFound = false;
            }

            await sleep(interval);
        } catch (error) {
            console.log('Error making HTTP request:', error);
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
const channelId = ''; // Discord channel ID here
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