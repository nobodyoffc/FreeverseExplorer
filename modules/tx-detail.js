// Import TxInfo class
import TxInfo from '../entity/TxInfo.js';
import CashMark from '../entity/CashMark.js';
import { getSearchConfig } from './search-config.js';

// Get the URL head from global API
// Use a getter function to always get the current working server URL
const getUrlHead = () => window.API.urlHead;
const urlTail = window.API.URL_TAIL.TX_BY_IDS;
let loadingOverlay;

document.addEventListener('DOMContentLoaded', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        console.error('No TX ID provided');
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
    loadingOverlay.setText('Loading TX details...');
    
    // Fetch TX by ID
    const txInfo = await fetchTxById(id);
    
    // Hide loading overlay
    loadingOverlay.hide();

    if (!txInfo) {
        console.error('Failed to get TX data');
        return;
    }
    
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].fieldNames?.txDetail || 'TX Detail';
    document.title = `${headerTitle} - ${pageTitle}`;
    
    displayTxDetails(txInfo);
    
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            const currentLang = event.detail.lang;
            const title = window.strings[currentLang]?.fieldNames?.txDetail || 'TX Detail';
            document.title = `${window.strings[currentLang].siteTitle} - ${title}`;
            displayTxDetails(txInfo);
        }
    });

    // Set data-disable-header-search attribute to hide search bar
    document.body.setAttribute('data-disable-header-search', 'true');
});

// Function to fetch TX by ID
async function fetchTxById(id) {
    try {
        const parameters = `?ids=${id}`;
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
            return TxInfo.fromJson(JSON.stringify(result.data[id]));
        }
        return null;
    } catch (error) {
        console.error('Error fetching TX by ID:', error);
        return null;
    }
}

function displayTxDetails(txInfo) {
    const detailContent = document.getElementById('tx-detail-content');
    if (!detailContent) return;

    // Create container for all content
    let detailHTML = '<div class="tx-detail-container">';

    // Create main table for TX details
    detailHTML += '<div class="main-table-container">';
    detailHTML += '<table class="detail-table-unified">';

    // Get fields from TxInfo constructor, excluding spentCashes and issuedCashes
    const txInfoInstance = new TxInfo();
    const orderedFields = Object.keys(txInfoInstance).filter(field => 
        field !== 'spentCashes' && field !== 'issuedCashes'
    );

    // Add rows for all properties of the txInfo instance in the defined order
    orderedFields.forEach(field => {
        const value = txInfo[field];
        // Skip if field is null or undefined
        if (value === null || value === undefined) return;

        const originalValue = value;
        let valueClass = '';
        let displayValue = value;

        if (field === 'blockTime' || field === 'lockTime') {
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

    // Add container for cash tables
    detailHTML += `
        <div class="cash-tables-container">
            <div class="cash-table-wrapper" style="overflow-x: auto;">
                <h3>${window.strings[window.currentLanguage]?.spend || 'Spend'}</h3>
                <table class="detail-table-unified" style="min-width: 100%;">
                    <thead>
                        <tr>
                            <th style="min-width: 200px;">${window.strings[window.currentLanguage]?.fieldNames?.owner || 'Owner'}</th>
                            <th style="min-width: 80px;">${window.strings[window.currentLanguage]?.fieldNames?.value || 'Value'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${txInfo.spentCashes ? txInfo.spentCashes.map(cash => `
                            <tr style="cursor: pointer;" onclick="window.location.href='/html/cash-detail.html?id=${cash.id}'">
                                <td style="min-width: 200px;">
                                    <span style="cursor: pointer; color: var(--link-color); word-break: break-all;" onclick="event.stopPropagation(); window.location.href='/html/cid-detail.html?id=${cash.owner}'">
                                        ${cash.owner}
                                    </span>
                                </td>
                                <td style="min-width: 80px;">
                                    <span class="copyable" data-value="${cash.value}" style="cursor: pointer; white-space: nowrap;">
                                        ${formatNumber(cash.value / 100000000, 8)}
                                    </span>
                                </td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
            <div class="cash-table-wrapper" style="overflow-x: auto;">
                <h3>${window.strings[window.currentLanguage]?.issue || 'Issue'}</h3>
                <table class="detail-table-unified" style="min-width: 100%;">
                    <thead>
                        <tr>
                            <th style="min-width: 200px;">${window.strings[window.currentLanguage]?.fieldNames?.owner || 'Owner'}</th>
                            <th style="min-width: 80px;">${window.strings[window.currentLanguage]?.fieldNames?.value || 'Value'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${txInfo.issuedCashes ? txInfo.issuedCashes.map(cash => `
                            <tr style="cursor: pointer;" onclick="window.location.href='/html/cash-detail.html?id=${cash.id}'">
                                <td style="min-width: 200px;">
                                    <span style="cursor: pointer; color: var(--link-color); word-break: break-all;" onclick="event.stopPropagation(); window.location.href='/html/cid-detail.html?id=${cash.owner}'">
                                        ${cash.owner}
                                    </span>
                                </td>
                                <td style="min-width: 80px;">
                                    <span class="copyable" data-value="${cash.value}" style="cursor: pointer; white-space: nowrap;">
                                        ${formatNumber(cash.value / 100000000, 8)}
                                    </span>
                                </td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    detailHTML += '</div>'; // Close tx-detail-container

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
}

function formatNumber(value, decimals) {
    return Number(value).toFixed(decimals).replace(/\.?0+$/, '');
}

window.TxDetail = {
    updateStrings: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            fetchTxById(id).then(txInfo => {
                if (txInfo) {
                    displayTxDetails(txInfo);
                }
            });
        }
    }
}; 