const http = require('http');

const testReport = {
    appid: 'wxf67531bdf3d328af',
    rankid: 'rank_total',
    openid: 'test_user_' + Date.now(),
    score: 100,
    playername: '测试玩家',
    portrait: '',
    ext: '{}'
};

const postData = JSON.stringify(testReport);

const options = {
    hostname: '43.139.6.101',
    port: 3000,
    path: '/v2/rank/api/report/rankreport',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('测试分数上报...');
console.log('请求数据:', testReport);

const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);

    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log('响应内容:', chunk);
        try {
            const response = JSON.parse(chunk);
            if (response.code === 0) {
                console.log('✓ 分数上报成功！');
            } else {
                console.log('✗ 分数上报失败:', response.message);
            }
        } catch (e) {
            console.log('✗ 响应解析失败:', e);
        }
    });
});

req.on('error', (error) => {
    console.error('✗ 请求失败:', error);
});

req.write(postData);
req.end();
