// Test script to verify the daily rank fix
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
    console.log('=== Testing Daily Rank Fix ===\n');
    
    const appid = 'wxf67531bdf3d328af';
    const rankid = 'rank_day';
    const openid = 'test_daily_789';
    const playername = '测试玩家';
    
    try {
        // Test 1: Report a score to daily rank
        console.log('Test 1: Reporting score to daily rank...');
        const reportResult = await testApiEndpoint('/rankreport', 'POST', {
            appid,
            rankid,
            openid,
            score: 600,
            playername
        });
        console.log(`  Result: ${reportResult.statusCode} - ${reportResult.data.message}`);
        
        // Test 2: Get daily rank list
        console.log('\nTest 2: Getting daily rank list...');
        const rankResult = await testApiEndpoint('/rankdata', 'POST', {
            appid,
            rankid,
            range_from: 0,
            range_to: 10
        });
        
        console.log(`  Result: ${rankResult.statusCode} - ${rankResult.data.message || 'Success'}`);
        console.log(`  Rank list length: ${rankResult.data.data?.ranklist?.length || 0}`);
        
        if (rankResult.data.data?.ranklist?.length > 0) {
            console.log('\n✅ Fix successful! Daily rank list is now displaying data.');
            console.log('\nTop 3 players in daily rank:');
            rankResult.data.data.ranklist.slice(0, 3).forEach((player, index) => {
                console.log(`  ${index + 1}. ${player.playername} - Score: ${player.score} - Rank: ${player.rank}`);
            });
        } else {
            console.log('\n❌ Fix failed! Daily rank list is still empty.');
        }
        
        // Test 3: Test with existing test2 player
        console.log('\nTest 3: Getting daily rank list for test2 player...');
        const test2Result = await testApiEndpoint('/rankdata', 'POST', {
            appid,
            rankid,
            openid: 'test2',
            range_from: 0,
            range_to: 10
        });
        
        console.log(`  Result: ${test2Result.statusCode} - ${test2Result.data.message || 'Success'}`);
        console.log(`  Rank list length: ${test2Result.data.data?.ranklist?.length || 0}`);
        if (test2Result.data.data?.self) {
            console.log(`  test2 player rank: ${test2Result.data.data.self.rank} - Score: ${test2Result.data.data.self.score}`);
        } else {
            console.log('  No self rank data found for test2');
        }
        
        // Test 4: Clean up test data
        console.log('\nTest 4: Cleaning up test data...');
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
