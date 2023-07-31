const axios = require('axios');

// Function to verify NIN
async function verifyNIN(nin) {
    try {
        // const response = await axios.get(`https://api.ninverify.com/api/v1/verify/${nin}`);
        const response = await axios.get(`
        https://api.verxid.site/npc/unicef/verifyNin?nin=${nin}`);
        return response.data;
    } catch (error) {
        console.error('NIN verification failed:', error.message);
        throw error;
    }
}


// Usage example
const nin = '38920621837'; // Replace with the NIN you want to verify
verifyNIN(nin)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        // Handle any errors during verification
    });
