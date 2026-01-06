// Test script to verify the rank configuration fix
const http = require('http');

function testApiEndpoint(path, method, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '43.139.6.101',
            port: 3000,
            path: `/v2/rank/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve({ statusCode: res.statusCode, data: result });
                } catch (e) {
                    reject(new Error(`Failed to parse JSON response: ${e.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function runTests() {
    console.log('=== Testing Rank Configuration Fix ===\n');
    
    const appid = 'wxf67531bdf3d328af';
    const rankid = 'rank_total';
    const openid = 'test_config_123';
    const playername = '测试玩家';
    
    try {
        // Test 1: Initialize configuration
        console.log('Test 1: Initializing configuration...');
        const initResult = await testApiEndpoint('/initconfig', 'POST', { 
            appid 
        });
        console.log(`  Result: ${initResult.statusCode} - ${initResult.data.message}`);
        console.log(`  Configs created: ${initResult.data.data.length}`);
        
        // Test 2: Report score (should work now that config exists)
        console.log('\nTest 2: Reporting score...');
        const reportResult = await testApiEndpoint('/rankreport', 'POST', {
            appid,
            rankid,
            openid,
            score: 100,
            playername
        });
        console.log(`  Result: ${reportResult.statusCode} - ${reportResult.data.message}`);
        
        if (reportResult.statusCode === 200) {
            console.log('\n✅ Fix successful! Score reporting works correctly now.');
        } else {
            console.log('\n❌ Fix failed! Score reporting still has issues.');
        }
        
        // Test 3: Clean up test data
        console.log('\nTest 3: Cleaning up test data...');
        const resetResult = await testApiEndpoint('/reset', 'POST', {
            appid,
            rankid,
            openid
        });
        console.log(`  Result: ${resetResult.statusCode} - ${resetResult.data.message}`);
        
    } catch (error) {
        console.error(`\n❌ Test failed: ${error.message}`);
        process.exit(1);
    }
    
    console.log('\n=== Test Complete ===');
    process.exit(0);
}

runTests();
