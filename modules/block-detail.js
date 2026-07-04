// Import BlockInfo class
import BlockInfo from '../entity/BlockInfo.js';
import TxMark from '../entity/TxMark.js';
import { getSearchConfig } from './search-config.js';

// Get the URL head from global API
// Use a getter function to always get the current working server URL
const getUrlHead = () => window.API.urlHead;
const urlTail = window.API.URL_TAIL.BLOCK_BY_IDS;
const urlTailByHeight = '/sn2/v1/blockByHeights';
let loadingOverlay;

document.addEventListener('DOMContentLoaded', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const height = urlParams.get('height');

    if (!id && !height) {
        console.error('No Block ID or Height provided');
        return;
    }

    // Load LoadingOverlay script if not already loaded
    if (!window.LoadingOverlay) {
        const script = document.createElement('script');
        script.src = '/modules/LoadingOverlay.js';
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Initialize loading overlay
    loadingOverlay = new LoadingOverlay();
    
    // Show loading overlay
    loadingOverlay.show();
    loadingOverlay.setText('Loading Block details...');
    
    // Fetch Block by ID or Height
    let blockInfo;
    if (height) {
        blockInfo = await fetchBlockByHeight(height);
    } else {
        blockInfo = await fetchBlockById(id);
    }
    
    // Hide loading overlay
    loadingOverlay.hide();

    if (!blockInfo) {
        console.error('Failed to get Block data');
        return;
    }
    
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].fieldNames?.blockDetail || 'Block Detail';
    document.title = `${headerTitle} - ${pageTitle}`;
    
    displayBlockDetails(blockInfo);
    
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            const currentLang = event.detail.lang;
            const title = window.strings[currentLang]?.fieldNames?.blockDetail || 'Block Detail';
            document.title = `${window.strings[currentLang].siteTitle} - ${title}`;
            displayBlockDetails(blockInfo);
        }
    });

    // Set data-disable-header-search attribute to hide search bar
    document.body.setAttribute('data-disable-header-search', 'true');
});

// Function to fetch Block by ID
async function fetchBlockById(id) {
    try {
        const parameters = `?ids=${id}&sn=sn2`;
        const url = getUrlHead() + urlTail + parameters;

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result?.data && result.data[id]) {
            return BlockInfo.fromJson(JSON.stringify(result.data[id]));
        }
        return null;
    } catch (error) {
        console.error('Error fetching Block by ID:', error);
        return null;
    }
}

// Function to fetch Block by Height
async function fetchBlockByHeight(height) {
    try {
        const parameters = `?terms=1,height,${height}`;
        const url = getUrlHead() + urlTailByHeight + parameters;

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result?.data && result.data[height]) {
            return BlockInfo.fromJson(JSON.stringify(result.data[height]));
        }
        return null;
    } catch (error) {
        console.error('Error fetching Block by Height:', error);
        return null;
    }
}

function displayBlockDetails(blockInfo) {
    const detailContent = document.getElementById('block-detail-content');
    if (!detailContent) return;

    // Create container for all content
    let detailHTML = '<div class="block-detail-container">';

    // Create main table for Block details
    detailHTML += '<div class="main-table-container">';
    detailHTML += '<table class="detail-table-unified">';

    // Get fields from BlockInfo constructor, excluding txList
    const blockInfoInstance = new BlockInfo();
    const orderedFields = Object.keys(blockInfoInstance).filter(field => field !== 'txList');

    // Add rows for all properties of the blockInfo instance in the defined order
    orderedFields.forEach(field => {
        const value = blockInfo[field];
        // Skip if field is null or undefined
        if (value === null || value === undefined) return;

        const originalValue = value;
        let valueClass = '';
        let displayValue = value;

        if (field === 'time') {
            const date = new Date(value * 1000);
            displayValue = date.toLocaleString(undefined, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(/\//g, '-');
        } else if (field === 'inValueT' || field === 'outValueT') {
            displayValue = formatNumber(value / 100000000, 8);
        } else if (field === 'fee') {
            displayValue = formatNumber(value / 1000000, 6) + 'c';
        } else if (typeof value === 'boolean') {
            displayValue = value ? '✓' : '✗';
            valueClass = value ? 'boolean-true' : 'boolean-false';
        }

        const copyValue = originalValue === null ? '' : String(originalValue);
        const currentLang = window.currentLanguage || 'en';
        const fieldName = window.strings[currentLang]?.fieldNames?.[field] || 
                         field.replace(/([A-Z])/g, ' $1').trim();
        
        detailHTML += `
            <tr>
                <th>${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</th>
                <td>
                    <span class="copyable ${valueClass}" data-value="${copyValue}" style="cursor: pointer;">
                        ${displayValue}
                    </span>
                </td>
            </tr>
        `;
    });
    detailHTML += '</table>';
    detailHTML += '</div>';

    // Add container for tx list table
    if (blockInfo.txList && blockInfo.txList.length > 0) {
        // Log txList to console
        console.log('Block txList:', blockInfo.txList);

        detailHTML += `
            <div class="cash-tables-container" style="margin: 0px 20px 15px 20px;">
                <div class="cash-table-wrapper">
                    <h3>${window.currentLanguage === 'en' ? 'TX List' : '交易列表'}</h3>
                    <table class="detail-table-unified">
                        <thead>
                            <tr>
                                <th>${window.strings[window.currentLanguage]?.fieldNames?.id || 'ID'}</th>
                                <th>${window.strings[window.currentLanguage]?.fieldNames?.outValue || 'Out Value'}</th>
                                <th>${window.strings[window.currentLanguage]?.fieldNames?.fee || 'Fee'}</th>
                                <th>${window.strings[window.currentLanguage]?.fieldNames?.cdd || 'CDD'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${blockInfo.txList.map(tx => `
                                <tr style="cursor: pointer;">
                                    <td>
                                        <span class="copyable" data-value="${tx.id || ''}" style="cursor: pointer;">
                                            ${tx.id || ''}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="copyable" data-value="${tx.outValue || ''}" style="cursor: pointer;">
                                            ${tx.outValue ? formatNumber(tx.outValue / 100000000, 8) : ''}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="copyable" data-value="${tx.fee || ''}" style="cursor: pointer;">
                                            ${tx.fee ? formatNumber(tx.fee / 100, 2) + 'c' : ''}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="copyable" data-value="${tx.cdd || ''}" style="cursor: pointer;">
                                            ${tx.cdd || ''}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    detailHTML += '</div>'; // Close block-detail-container

    detailContent.innerHTML = detailHTML;

    // Add click handlers for copyable elements
    document.querySelectorAll('.copyable').forEach(span => {
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
                copyMessage.textContent = document.querySelector('.lang-btn.active').id.includes('en') ? 'Copied' : '已复制';
                document.body.appendChild(copyMessage);
                setTimeout(() => {
                    copyMessage.remove();
                }, 1000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    });

    // Add click handlers for table rows
    document.querySelectorAll('.cash-tables-container tr').forEach(tr => {
        tr.addEventListener('click', (e) => {
            // If clicking on text content, only copy and don't navigate
            if (e.target.nodeType === Node.TEXT_NODE || e.target.tagName === 'SPAN') {
                return;
            }
            const txId = tr.querySelector('td:first-child span').getAttribute('data-value');
            if (txId) {
                window.location.href = `/html/tx-detail.html?id=${txId}`;
            }
        });
    });
}

function formatNumber(value, decimals) {
    return Number(value).toFixed(decimals).replace(/\.?0+$/, '');
}

window.BlockDetail = {
    updateStrings: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const height = urlParams.get('height');
        if (height) {
            fetchBlockByHeight(height).then(blockInfo => {
                if (blockInfo) {
                    displayBlockDetails(blockInfo);
                }
            });
        } else if (id) {
            fetchBlockById(id).then(blockInfo => {
                if (blockInfo) {
                    displayBlockDetails(blockInfo);
                }
            });
        }
    }
}; 