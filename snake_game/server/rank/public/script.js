let serverHost = '43.139.6.101';
let serverPort = 3000;
const API_BASE = '/v2/rank/api';

function saveConfig() {
    serverHost = document.getElementById('serverHost').value;
    serverPort = document.getElementById('serverPort').value;
    localStorage.setItem('serverHost', serverHost);
    localStorage.setItem('serverPort', serverPort);
    showResult('配置已保存', 'success');
}

function loadConfig() {
    // Load server config
    const savedHost = localStorage.getItem('serverHost');
    const savedPort = localStorage.getItem('serverPort');
    if (savedHost) {
        serverHost = savedHost;
        document.getElementById('serverHost').value = savedHost;
    }
    if (savedPort) {
        serverPort = savedPort;
        document.getElementById('serverPort').value = savedPort;
    }
    
    // Load form data
    const formFields = [
        'resetAppid', 'resetRankType',
        'reportAppid', 'reportRankType', 'reportOpenid', 'reportScore', 'reportPlayername',
        'initAppid',
        'queryAppid', 'queryRankType', 'queryOpenid', 'queryRangeFrom', 'queryRangeTo',
        'generateAppid', 'generateRankType', 'generateCount'
    ];
    
    formFields.forEach(fieldId => {
        const savedValue = localStorage.getItem(fieldId);
        if (savedValue !== null) {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = savedValue;
            }
        }
    });
}

function saveFormData() {
    const formFields = [
        'resetAppid', 'resetRankType',
        'reportAppid', 'reportRankType', 'reportOpenid', 'reportScore', 'reportPlayername',
        'initAppid',
        'queryAppid', 'queryRankType', 'queryOpenid', 'queryRangeFrom', 'queryRangeTo',
        'generateAppid', 'generateRankType', 'generateCount'
    ];
    
    formFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            localStorage.setItem(fieldId, element.value);
        }
    });
}

function addFormEventListeners() {
    const formFields = [
        'resetAppid', 'resetRankType',
        'reportAppid', 'reportRankType', 'reportOpenid', 'reportScore', 'reportPlayername',
        'initAppid',
        'queryAppid', 'queryRankType', 'queryOpenid', 'queryRangeFrom', 'queryRangeTo',
        'generateAppid', 'generateRankType', 'generateCount'
    ];
    
    formFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.addEventListener('input', saveFormData);
            element.addEventListener('change', saveFormData);
        }
    });
}

function showResult(message, type = 'info') {
    const resultBox = document.getElementById('result');
    const className = type === 'success' ? 'success' : type === 'error' ? 'error' : '';
    resultBox.innerHTML = `<p class="${className}">${message}</p>`;
}

function showLoading() {
    const resultBox = document.getElementById('result');
    resultBox.innerHTML = '<p class="loading">正在处理</p>';
}

function clearResult() {
    const resultBox = document.getElementById('result');
    resultBox.innerHTML = '<p class="placeholder">操作结果将显示在这里...</p>';
}

function clearRanklist() {
    const ranklistBox = document.getElementById('ranklist');
    ranklistBox.innerHTML = '<p class="placeholder">排行榜数据将显示在这里...</p>';
}

async function makeRequest(method, path, data = null) {
    const url = `http://${serverHost}:${serverPort}${API_BASE}${path}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error(`请求失败: ${error.message}`);
    }
}

async function resetRankData() {
    const appid = document.getElementById('resetAppid').value.trim();
    const rankType = document.getElementById('resetRankType')?.value;

    if (!appid) {
        showResult('请输入 AppID', 'error');
        return;
    }

    showLoading();

    try {
        const data = { appid };
        if (rankType) {
            data.rankid = rankType;
        }

        const response = await makeRequest('POST', '/reset', data);
        
        if (response.code === 0) {
            showResult(`重置成功！删除了 ${response.data.deletedCount} 条记录`, 'success');
            clearRanklist();
        } else {
            showResult(`重置失败: ${response.message}`, 'error');
        }
    } catch (error) {
        showResult(error.message, 'error');
    }
}

async function reportScore() {
    const appid = document.getElementById('reportAppid').value.trim();
    const rankType = document.getElementById('reportRankType').value;
    const openid = document.getElementById('reportOpenid').value.trim();
    const score = document.getElementById('reportScore').value;
    const playername = document.getElementById('reportPlayername').value.trim();

    if (!appid || !rankType || !openid || !score) {
        showResult('请填写所有必填字段', 'error');
        return;
    }

    showLoading();

    try {
        const data = {
            appid,
            rankid: rankType,
            openid,
            score: parseInt(score),
            playername: playername || null,
        };

        const response = await makeRequest('POST', '/rankreport', data);
        
        if (response.code === 0) {
            showResult('分数上报成功！', 'success');
        } else {
            showResult(`上报失败: ${response.message}`, 'error');
        }
    } catch (error) {
        showResult(error.message, 'error');
    }
}

async function getRankList() {
    const appid = document.getElementById('queryAppid').value.trim();
    const rankType = document.getElementById('queryRankType').value;
    const openid = document.getElementById('queryOpenid').value.trim();
    const rangeFrom = parseInt(document.getElementById('queryRangeFrom').value) || 0;
    const rangeTo = parseInt(document.getElementById('queryRangeTo').value) || 9;

    if (!appid || !rankType) {
        showResult('请输入 AppID 和选择排行榜类型', 'error');
        return;
    }

    showLoading();

    try {
        const data = {
            appid,
            rankid: rankType,
            openid: openid || null,
            range_from: rangeFrom,
            range_to: rangeTo,
        };

        const response = await makeRequest('POST', '/rankdata', data);
        
        if (response.code === 0) {
            showResult('获取排行榜成功！', 'success');
            displayRanklist(response.data);
        } else {
            showResult(`获取失败: ${response.message}`, 'error');
            clearRanklist();
        }
    } catch (error) {
        showResult(error.message, 'error');
        clearRanklist();
    }
}

function displayRanklist(data) {
    const ranklistBox = document.getElementById('ranklist');
    
    if (!data.ranklist || data.ranklist.length === 0) {
        ranklistBox.innerHTML = '<p class="placeholder">暂无排行榜数据</p>';
        return;
    }

    let html = '<table class="ranklist-table"><thead><tr><th>排名</th><th>玩家名称</th><th>OpenID</th><th>分数</th></tr></thead><tbody>';
    
    data.ranklist.forEach(item => {
        html += `<tr>
            <td class="rank">${item.rank}</td>
            <td>${item.playername || '-'}</td>
            <td>${item.openid}</td>
            <td class="score">${item.score}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';

    if (data.self) {
        html += `<div class="self-info">
            <h4>当前玩家排名</h4>
            <p>排名: <strong>${data.self.rank}</strong> | 分数: <strong>${data.self.score}</strong></p>
        </div>`;
    }

    ranklistBox.innerHTML = html;
}

async function initConfig() {
    const appid = document.getElementById('initAppid').value.trim();

    if (!appid) {
        showResult('请输入 AppID', 'error');
        return;
    }

    showLoading();

    try {
        const response = await makeRequest('POST', '/initconfig', { appid });
        
        if (response.code === 0) {
            showResult('配置初始化成功！', 'success');
        } else {
            showResult(`初始化失败: ${response.message}`, 'error');
        }
    } catch (error) {
        showResult(error.message, 'error');
    }
}

async function generateRandomPlayers() {
    const appid = document.getElementById('generateAppid').value.trim();
    const rankType = document.getElementById('generateRankType').value;
    const count = parseInt(document.getElementById('generateCount').value) || 10;

    if (!appid) {
        showResult('请输入 AppID', 'error');
        return;
    }

    showLoading();

    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二', '小明', '小红', '小刚', '小丽', '小强'];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < count; i++) {
        const openid = `player_${Date.now()}_${i}`;
        const score = Math.floor(Math.random() * 10000) + 100;
        const playername = names[Math.floor(Math.random() * names.length)];

        try {
                const response = await makeRequest('POST', '/rankreport', {
                    appid,
                    rankid: rankType,
                    openid,
                    score,
                    playername,
                });

                if (response.code === 0) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch (error) {
                failCount++;
            }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    showResult(`生成完成！成功: ${successCount} 个，失败: ${failCount} 个`, successCount > 0 ? 'success' : 'error');
}

async function runFullTest() {
    const appid = 'test_app';
    const rankid = 'rank_total';

    showLoading();

    try {
        showResult('正在初始化配置...');
        await makeRequest('POST', '/initconfig', { appid });
        await new Promise(resolve => setTimeout(resolve, 500));

        showResult('正在重置数据...');
        await makeRequest('POST', '/reset', { appid, rankid });
        await new Promise(resolve => setTimeout(resolve, 500));

        showResult('正在生成随机玩家数据...');
        const names = ['张三', '李四', '王五', '赵六', '钱七'];
        for (let i = 0; i < 5; i++) {
            const openid = `player_${Date.now()}_${i}`;
            const score = Math.floor(Math.random() * 10000) + 100;
            const playername = names[Math.floor(Math.random() * names.length)];
            await makeRequest('POST', '/rankreport', {
                appid,
                rankid,
                openid,
                score,
                playername,
            });
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        showResult('正在获取排行榜...');
        const response = await makeRequest('POST', '/rankdata', {
            appid,
            rankid,
            range_from: 0,
            range_to: 9,
        });

        if (response.code === 0) {
            showResult('测试完成！', 'success');
            displayRanklist(response.data);
        } else {
            showResult(`测试失败: ${response.message}`, 'error');
        }
    } catch (error) {
        showResult(`测试失败: ${error.message}`, 'error');
    }
}

window.onload = function() {
    loadConfig();
    addFormEventListeners();
};