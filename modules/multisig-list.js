// Import constants
import { PAGE_SIZE, TEXT_TRUNCATE_LENGTH } from '../constants/constants.js';
import Multisig from '../entity/Multisig.js';
import './utils.js';
import { getSearchConfig } from './search-config.js';

// Get the URL head from global API
// Use a getter function to always get the current working server URL
const getUrlHead = () => window.API.urlHead;
let loadingOverlay;
let currentPage = 1;
let pageSize = PAGE_SIZE;
let pageMultisigListMap = new Map();
let lastValues = null;
let currentSearchString = '';

// Add avatar cache
let avatarCache = new Map();
let avatarCacheTimestamp = null;
const AVATAR_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes avatar cache duration

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
    const pageTitle = window.strings[window.currentLanguage].multisig;
    document.title = `${headerTitle} - ${pageTitle}`;

    // Check if API.urlHead is available
    if (!getUrlHead()) {
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
    
    // Load Multisig list
    loadMultisigList();

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            // Update description
            updateDescription();
            // Re-render the table with new field names (avatars are cached, so this will be fast)
            const currentPageData = pageMultisigListMap.get(currentPage);
            if (currentPageData) {
                displayMultisigList(currentPageData);
                // Update pagination when language changes
                updatePaginationButtons();
            }
        }
    });

    // Add page visibility change listener to handle back navigation
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && pageMultisigListMap.has(currentPage) && isCacheValid()) {
            // Page became visible and we have valid cached data, just display it
            // Avatars are cached separately, so this will be fast
            const currentPageData = pageMultisigListMap.get(currentPage);
            if (currentPageData) {
                displayMultisigList(currentPageData);
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

// Check if avatar cache is still valid
function isAvatarCacheValid() {
    if (!avatarCacheTimestamp) return false;
    return (Date.now() - avatarCacheTimestamp) < AVATAR_CACHE_DURATION;
}

// Check if cache is still valid
function isCacheValid() {
    // For multisig, we don't have a cache timestamp, so always consider cache valid
    // This is because multisig data doesn't change frequently
    return true;
}

// Load multisig list
async function loadMultisigList(page = 1, useCache = true, config = null) {
    try {
        // Check if we have cached data for this page
        if (useCache && pageMultisigListMap.has(page)) {
            displayMultisigList(pageMultisigListMap.get(page));
            updatePaginationButtons();
            return;
        }

        loadingOverlay.show();
        loadingOverlay.setText('Loading multisig list...');
        
        let url = `${getUrlHead()}${window.API.URL_TAIL.MULTISIG_SEARCH}?`;
        
        if (config && config.searchString) {
            url += `part=${config.searchableFields.join(',')},${config.searchString}&`;
        } else {
            url += 'range=birthTime,gt,0&';
        }
        
        url += `sort=birthTime,desc,id,asc&size=${pageSize}`;
        
        // Add after parameter if not first page
        if (page > 1 && lastValues) {
            url += `&after=${lastValues.join(',')}`;
        }
        
        const response = await fetch(url);
        const data = await window.Utils.handleApiResponse(response, null, { page }); // Pass null as displayFunction
        
        if (data?.data) {
            // Save the multisig list to our map
            pageMultisigListMap.set(page, data.data);
            
            // Update last values for next page
            if (data.last) {
                lastValues = data.last;
            }
            
            // Display the data
            displayMultisigList(data.data);
            
            // Update pagination buttons
            updatePaginationButtons();
        }
    } catch (error) {
        console.error('Error loading multisig list:', error);
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
    pageMultisigListMap.clear();
    lastValues = null;
    currentPage = 1;
    currentSearchString = searchString;
    // Keep avatar cache as avatars don't change with search
    // Only clear avatar cache on page refresh or when explicitly needed
    
    // Load new data with search configuration
    loadMultisigList(1, false, {
        searchString,
        searchableFields: config.searchableFields
    });
}

// Handle previous page
function handlePreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadMultisigList(currentPage, true);
    }
}

// Handle next page
function handleNextPage() {
    currentPage++;
    const config = getSearchConfig();
    loadMultisigList(currentPage, true, {
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
        const currentPageData = pageMultisigListMap.get(currentPage);
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

// Function to fetch CID avatars with global cache support
async function fetchCidAvatars(owners) {
    if (window.avatarCacheManager) {
        return await window.avatarCacheManager.fetchCidAvatars(owners);
    }
    
    // Fallback to local cache if global cache manager is not available
    try {
        // Check if we have cached avatars for these owners
        if (isAvatarCacheValid()) {
            const cachedAvatars = new Map();
            const missingOwners = [];
            
            // Check which owners we have cached
            owners.forEach(owner => {
                if (avatarCache.has(owner)) {
                    cachedAvatars.set(owner, avatarCache.get(owner));
                } else {
                    missingOwners.push(owner);
                }
            });
            
            // If we have all avatars cached, return them
            if (missingOwners.length === 0) {
                return cachedAvatars;
            }
            
            // If we have some cached, only fetch the missing ones
            if (missingOwners.length > 0) {
                const url = `${getUrlHead()}${window.API.URL_TAIL.CID_AVATAR_BY_IDS}?ids=${missingOwners.join(',')}`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data?.data) {
                    // Cache the new avatars
                    Object.entries(data.data).forEach(([owner, innerMap]) => {
                        const avatarMap = new Map(Object.entries(innerMap));
                        avatarCache.set(owner, avatarMap);
                        cachedAvatars.set(owner, avatarMap);
                    });
                    avatarCacheTimestamp = Date.now();
                    
                    return cachedAvatars;
                }
            }
        }
        
        // If no cache or cache invalid, fetch all avatars
        const url = `${getUrlHead()}${window.API.URL_TAIL.CID_AVATAR_BY_IDS}?ids=${owners.join(',')}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data?.data) {
            const avatarMap = new Map();
            // Cache all avatars
            Object.entries(data.data).forEach(([owner, innerMap]) => {
                const innerAvatarMap = new Map(Object.entries(innerMap));
                avatarCache.set(owner, innerAvatarMap);
                avatarMap.set(owner, innerAvatarMap);
            });
            avatarCacheTimestamp = Date.now();
            return avatarMap;
        }
        return new Map();
    } catch (error) {
        return new Map();
    }
}

// Display multisig list
async function displayMultisigList(multisigList) {
    const tableHeader = document.getElementById('multisig-table-header');
    const tableBody = document.getElementById('multisig-table-body');
    
    // Clear existing content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Get field width map and show field name map
    const fieldWidthMap = Multisig.getFieldWidthMap();
    const showFieldNameMap = Multisig.getShowFieldNameAsMap();
    const headers = Object.keys(fieldWidthMap);
    const currentLang = window.currentLanguage || 'en';
    
    // Add Avatar and CID headers first
    const avatarTh = document.createElement('th');
    avatarTh.style.width = '30px';
    avatarTh.textContent = '';  // Empty text for Avatar header
    tableHeader.appendChild(avatarTh);

    const cidTh = document.createElement('th');
    cidTh.style.width = '60px';
    cidTh.textContent = 'CID';
    tableHeader.appendChild(cidTh);
    
    // Add other headers
    headers.forEach(field => {
        const th = document.createElement('th');
        th.style.width = `${fieldWidthMap[field]}px`;
        const fieldName = window.strings[currentLang]?.fieldNames?.[field] ||
                          showFieldNameMap[field] ||
                          field.replace(/([A-Z])/g, ' $1').trim();
        th.textContent = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        tableHeader.appendChild(th);
    });
    
    // Only create table body if multisigList exists and has items
    if (multisigList && multisigList.length > 0) {
        const timestampFields = Multisig.getTimestampFieldList();

        // Fetch CID avatars for all owners
        const owners = [...new Set(multisigList.map(multisig => multisig.id).filter(Boolean))];
        const idAvatarMap = await fetchCidAvatars(owners);

        multisigList.forEach(multisig => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            
            // Add click handler for the entire row
            tr.addEventListener('click', (event) => {
                // If clicking on text content, only copy and don't navigate
                if (event.target.nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                    return;
                }
                
                // Store the multisig data in sessionStorage
                sessionStorage.setItem('multisigDetail', JSON.stringify(multisig));
                
                // Navigate to multisig detail page
                window.location.href = '/html/multisig-detail.html';
            });

            // Add Avatar cell
            const avatarTd = document.createElement('td');
            const avatarData = idAvatarMap.get(multisig.id);
            if (avatarData?.get('avatar')) {
                const img = document.createElement('img');
                img.src = `data:image/png;base64,${avatarData.get('avatar')}`;
                img.style.width = '40px';
                img.style.height = '40px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                avatarTd.appendChild(img);
            }
            tr.appendChild(avatarTd);

            // Add CID cell
            const cidTd = document.createElement('td');
            const cidData = idAvatarMap.get(multisig.id);
            if (cidData?.get('cid')) {
                const textSpan = document.createElement('span');
                textSpan.textContent = cidData.get('cid');
                cidTd.appendChild(textSpan);
                
                // Add click to copy functionality for CID
                cidTd.style.cursor = 'pointer';
                cidTd.title = 'Click to copy';
                cidTd.addEventListener('click', async (event) => {
                    try {
                        await navigator.clipboard.writeText(textSpan.textContent);
                        
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
                });
            }
            tr.appendChild(cidTd);
            
            headers.forEach(field => {
                const td = document.createElement('td');
                let value = multisig[field] ?? "";
                
                // Handle different field types
                if (timestampFields.includes(field)) {
                    if (value) {
                        const date = new Date(value * 1000);
                        const dateStr = date.toLocaleDateString(undefined, {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit'
                        }).replace(/\//g, '-');
                        const timeStr = date.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        });
                        
                        const textSpan = document.createElement('span');
                        textSpan.innerHTML = `${dateStr}<br>${timeStr}`;
                        td.appendChild(textSpan);
                    } else {
                        td.textContent = '';
                    }
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
                    // Add link color for id field
                    if (field === 'id') {
                        textSpan.style.color = 'var(--link-color)';  // Use CSS variable for link color
                    }
                    td.appendChild(textSpan);
                }
                
                // Add click to copy functionality for all fields
                td.style.cursor = 'pointer';
                td.title = field === 'id' ? 'Click to view CID details' : 'Click to copy';
                td.addEventListener('click', async (event) => {
                    // If clicking on text content
                    if (event.target.nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                        if (field === 'id') {
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
    const description = window.strings[currentLang]?.multisigDescription || '';
    
    const enDesc = document.querySelector('.description.en');
    const zhDesc = document.querySelector('.description.zh');
    
    if (enDesc) enDesc.textContent = window.strings.en.multisigDescription;
    if (zhDesc) zhDesc.textContent = window.strings.zh.multisigDescription;
    
    // Show/hide appropriate description based on language
    if (enDesc) enDesc.style.display = currentLang === 'en' ? 'inline-block' : 'none';
    if (zhDesc) zhDesc.style.display = currentLang === 'zh' ? 'inline-block' : 'none';
}

// Export functions for Header.js to use
window.MultisigList = {
    updateStrings: () => {
        const currentPageData = pageMultisigListMap.get(currentPage);
        if (currentPageData) {
            displayMultisigList(currentPageData);
            updatePaginationButtons();
        }
    }
}; 