// Import constants
import { PAGE_SIZE, TEXT_TRUNCATE_LENGTH } from '../constants/constants.js';
import Statement from '../entity/Statement.js';
import './utils.js';
import { getSearchConfig } from './search-config.js';

// Get the URL head from global API
let urlHead = window.API.urlHead;
let loadingOverlay;
let currentPage = 1;
let pageSize = PAGE_SIZE;
let pageStatementListMap = new Map();
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

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for strings to be loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    // Set page title
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].statement;
    document.title = `${headerTitle} - ${pageTitle}`;

    // Check if API.urlHead is available
    if (!urlHead) {
        console.error('API.urlHead not available');
        return;
    }

    // Initialize loading overlay
    loadingOverlay = new LoadingOverlay();
    
    // Initialize other event listeners
    initializeEventListeners();

    // Add search event listener
    window.addEventListener('performSearch', (event) => {
        currentSearchString = event.detail.query;
        handleSearch();
    });
    
    // Load Statement list
    loadStatementList();

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            // Update description
            updateDescription();
            // Re-render the table with new field names
            const currentPageData = pageStatementListMap.get(currentPage);
            if (currentPageData) {
                displayStatementList(currentPageData);
                // Update pagination when language changes
                updatePaginationButtons();
            }
        }
    });

    // Initial description update
    updateDescription();
});

// Initialize event listeners
function initializeEventListeners() {
    // Initialize other event listeners
    Object.entries(EVENT_LISTENERS).forEach(([id, config]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(config.event, config.handler);
        }
    });
}

// Load statement list
async function loadStatementList(page = 1, useCache = true, config = null) {
    try {
        // Check if we have cached data for this page
        if (useCache && pageStatementListMap.has(page)) {
            displayStatementList(pageStatementListMap.get(page));
            updatePaginationButtons();
            return;
        }

        loadingOverlay.show();
        loadingOverlay.setText('Loading statement list...');
        
        let url = `${urlHead}${window.API.URL_TAIL.STATEMENT_SEARCH}?`;
        
        if (config && config.searchString) {
            url += `part=${config.searchableFields.join(',')},${config.searchString}&`;
        }
        
        url += `sort=birthHeight,desc,id,asc&size=${pageSize}`;
        
        // Add after parameter if not first page
        if (page > 1 && lastValues) {
            url += `&after=${lastValues.join(',')}`;
        }
    
        const response = await fetch(url);
        const data = await window.Utils.handleApiResponse(response, null, { page }); // Pass null as displayFunction
        
        if (data?.data) {
            // Save the statement list to our map
            pageStatementListMap.set(page, data.data);
            
            // Update last values for next page
            if (data.last) {
                lastValues = data.last;
            }
            
            // Display the data
            displayStatementList(data.data);
            
            // Update pagination buttons
            updatePaginationButtons();
        }
    } catch (error) {
        console.error('Error loading statement list:', error);
    } finally {
        loadingOverlay.hide();
    }
}

// Handle search
function handleSearch() {
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const searchString = (desktopSearchInput?.value || mobileSearchInput?.value || '').trim();
    
    // Get search configuration
    const config = getSearchConfig();
    
    // Clear existing data
    pageStatementListMap.clear();
    lastValues = null;
    currentPage = 1;
    currentSearchString = searchString;
    
    // Load new data with search configuration
    loadStatementList(1, false, {
        searchString,
        searchableFields: config.searchableFields
    });
}

// Handle previous page
function handlePreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadStatementList(currentPage, true);
    }
}

// Handle next page
function handleNextPage() {
    currentPage++;
    const config = getSearchConfig();
    loadStatementList(currentPage, true, {
        searchString: currentSearchString,
        searchableFields: config.searchableFields
    });
}

// Update pagination buttons
function updatePaginationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    
    if (prevBtn && nextBtn && pageInfo) {
        prevBtn.disabled = currentPage === 1;
        
        // Get current page data
        const currentPageData = pageStatementListMap.get(currentPage);
        // Disable next button if current page has less items than page size
        nextBtn.disabled = !currentPageData || currentPageData.length < pageSize;
        
        // Update button texts
        prevBtn.textContent = window.strings[window.currentLanguage].previous;
        nextBtn.textContent = window.strings[window.currentLanguage].next;
        
        // Use localized string for page number
        const pageText = window.strings[window.currentLanguage].pageNumber.replace('{0}', currentPage);
        pageInfo.textContent = pageText;
    }
}

// Format number to remove redundant trailing zeros
function formatNumber(value, decimals) {
    return Number(value).toFixed(decimals).replace(/\.?0+$/, '');
}

// Utility function to truncate text with ellipsis in the middle
function truncateTextWithEllipsis(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    
    const halfLength = Math.floor(maxLength / 2);
    const start = text.substring(0, halfLength);
    const end = text.substring(text.length - halfLength);
    return `${start}...${end}`;
}

// Display statement list
function displayStatementList(statementList) {
    const tableHeader = document.getElementById('statement-table-header');
    const tableBody = document.getElementById('statement-table-body');
    
    // Clear existing content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Get field width map and show field name map
    const fieldWidthMap = Statement.getFieldWidthMap();
    const showFieldNameMap = Statement.getShowFieldNameAsMap();
    const headers = Object.keys(fieldWidthMap);
    const currentLang = window.currentLanguage || 'en';
    
    // Always create table headers
    headers.forEach(field => {
        const th = document.createElement('th');
        th.style.width = `${fieldWidthMap[field]}px`;
        let fieldName;

        fieldName = window.strings[currentLang]?.fieldNames?.[field] ||
                    showFieldNameMap[field] ||
                    field.replace(/([A-Z])/g, ' $1').trim();
        th.textContent = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        tableHeader.appendChild(th);
    });
    
    // Only create table body if statementList exists and has items
    if (statementList && statementList.length > 0) {
        const timestampFields = Statement.getTimestampFieldList();
        const satoshiFields = Statement.getSatoshiFieldList();
        
        statementList.forEach(statement => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            
            // Add click handler for the entire row
            tr.addEventListener('click', (event) => {
                // If clicking on text content, only copy and don't navigate
                if (event.target.nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                    return;
                }
                
                // Store the statement data in sessionStorage
                sessionStorage.setItem('statementDetail', JSON.stringify(statement));
                
                // Navigate to statement detail page
                window.location.href = '/html/statement-detail.html';
            });
            
            headers.forEach(field => {
                const td = document.createElement('td');
                let value = statement[field] ?? "";
                
                // Handle different field types
                if (timestampFields.includes(field)) {
                    const textSpan = document.createElement('span');
                    if (value) {
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
                        textSpan.innerHTML = `${dateStr}<br>${timeStr}`;
                    }
                    td.appendChild(textSpan);
                } else if (satoshiFields.includes(field)) {
                    value = formatNumber(value / 100000000, 8);
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
                    // Truncate text if it's too long
                    textSpan.textContent = value.length > TEXT_TRUNCATE_LENGTH ? truncateTextWithEllipsis(value, TEXT_TRUNCATE_LENGTH) : value;
                    // Add link color for publisher field
                    if (field === 'publisher') {
                        textSpan.style.color = 'var(--link-color)';  // Use CSS variable for link color
                    }
                    td.appendChild(textSpan);
                }
                
                // Add click to copy functionality for all fields
                td.style.cursor = 'pointer';
                td.title = field === 'publisher' ? 'Click to view CID details' : 'Click to copy';
                td.addEventListener('click', async (event) => {
                    // If clicking on text content
                    if (event.target.nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                        if (field === 'publisher') {
                            // Navigate to CID detail page with id as id
                            window.location.href = `/html/cid-detail.html?id=${value}`;
                        } else {
                            try {
                                await navigator.clipboard.writeText(event.target.textContent);
                                
                                // Show copy confirmation message at clicked position
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
                                
                                // Remove message after 1 second
                                setTimeout(() => {
                                    copyMessage.remove();
                                }, 1000);
                            } catch (err) {
                                console.error('Failed to copy text: ', err);
                            }
                        }
                    }
                });
                
                tr.appendChild(td);
            });
            
            tableBody.appendChild(tr);
        });
    }
}

// Function to update description based on current language
function updateDescription() {
    const currentLang = window.currentLanguage || 'en';
    const description = window.strings[currentLang]?.statementDescription || '';
    
    const enDesc = document.querySelector('.description.en');
    const zhDesc = document.querySelector('.description.zh');
    
    if (enDesc) enDesc.textContent = window.strings.en.statementDescription;
    if (zhDesc) zhDesc.textContent = window.strings.zh.statementDescription;
    
    // Show/hide appropriate description based on language
    if (enDesc) enDesc.style.display = currentLang === 'en' ? 'inline-block' : 'none';
    if (zhDesc) zhDesc.style.display = currentLang === 'zh' ? 'inline-block' : 'none';
}

// Export functions for Header.js to use
window.StatementList = {
    updateStrings: () => {
        const currentPageData = pageStatementListMap.get(currentPage);
        if (currentPageData) {
            displayStatementList(currentPageData);
            updatePaginationButtons();
        }
    }
}; 