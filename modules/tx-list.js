// Import constants
import { PAGE_SIZE, TEXT_TRUNCATE_LENGTH } from '../constants/constants.js';
import Tx from '../entity/Tx.js';
import './utils.js';  // Fix the import path
import { getSearchConfig } from './search-config.js';

// Get the URL head from global API
let urlHead = window.API.urlHead;
let loadingOverlay;
let currentPage = 1;
let pageSize = PAGE_SIZE;
let pageTxListMap = new Map();
let lastValues = null;
let currentSearchString = '';

// Event listener configurations
const EVENT_LISTENERS = {
    'desktop-search-input': {
        event: 'input',
        handler: (e) => {
            // Remove keyboard when clicking outside input
            if (e.target !== document.activeElement) {
                e.target.blur();
            }
        }
    },
    'mobile-search-input': {
        event: 'input',
        handler: (e) => {
            // Remove keyboard when clicking outside input
            if (e.target !== document.activeElement) {
                e.target.blur();
            }
        }
    },
    'prev-btn': {
        event: 'click',
        handler: () => handlePreviousPage()
    },
    'next-btn': {
        event: 'click',
        handler: () => handleNextPage()
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].tx || 'TX';
    document.title = `${headerTitle} - ${pageTitle}`;

    if (!urlHead) {
        console.error('API.urlHead not available');
        return;
    }

    loadingOverlay = new LoadingOverlay();
    initializeEventListeners();

    window.addEventListener('performSearch', (event) => {
        currentSearchString = event.detail.query;
        handleSearch();
    });

    loadTxList();

    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            updateDescription();
            const currentPageData = pageTxListMap.get(currentPage);
            if (currentPageData) {
                displayTxList(currentPageData);
                updatePaginationButtons();
            }
        }
    });

    updateDescription();
});

function initializeEventListeners() {
    Object.entries(EVENT_LISTENERS).forEach(([id, config]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(config.event, config.handler);
        }
    });
}

async function loadTxList(page = 1, useCache = true, config = null) {
    try {
        if (useCache && pageTxListMap.has(page)) {
            displayTxList(pageTxListMap.get(page));
            updatePaginationButtons();
            return;
        }
        loadingOverlay.show();
        loadingOverlay.setText('Loading tx list...');

        let url = `${urlHead}${window.API.URL_TAIL.TX_SEARCH}?`;
        if (config && config.searchString) {
            url += `part=${config.searchableFields.join(',')},${config.searchString}&`;
        } else {
            url += 'range=txIndex,gt,0&';
        }
        url += `sort=height,desc,txIndex,desc&size=${pageSize}`;
        if (page > 1 && lastValues) {
            url += `&after=${lastValues.join(',')}`;
        }
        
        const response = await fetch(url);
        const data = await window.Utils.handleApiResponse(response, displayTxList, { page });
        
        if (data?.data) {
            pageTxListMap.set(page, data.data);
            if (data.last) {
                lastValues = data.last;
            }
            // Display the data
            displayTxList(data.data);
            updatePaginationButtons();
        }
    } catch (error) {
        console.error('Error loading tx list:', error);
    } finally {
        loadingOverlay.hide();
    }
}

function handleSearch() {
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const searchString = (desktopSearchInput?.value || mobileSearchInput?.value || '').trim();
    
    // Get search configuration
    const config = getSearchConfig();
    
    // Only clear cache and reset if there's a search string
    if (searchString) {
        pageTxListMap.clear();
        lastValues = null;
        currentPage = 1;
        currentSearchString = searchString;
        
        // Load new data with search configuration
        loadTxList(1, false, {
            searchString,
            searchableFields: config.searchableFields
        });
    }
}

function handlePreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadTxList(currentPage, true);
    }
}

function handleNextPage() {
    currentPage++;
    const config = getSearchConfig();
    loadTxList(currentPage, true, {
        searchString: currentSearchString,
        searchableFields: config.searchableFields
    });
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    if (prevBtn && nextBtn && pageInfo) {
        prevBtn.disabled = currentPage === 1;
        const currentPageData = pageTxListMap.get(currentPage);
        nextBtn.disabled = !currentPageData || currentPageData.length < pageSize;
        prevBtn.textContent = window.strings[window.currentLanguage].previous;
        nextBtn.textContent = window.strings[window.currentLanguage].next;
        const pageText = window.strings[window.currentLanguage].pageNumber.replace('{0}', currentPage);
        pageInfo.textContent = pageText;
    }
}

function formatNumber(value, decimals) {
    return Number(value).toFixed(decimals).replace(/\.?0+$/, '');
}

function truncateTextWithEllipsis(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    const halfLength = Math.floor(maxLength / 2);
    const start = text.substring(0, halfLength);
    const end = text.substring(text.length - halfLength);
    return `${start}...${end}`;
}

function displayTxList(txList) {
    const tableHeader = document.getElementById('tx-table-header');
    const tableBody = document.getElementById('tx-table-body');
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Get field width map and show field name map
    const fieldWidthMap = Tx.getFieldWidthMap();
    const showFieldNameMap = Tx.getShowFieldNameAsMap();
    const headers = Object.keys(fieldWidthMap);
    const currentLang = window.currentLanguage || 'en';
    
    // Always create table headers
    headers.forEach(field => {
        const th = document.createElement('th');
        th.style.width = `${fieldWidthMap[field]}px`;
        const fieldName = window.strings[currentLang]?.fieldNames?.[field] ||
                          showFieldNameMap[field] ||
                          field.replace(/([A-Z])/g, ' $1').trim();
        th.textContent = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        tableHeader.appendChild(th);
    });

    // Only create table body if txList exists and has items
    if (txList && txList.length > 0) {
        const timestampFields = Tx.getTimestampFieldList();
        const satoshiFields = Tx.getSatoshiFieldList();
        
        txList.forEach(tx => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            
            // Add click handler for the entire row
            tr.addEventListener('click', (event) => {
                // If clicking on text content, only copy and don't navigate
                if (event.target.nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                    return;
                }
                
                // Navigate to tx detail page with id parameter
                window.location.href = `/html/tx-detail.html?id=${tx.id}`;
            });
            
            headers.forEach(field => {
                const td = document.createElement('td');
                let value = tx[field] ?? "";
                if (timestampFields.includes(field)) {
                    const date = new Date(value * 1000);
                    const dateStr = date.toLocaleDateString(undefined, {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '/');
                    const timeStr = date.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });
                    const textSpan = document.createElement('span');
                    textSpan.innerHTML = `${dateStr}<br>${timeStr}`;
                    td.appendChild(textSpan);
                } else if (satoshiFields.includes(field)) {
                    value = formatNumber(value / 100000000, 8);
                    const textSpan = document.createElement('span');
                    textSpan.textContent = value;
                    td.appendChild(textSpan);
                } else if (field === 'fee') {
                    value = formatNumber(value / 100, 2) + 'c';
                    const textSpan = document.createElement('span');
                    textSpan.textContent = value;
                    td.appendChild(textSpan);
                } else if (typeof value === 'boolean') {
                    value = value ? '✓' : '✗';
                    td.style.color = value === '✓' ? 'green' : 'red';
                    const textSpan = document.createElement('span');
                    textSpan.textContent = value;
                    td.appendChild(textSpan);
                } else {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = value.length > TEXT_TRUNCATE_LENGTH ? truncateTextWithEllipsis(value, TEXT_TRUNCATE_LENGTH) : value;
                    td.appendChild(textSpan);
                }
                td.style.cursor = 'pointer';
                td.title = 'Click to copy';
                td.addEventListener('click', async (event) => {
                    if (event.target.nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                        try {
                            await navigator.clipboard.writeText(event.target.textContent);
                            const copyMessage = document.createElement('div');
                            copyMessage.style.position = 'fixed';
                            copyMessage.style.left = `${event.clientX}px`;
                            copyMessage.style.top = `${event.clientY - 30}px`;
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
                    }
                });
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } else {
        // Handle empty search results
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = headers.length;
        td.style.textAlign = 'center';
        td.style.padding = '20px';
        td.textContent = window.strings[window.currentLanguage].codeMessage.code1011 || 'No data meeting the conditions.';
        tr.appendChild(td);
        tableBody.appendChild(tr);
    }
}

function updateDescription() {
    const currentLang = window.currentLanguage || 'en';
    const description = window.strings[currentLang]?.txDescription || '';
    const enDesc = document.querySelector('.description.en');
    const zhDesc = document.querySelector('.description.zh');
    if (enDesc) enDesc.textContent = window.strings.en.txDescription || '';
    if (zhDesc) zhDesc.textContent = window.strings.zh.txDescription || '';
    if (enDesc) enDesc.style.display = currentLang === 'en' ? 'inline-block' : 'none';
    if (zhDesc) zhDesc.style.display = currentLang === 'zh' ? 'inline-block' : 'none';
}

window.TxList = {
    updateStrings: () => {
        const currentPageData = pageTxListMap.get(currentPage);
        if (currentPageData) {
            displayTxList(currentPageData);
            updatePaginationButtons();
        }
    }
}; 