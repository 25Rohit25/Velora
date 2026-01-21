const https = require('https');
const apiKey = process.env.GEMINI_API_KEY || '';

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${apiKey}`,
    method: 'GET',
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const response = JSON.parse(data);
        if (response.error) {
            console.error('Error listing models:', response.error);
        } else {
            console.log('Available Models:');
            if (response.models) {
                response.models.map(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log('No models found or invalid response structure:', response);
            }
        }
    });
});

req.on('error', (error) => {
    console.error('Request error:', error);
});

req.end();
