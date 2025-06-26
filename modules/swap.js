// Get the URL head from global API
const urlHead = 'https://cid.cash/APIP';

// Language configuration
const swapStrings = {
    en: {
        siteTitle: "Freeverse",
        swap: "Swap",
        swapDescription: "Freely swap coins or provide swap services",
        howToUse: "How to use swap:",
        swapInstruction: "Send coins to the Dealer and you will receive another coin after the required number of confirmations.",
        addLPInstruction: "Send coins ending with 111 sats to the dealer. For example: 66.60000111.",
        donate: "Donate",
        donateInstruction: "Send coins ending with 999 sats to the dealer.",
        feature: "Feature",
        featureInstruction: "All the information of the services can be checked on the blockchain.",
        importantNote: "IMPORTANT: Swap only between the addresses from the SAME PRIVATE KEY which is controlled by YOURSELF!!!",
        checkAddresses: "(Check your addresses)",
        noServices: "No swap services available at the moment.",
        rating: "Rating",
        cdd: "CDD",
        owner: "Owner",
        waiters: "Waiters",
        noWaiters: "No waiters",
        sid: "SID",
        dealer: "Dealer",
        withdrawLP: "Withdraw",
        confirmations: "Required confirmations",
        for: "for",
        pool: "Pool",
        price: "Price",
        estimatePrice: "Estimate the price (excluding TX fee):",
        buyGoodsPlaceholder: "Buy {0}. Input the amount.",
        sellGoodsPlaceholder: "Sell {0}. Input the amount.",
        buyMoneyPlaceholder: "Buy {0}. Input the amount.",
        sellMoneyPlaceholder: "Sell {0}. Input the amount.",
        youWillGet: "You will get about",
        youHaveToPay: "You have to pay about",
        toTheDealer: "to the dealer.",
        finished: "Finished",
        pending: "Pending",
        addLp: "Add LP",
        share: "Shares",
        rate: "Rate",
        copied: "Copied",
        finishedAffairs: "#SID {0} finished affairs:",
        pendingAffairs: "#SID {0} pending affairs:",
        lpInfo: "#SID {0} LP:",
        goods: "Goods:",
        money: "Money:",
        raw: "raw",
        net: "net",
        profit: "profit",
        rateService: "Rate the service by sending a TX with below Json in OP_RETURN:",
        rateNote: "* The value of 'rate' has to be an integer from 0 to 5.\n* The TX should destroy at least 1 cd.",
        send: "Send",
        noFinishedAffair: "No finished affair.",
        noPendingAffair: "No pending affair.",
        dataNotFound: "Data not found or error in response",
        noLP: "NO LP or error: ",
    },
    zh: {
        siteTitle: "自由宇宙",
        swap: "兑换",
        swapDescription: "自由兑换币或提供兑换服务",
        howToUse: "如何使用兑换:",
        swapInstruction: "向交易商发送币，在所需确认数之后，您将收到另一种币。",
        addLPInstruction: "向交易商发送以111聪结尾的币。例如: 66.60000111。",
        donate: "捐赠",
        donateInstruction: "向交易商发送以999聪结尾的币。",
        feature: "特点",
        featureInstruction: "所有服务信息都可以在区块链上查看。",
        importantNote: "重要提示: 仅在由您自己控制的相同私钥的地址之间进行兑换！！！",
        checkAddresses: "（检查您的地址）",
        noServices: "目前没有可用的兑换服务。",
        rating: "评分",
        cdd: "币天销毁",
        owner: "所有者",
        waiters: "客服",
        noWaiters: "无客服",
        sid: "服务ID",
        dealer: "交易商",
        withdrawLP: "提取",
        confirmations: "所需确认数",
        for: "用于",
        pool: "资金池",
        price: "价格",
        estimatePrice: "估算价格（不含交易费）:",
        buyGoodsPlaceholder: "购买{0}。输入数量。",
        sellGoodsPlaceholder: "出售{0}。输入数量。",
        buyMoneyPlaceholder: "购买{0}。输入数量。",
        sellMoneyPlaceholder: "出售{0}。输入数量。",
        youWillGet: "您将获得约",
        youHaveToPay: "您需要支付约",
        toTheDealer: "给交易商。",
        finished: "已完成",
        pending: "待处理",
        addLp: "入股",
        share: "股权",
        rate: "评分",
        copied: "已复制",
        finishedAffairs: "#服务ID {0} 已完成事务:",
        pendingAffairs: "#服务ID {0} 待处理事务:",
        lpInfo: "#服务ID {0} 流动性:",
        goods: "商品:",
        money: "货币:",
        raw: "原始",
        net: "净值",
        profit: "收益",
        rateService: "通过发送包含以下Json的OP_RETURN交易来评分服务:",
        rateNote: "* 'rate'的值必须是0到5之间的整数。\n* 交易必须销毁至少1个币天。",
        send: "发送",
        noFinishedAffair: "没有已完成的事务。",
        noPendingAffair: "没有待处理的事务。",
        dataNotFound: "未找到数据或响应错误",
        noLP: "没有流动性或错误: ",
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for strings to be loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    // Set page title
    const pageTitle = swapStrings[window.currentLanguage].swap;
    document.title = `${swapStrings[window.currentLanguage].siteTitle} - ${pageTitle}`;

    // Update all text content with current language
    updateSwapTexts(window.currentLanguage);

    // Load swap services
    loadSwapServices();

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            // Update page title
            const currentLang = event.detail.lang;
            const title = swapStrings[currentLang]?.swap || 'Swap';
            document.title = `${swapStrings[currentLang].siteTitle} - ${title}`;
            
            // Update all text content
            updateSwapTexts(currentLang);
            
            // Reload swap services to update service cards
            loadSwapServices();
        }
    });
});

// Function to update all text content based on language
function updateSwapTexts(lang) {
    const strings = swapStrings[lang];
    
    // Update description
    const description = document.querySelector('.description');
    if (description) {
        description.textContent = strings.swapDescription;
    }

    // Update instruction box
    const instructionBox = document.querySelector('.instruction-box');
    if (instructionBox) {
        instructionBox.innerHTML = `
            <h3>${strings.howToUse}</h3>
            <p><strong>${strings.swap}</strong>: ${strings.swapInstruction}</p>
            <p><strong>${strings.addLp}</strong>: ${strings.addLPInstruction}</p>
            <p><strong>${strings.donate}</strong>: ${strings.donateInstruction}</p>
            <p><strong>${strings.feature}</strong>: ${strings.featureInstruction}</p>
            <p><strong class="highlight">${strings.importantNote}</strong> <a href="https://cid.cash/addressConversion.html" style="color: inherit;">${strings.checkAddresses}</a></p>
        `;
    }
}

// Load swap services
async function loadSwapServices() {
    try {
        const response = await fetch(urlHead + '/swapHall/v1/swapInfo');
        if (!response.ok) {
            throw new Error('No data found.' + response.statusText);
        }
        const data = await response.json();
        // Clear existing content before displaying new content
        const resultArea = document.getElementById('resultArea');
        resultArea.innerHTML = '';
        displaySwapServices(data);
    } catch (error) {
        console.error('No data or error: ', error);
        document.getElementById('resultArea').textContent = swapStrings[window.currentLanguage].noServices;
    }
}

// Display swap services
function displaySwapServices(data) {
    const resultArea = document.getElementById('resultArea');
    const strings = swapStrings[window.currentLanguage];
    
    if (!data.data || data.data.length === 0) {
        resultArea.textContent = strings.noServices;
        return;
    }

    data.data.forEach(item => {
        const serviceBox = document.createElement('div');
        serviceBox.className = 'service-box';

        const moneySum = item.mSum + item.mPendingSum;
        const goodsSum = item.gSum + item.gPendingSum;
        const swapFee = Number(item.swapFee);
        const serviceFee = Number(item.serviceFee);
        const moneyPerGoods = (((moneySum) / (goodsSum - 1)) / (1 - swapFee - serviceFee)).toFixed(8);
        const goodsPerMoney = (1 / moneyPerGoods).toFixed(8);
        
        const gAddrId = `copyableAddr_g_${item.sid}`;
        const mAddrId = `copyableAddr_m_${item.sid}`;

        const avatarGAddrURL = urlHead + `/freeGet/v1/getAvatar?fid=${item.gAddr}`;
        const avatarOwnerURL = urlHead + `/freeGet/v1/getAvatar?fid=${item.owner}`;

        serviceBox.innerHTML = `
            <h3>${item.name}</h3>
            <div class="avatar-container">
                <img src="${avatarGAddrURL}" alt="${strings.dealer}" class="avatar-dealer">
                <p><strong>${item.gTick.toUpperCase()} ${strings.dealer}</strong>: <span id="${gAddrId}" class="copyable" data-value="${item.gAddr}">${item.gAddr}</span> <span class="copy-hint">${window.currentLanguage === 'zh' ? '点击复制' : 'Click to copy'}</span><br>
                <strong> ${item.mTick.toUpperCase()} ${strings.dealer}</strong>: <span id="${mAddrId}" class="copyable" data-value="${item.mAddr}">${item.mAddr}</span> <span class="copy-hint">${window.currentLanguage === 'zh' ? '点击复制' : 'Click to copy'}</span></p>
            </div>
            <p><strong>${strings.confirmations}</strong>:   ${item.gTick.toUpperCase()} <span class="highlight">${item.gConfirm}</span>, ${item.mTick.toUpperCase()} <span class="highlight"> ${item.mConfirm}</span>.</p>
            <div class="avatar-container">
                <p><strong> ${strings.owner}</strong>: <img src="${avatarOwnerURL}" alt="${strings.owner}" class="avatar-owner"> <a href="https://cid.cash/fid.html?address=${item.owner}" target="_blank">${item.owner}</a></p>
            </div>
            <p><strong>${strings.rating}</strong>: <span class="highlight">${item.tRate}</span> , <strong>${strings.cdd}</strong>: <span class="highlight">${item.tCdd}</span>  cd</p>
            <p><strong>${strings.waiters}</strong>: ${item && item.waiters ? item.waiters.join(', ') : strings.noWaiters}</p>
            <p><strong>${strings.sid}</strong>: <a href="https://cid.cash/service.html?id=${item.sid}" target="_blank">${item.sid}</a></p>
            <p><strong>${strings.withdrawLP} ${item.gTick} ${strings.share}</strong>: ${strings.send} <strong>${item.gWithdrawFee}</strong> ${item.gTick} ${strings.toTheDealer}</p>
            <p><strong>${strings.withdrawLP} ${item.mTick} ${strings.share}</strong>: ${strings.send} <strong>${item.mWithdrawFee}</strong> ${item.mTick} ${strings.toTheDealer}</p>
            <p><strong>${strings.pool}</strong>: <span class="highlight">${item.gSum.toFixed(4)}</span> ${item.gTick} / <span class="highlight">${item.mSum.toFixed(4)}</span> ${item.mTick}</p>
            <p><strong>${strings.price}</strong>: <span class="highlight">${moneyPerGoods}</span> ${item.mTick}/${item.gTick}, <span class="highlight">${goodsPerMoney}</span> ${item.gTick}/${item.mTick}</p>
            <hr>
            <p><strong>${strings.estimatePrice}</strong></p>
            <div>
                <input type="number" class="buyGoodsInput" data-mTick="${item.mTick.toUpperCase()}" data-mSum="${item.mSum}" data-mAddr="${item.mAddr}" placeholder="${strings.buyGoodsPlaceholder.replace('{0}', item.gTick.toUpperCase())}">
                <div class="buyGoodsDisplay result-display"></div>
            </div>
            <div>
                <input type="number" class="sendGoodsInput" data-mTick="${item.mTick.toUpperCase()}" data-mSum="${item.mSum}" data-mAddr="${item.mAddr}" placeholder="${strings.sellGoodsPlaceholder.replace('{0}', item.gTick.toUpperCase())}">
                <div class="sendGoodsDisplay result-display"></div>
            </div>
            <div>
                <input type="number" class="buyMoneyInput" data-gTick="${item.gTick.toUpperCase()}" data-gSum="${item.gSum}" data-gAddr="${item.gAddr}" placeholder="${strings.buyMoneyPlaceholder.replace('{0}', item.mTick.toUpperCase())}">
                <div class="buyMoneyDisplay result-display"></div>
            </div>
            <div>
                <input type="number" class="sendMoneyInput" data-gTick="${item.gTick.toUpperCase()}" data-gSum="${item.gSum}" data-gAddr="${item.gAddr}" placeholder="${strings.sellMoneyPlaceholder.replace('{0}', item.mTick.toUpperCase())}">
                <div class="sendMoneyDisplay result-display"></div>
            </div>
        `;

        const button0 = createButton(strings.finished, () => fetchFinished(item.sid));
        const button1 = createButton(strings.pending, () => fetchPendings(item.sid));
        const button2 = createButton(strings.share, () => fetchLps(item.sid));
        const button3 = createButton(strings.rate, () => rate(item.sid));

        serviceBox.appendChild(button0);
        serviceBox.appendChild(button1);
        serviceBox.appendChild(button2);
        serviceBox.appendChild(button3);

        resultArea.appendChild(serviceBox);

        // Add event listeners for copyable elements
        serviceBox.querySelectorAll('.copyable').forEach(span => {
            span.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    const valueToCopy = span.getAttribute('data-value');
                    if (!valueToCopy) {
                        console.warn('No value to copy');
                        return;
                    }
                    
                    await navigator.clipboard.writeText(String(valueToCopy));
                    
                    // Show copy confirmation message at clicked position
                    const copyMessage = document.createElement('div');
                    copyMessage.style.position = 'fixed';
                    copyMessage.style.left = `${e.clientX}px`;
                    copyMessage.style.top = `${e.clientY - 30}px`;
                    copyMessage.style.transform = 'translateX(-50%)';
                    copyMessage.style.padding = '4px 8px';
                    copyMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    copyMessage.style.color = 'white';
                    copyMessage.style.borderRadius = '4px';
                    copyMessage.style.zIndex = '1000';
                    copyMessage.style.fontSize = '12px';
                    copyMessage.style.pointerEvents = 'none';
                    copyMessage.textContent = swapStrings[window.currentLanguage].copied;
                    document.body.appendChild(copyMessage);
                    
                    setTimeout(() => {
                        copyMessage.remove();
                    }, 1000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            });
        });

        // Event listeners for the input boxes
        const sendMoneyInput = serviceBox.querySelector('.sendMoneyInput');
        const sendGoodsInput = serviceBox.querySelector('.sendGoodsInput');
        const buyMoneyInput = serviceBox.querySelector('.buyMoneyInput');
        const buyGoodsInput = serviceBox.querySelector('.buyGoodsInput');

        sendMoneyInput.addEventListener('input', () => HandleSendMoney(item, sendMoneyInput));
        sendGoodsInput.addEventListener('input', () => HandleSendGoods(item, sendGoodsInput));
        buyMoneyInput.addEventListener('input', () => HandleBuyMoney(item, buyMoneyInput));
        buyGoodsInput.addEventListener('input', () => HandleBuyGoods(item, buyGoodsInput));
    });
}

// Create button element
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    return button;
}

// Handle send money input
function HandleSendMoney(item, inputElement) {
    const inputNumber = inputElement.value;
    const gTick = item.gTick;
    const moneySum = item.mSum + item.mPendingSum;
    const goodsSum = item.gSum + item.gPendingSum;
    const swapFee = Number(item.swapFee);
    const serviceFee = Number(item.serviceFee);
    const moneyToSend = inputNumber / (1 - swapFee - serviceFee);
    const goodsGet = ((goodsSum * moneyToSend) / (moneySum + moneyToSend)).toFixed(8);
    inputElement.parentNode.querySelector('.sendMoneyDisplay').textContent = `${swapStrings[window.currentLanguage].youWillGet} `;
    const span = document.createElement('span');
    span.style.color = 'red';
    span.textContent = `${goodsGet} ${gTick}`;
    inputElement.parentNode.querySelector('.sendMoneyDisplay').appendChild(span);
    inputElement.parentNode.querySelector('.sendMoneyDisplay').appendChild(document.createTextNode(' .'));
}

// Handle send goods input
function HandleSendGoods(item, inputElement) {
    const inputNumber = inputElement.value;
    const mTick = item.mTick;
    const moneySum = item.mSum + item.mPendingSum;
    const goodsSum = item.gSum + item.gPendingSum;
    const swapFee = Number(item.swapFee);
    const serviceFee = Number(item.serviceFee);
    const goodsToSell = inputNumber / (1 - swapFee - serviceFee);
    const moneyGet = ((moneySum * goodsToSell) / (goodsSum + goodsToSell)).toFixed(8);
    inputElement.parentNode.querySelector('.sendGoodsDisplay').textContent = `${swapStrings[window.currentLanguage].youWillGet} `;
    const span = document.createElement('span');
    span.style.color = 'red';
    span.textContent = `${moneyGet} ${mTick}`;
    inputElement.parentNode.querySelector('.sendGoodsDisplay').appendChild(span);
    inputElement.parentNode.querySelector('.sendGoodsDisplay').appendChild(document.createTextNode(' .'));
}

// Handle buy money input
function HandleBuyMoney(item, inputElement) {
    const inputNumber = inputElement.value;
    const gTick = item.gTick;
    const moneySum = item.mSum + item.mPendingSum;
    const goodsSum = item.gSum + item.gPendingSum;
    const swapFee = Number(item.swapFee);
    const serviceFee = Number(item.serviceFee);
    const goodsToPay = ((goodsSum * inputNumber) / (moneySum - inputNumber)) / (1 - swapFee - serviceFee);
    const formattedMoneytoPay = goodsToPay.toFixed(8);
    inputElement.parentNode.querySelector('.buyMoneyDisplay').textContent = `${swapStrings[window.currentLanguage].youHaveToPay} `;
    const span = document.createElement('span');
    span.style.color = 'red';
    span.textContent = `${formattedMoneytoPay} ${gTick}`;
    inputElement.parentNode.querySelector('.buyMoneyDisplay').appendChild(span);
    inputElement.parentNode.querySelector('.buyMoneyDisplay').appendChild(document.createTextNode(` ${swapStrings[window.currentLanguage].toTheDealer}`));
}

// Handle buy goods input
function HandleBuyGoods(item, inputElement) {
    const inputNumber = inputElement.value;
    const mTick = item.mTick;
    const moneySum = item.mSum + item.mPendingSum;
    const goodsSum = item.gSum + item.gPendingSum;
    const swapFee = Number(item.swapFee);
    const serviceFee = Number(item.serviceFee);
    const moneytoPay = ((moneySum * inputNumber) / (goodsSum - inputNumber)) / (1 - swapFee - serviceFee);
    const formattedMoneytoPay = moneytoPay.toFixed(8);
    inputElement.parentNode.querySelector('.buyGoodsDisplay').textContent = `${swapStrings[window.currentLanguage].youHaveToPay} `;
    const span = document.createElement('span');
    span.style.color = 'red';
    span.textContent = `${formattedMoneytoPay} ${mTick}`;
    inputElement.parentNode.querySelector('.buyGoodsDisplay').appendChild(span);
    inputElement.parentNode.querySelector('.buyGoodsDisplay').appendChild(document.createTextNode(` ${swapStrings[window.currentLanguage].toTheDealer}`));
}

// Fetch finished transactions
async function fetchFinished(sid) {
    try {
        const response = await fetch(urlHead + '/swapHall/v1/swapFinished?sid=' + sid);
        const data = await response.json();
        if (data.code === 0) {
            const simplifiedData = data.data.map(item => {
                const lowercaseState = item.state.toLowerCase();
                return ` ${item.sn} ${item.act} ${item.g.addr} ${item.g.amt.toFixed(8)} ${item.m.addr} ${item.m.amt.toFixed(8)} ${lowercaseState}`;
            }).join('\n');

            const newWindow = window.open('', '_blank');
            newWindow.document.body.style.backgroundColor = '#000000';
            newWindow.document.body.style.color = '#CCCCCC';
            newWindow.document.body.innerHTML = '<pre>' + swapStrings[window.currentLanguage].finishedAffairs.replace('{0}', sid) + '\n' + simplifiedData + '<hr></pre>';
        } else {
            alert(swapStrings[window.currentLanguage].noFinishedAffair);
        }
    } catch (error) {
        alert(swapStrings[window.currentLanguage].noFinishedAffair + error.message);
    }
}

// Fetch pending transactions
async function fetchPendings(sid) {
    try {
        const response = await fetch(urlHead + '/swapHall/v1/swapPending?sid=' + sid);
        const data = await response.json();
        if (data.code === 0) {
            const simplifiedData = data.data.map(item => {
                const lowercaseState = item.state.toLowerCase();
                return ` ${item.sn} ${item.act} ${item.g.addr} ${item.g.amt.toFixed(8)} ${item.m.addr} ${item.m.amt.toFixed(8)} ${lowercaseState}`;
            }).join('\n');

            const newWindow = window.open('', '_blank');
            newWindow.document.body.style.backgroundColor = '#000000';
            newWindow.document.body.style.color = '#CCCCCC';
            newWindow.document.body.innerHTML = '<pre>' + swapStrings[window.currentLanguage].pendingAffairs.replace('{0}', sid) + '\n' + simplifiedData + '<hr></pre>';
        } else {
            alert(swapStrings[window.currentLanguage].noPendingAffair);
        }
    } catch (error) {
        alert(swapStrings[window.currentLanguage].noPendingAffair + error.message);
    }
}

// Fetch LP information
async function fetchLps(sid) {
    try {
        const response = await fetch(urlHead + '/swapHall/v1/swapLp?sid=' + sid);
        const data = await response.json();
        if (data.code === 0) {
            let formattedData = '';
            formattedData += swapStrings[window.currentLanguage].lpInfo.replace('{0}', sid) + '\n';
            formattedData += ` ${swapStrings[window.currentLanguage].goods}\n`;
            for (const [key, value] of Object.entries(data.data.gLpRawMap)) {
                const netValue = data.data.gLpNetMap[key];
                const sharePercentage = (data.data.gLpShareMap[key] * 100).toFixed(2);
                formattedData += `  ${key}: ${swapStrings[window.currentLanguage].share} ${sharePercentage}%, ${swapStrings[window.currentLanguage].raw} ${value.toFixed(4)}, ${swapStrings[window.currentLanguage].net} ${netValue.toFixed(4)}, ${swapStrings[window.currentLanguage].profit} ${((netValue-value)*100/value).toFixed(2)}%\n`;
            }
            formattedData += ` ${swapStrings[window.currentLanguage].money}\n`;
            for (const [key, value] of Object.entries(data.data.mLpRawMap)) {
                const netValue = data.data.mLpNetMap[key];
                const sharePercentage = (data.data.mLpShareMap[key] * 100).toFixed(2);
                formattedData += `  ${key}: ${swapStrings[window.currentLanguage].share} ${sharePercentage}%, ${swapStrings[window.currentLanguage].raw} ${value.toFixed(4)}, ${swapStrings[window.currentLanguage].net} ${netValue.toFixed(4)}, ${swapStrings[window.currentLanguage].profit} ${((netValue-value)*100/value).toFixed(2)}%\n`;
            }
            formattedData += `<hr>`;
            const newWindow = window.open('', '_blank');
            newWindow.document.body.style.backgroundColor = '#000000';
            newWindow.document.body.style.color = '#CCCCCC';
            newWindow.document.body.innerHTML = '<pre>' + formattedData + '</pre>';
        } else {
            alert(swapStrings[window.currentLanguage].dataNotFound);
        }
    } catch (error) {
        alert(swapStrings[window.currentLanguage].noLP + error.message);
    }
}

// Rate service
function rate(sid) {
    const newWindow = window.open('', '_blank');
    newWindow.document.body.style.backgroundColor = '#000000';
    newWindow.document.body.style.color = '#CCCCCC';
    const jsonString = `<hr>{
  "type": "FEIP",
  "sn": 5,
  "ver": 2,
  "name": "Service",
  "data":{
    "sid": "${sid}",
    "op": "rate",
    "rate": 5
  }
}<hr>
${swapStrings[window.currentLanguage].rateNote}`
    newWindow.document.body.innerHTML = '<pre>' + swapStrings[window.currentLanguage].rateService + '</pre>' +
        '<pre>' + jsonString + '</pre>';
} 