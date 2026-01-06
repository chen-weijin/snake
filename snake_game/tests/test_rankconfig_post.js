// Test script to verify the rankconfig POST endpoint
const http = require('http');

function testRankConfigPost() {
    const options = {
        hostname: '43.139.6.101',
        port: 3000,
        path: '/v2/rank/api/rankconfig',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify({ appid: 'wxf67531bdf3d328af' }))
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Response Body:', data);
            
            try {
                const result = JSON.parse(data);
                if (result.code === 0) {
                    console.log('✅ Success! POST request to rankconfig endpoint works correctly.');
                } else {
                    console.log(`❌ Failed with code ${result.code}: ${result.message}`);
                }
            } catch (e) {
                console.log('❌ Failed to parse JSON response:', e.message);
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ Request error:', error.message);
    });

    req.write(JSON.stringify({ appid: 'wxf67531bdf3d328af' }));
    req.end();
}

testRankConfigPost();
