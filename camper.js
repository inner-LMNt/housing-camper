const axios = require('axios');
var count = 0;

const aggressive = 10000;
const moderate = 15000;
const normal = 20000;
const chill = 30000;

const interval = normal; // ms

// Audio stuff
const { exec } = require('child_process');
const vlcExecutable = ''; // VLC executable path here
const audio = ''; // Audio file path here
const command = `"${vlcExecutable}" ${audio}`;


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
async function checkSite(url, keyword, headers) {
    while (true) {
        try {
            const response = await axios.get(url, headers);
            const data = response.data;
            const keywordPattern = new RegExp(keyword, 'i');
            const invalidKeyword = new RegExp('UNAUTHENTICATED', 'i');

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
const targetUrl = ''; // URL here
const keyword = ''; // Keyword here
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

checkSite(targetUrl, keyword, headers);