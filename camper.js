const axios = require('axios');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cookies = [
    // Include necessary cookies from your session.
];
  
const cookieHeader = cookies.join('; ');
const targetUrl = ''; // Add the target URL.

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
                console.log(`No "${keyword}" yet...`);
                break;
            } else {
                console.log(`A wile "${keyword}" has appeared!!!`);
            }

            await sleep(10000); // Delay in ms.
        } catch (error) {
            console.log(error);
            await sleep(10000); // Delay in ms.
        }
    }
}

const keyword = ''; // Insert the keyword you want to search for.

checkSite(targetUrl, keyword, headers);