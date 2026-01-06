// Test script to verify the getRankData fix
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
    console.log('=== Testing getRankData Fix ===\n');
    
    const appid = 'wxf67531bdf3d328af';
    const rankid = 'rank_total';
    const openid = 'test_rank_456';
    const playername = '测试玩家';
    
    try {
        // Test 1: Report a score first
        console.log('Test 1: Reporting test score...');
        const reportResult = await testApiEndpoint('/rankreport', 'POST', {
            appid,
            rankid,
            openid,
            score: 500,
            playername
        });
        console.log(`  Result: ${reportResult.statusCode} - ${reportResult.data.message}`);
        
        // Test 2: Get rank list (should return data now)
        console.log('\nTest 2: Getting rank list...');
        const rankResult = await testApiEndpoint('/rankdata', 'POST', {
            appid,
            rankid,
            range_from: 0,
            range_to: 10
        });
        
        console.log(`  Result: ${rankResult.statusCode} - ${rankResult.data.message || 'Success'}`);
        console.log(`  Rank list length: ${rankResult.data.data?.ranklist?.length || 0}`);
        
        if (rankResult.data.data?.ranklist?.length > 0) {
            console.log('\n✅ Fix successful! Rank list is now displaying data.');
            console.log('\nTop 3 players:');
            rankResult.data.data.ranklist.slice(0, 3).forEach((player, index) => {
                console.log(`  ${index + 1}. ${player.playername} - Score: ${player.score} - Rank: ${player.rank}`);
            });
        } else {
            console.log('\n❌ Fix failed! Rank list is still empty.');
        }
        
        // Test 3: Test with specific openid to get self rank
        console.log('\nTest 3: Getting rank list with openid...');
        const selfRankResult = await testApiEndpoint('/rankdata', 'POST', {
            appid,
            rankid,
            openid,
            range_from: 0,
            range_to: 10
        });
        
        console.log(`  Result: ${selfRankResult.statusCode} - ${selfRankResult.data.message || 'Success'}`);
        if (selfRankResult.data.data?.self) {
            console.log(`  Self rank: ${selfRankResult.data.data.self.rank} - Score: ${selfRankResult.data.data.self.score}`);
        } else {
            console.log('  No self rank data found');
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
