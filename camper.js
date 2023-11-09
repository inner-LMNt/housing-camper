const axios = require('axios');

const { exec } = require('child_process');
const vlcExecutable = ''; // Change this to the VLC executable path (vlc.exe)
const audio = ''; // Change this to the audio file path
const command = `"${vlcExecutable}" ${audio}`;

const cookies = [
    '', // Add all relevant cookies here
];

const cookieHeader = cookies.join('; ');
const headers = {
    headers: {
        Cookie: cookieHeader,
    },
};


async function checkSite(url, keyword, headers) {
    while (true) {
        try {
            const response = await axios.get(url, headers);
            const data = response.data;
            const keywordPattern = new RegExp(keyword, 'i');

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
            } else {
                console.log(`No "${keyword}" yet...`);
            }

            await sleep(10000);
        } catch (error) {
            console.log('Error making HTTP request:', error);
            await sleep(10000);
        }
    }
}


const targetUrl = ''; // Change this to a target URL
const keyword = ''; // Change this to a keyword to search for
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
checkSite(targetUrl, keyword, headers);
