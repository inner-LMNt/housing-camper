const axios = require('axios');
var count = 0;

const targetUrl = ''; // Target URL here
const keyword = ''; // Keyword here
const keywordPattern = new RegExp(keyword, 'i');
const invalidKeyword = new RegExp('UNAUTHENTICATED', 'i');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const aggressive = 10000;
const moderate = 15000;
const normal = 20000;
const chill = 30000;

const interval = normal; // ms

// Audio stuff
const { exec } = require('child_process');
const vlcExecutable = 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe'; // Path to VLC executable
const audio = 'alarm.mp3'; // Audio file
const command = `"${vlcExecutable}" ${audio}`;


// Cookie stuff
const cookies = [
    'cookie1=cookie1data',
    'coodie2=cookie2data',
    'etc=etcdata' // Add any necessary cookies
];

const cookieHeader = cookies.join('; ');
const headers = {
    headers: {
        Cookie: cookieHeader,
    },
};


// Main logic
async function checkSite(url, keyword, headers) {
    while (true) {
        try {
            const response = await axios.get(url, headers);
            const data = response.data;

            if (keywordPattern.test(data)) {
                console.log(`A wild "${keyword}" has appeared!!!`);
                exec(command, (err) => {
                    if (err) {
                        console.error(`Error playing audio: ${err}`);
                        return;
                    }
                    console.log('Audio playback completed.');
                });        
                break;
            } else if (invalidKeyword.test(data)) {
                console.log(`Not signed in! Please update your cookies.`);
                break;
            } else{
                console.log(`No "${keyword}" yet... ${count++}`);
            }

            await sleep(interval);
        } catch (error) {
            console.log('Error making HTTP request:', error);
            await sleep(interval);
        }
    }
}


// Camp away!
checkSite(targetUrl, keyword, headers);
