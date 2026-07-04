// Import constants
import { PAGE_SIZE, TEXT_TRUNCATE_LENGTH } from '../constants/constants.js';
import Cid from '../entity/Cid.js';
import './utils.js';
import { getSearchConfig } from './search-config.js';

// Get the URL head from global API
// Use a getter function to always get the current working server URL
const getUrlHead = () => window.API.urlHead;
let loadingOverlay;
let currentPage = 1;
let pageSize = PAGE_SIZE;
let pageCidListMap = new Map();
let lastValues = null;
let currentSearchString = '';
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

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
    
    // Flag to prevent duplicate language change handling
    let languageChangeHandled = false;

    // Set page title
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].freer;
    document.title = `${headerTitle} - ${pageTitle}`;

    // Check if API.urlHead is available
    if (!getUrlHead()) {
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
    
    // Check if this is a page refresh or navigation
    const isPageRefresh = performance.navigation.type === 1 || 
                         (performance.getEntriesByType('navigation')[0] && 
                          performance.getEntriesByType('navigation')[0].type === 'reload');
    
    // Check for search parameter in URL (from homepage)
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
        currentSearchString = searchParam;
        // Set the search input value
        const desktopSearchInput = document.getElementById('desktop-search-input');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        if (desktopSearchInput) desktopSearchInput.value = searchParam;
        if (mobileSearchInput) mobileSearchInput.value = searchParam;
        
        // Check if we have cached data for this search
        if (!isPageRefresh && pageCidListMap.has(1) && isCacheValid()) {
            // Use cached data if available, not a page refresh, and cache is still valid
            const currentPageData = pageCidListMap.get(currentPage);
            if (currentPageData) {
                displayCidList(currentPageData);
                updatePaginationButtons();
                return;
            }
        }
        
        // Load new data (either no cache or page refresh)
        const config = getSearchConfig();
        pageCidListMap.clear();
        lastValues = null;
        currentPage = 1;
        // Clear avatar cache on page refresh
        if (isPageRefresh) {
            avatarCache.clear();
            avatarCacheTimestamp = null;
        }
        loadCidList(1, false, {
            searchString: searchParam,
            searchableFields: config.searchableFields
        });
    } else {
        // Check if we have cached data for default list
        if (!isPageRefresh && pageCidListMap.has(1) && isCacheValid()) {
            // Use cached data if available, not a page refresh, and cache is still valid
            const currentPageData = pageCidListMap.get(currentPage);
            if (currentPageData) {
                displayCidList(currentPageData);
                updatePaginationButtons();
                return;
            }
        }
        
        // Load new data (either no cache or page refresh)
        // Clear avatar cache on page refresh
        if (isPageRefresh) {
            avatarCache.clear();
            avatarCacheTimestamp = null;
        }
        loadCidList();
    }

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang && !languageChangeHandled) {
            languageChangeHandled = true;
            // Update description
            updateDescription();
            // Re-render the table with new field names (skip avatar fetch for faster rendering)
            const currentPageData = pageCidListMap.get(currentPage);
            if (currentPageData) {
                displayCidList(currentPageData, true);
                // Update pagination when language changes
                updatePaginationButtons();
            }
            // Reset flag after a short delay to allow future language changes
            setTimeout(() => {
                languageChangeHandled = false;
            }, 100);
        }
    });

    // Add page visibility change listener to handle back navigation
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && pageCidListMap.has(currentPage) && isCacheValid()) {
            // Page became visible and we have valid cached data, just display it
            // Skip avatar fetch for faster mobile back navigation
            const currentPageData = pageCidListMap.get(currentPage);
            if (currentPageData) {
                displayCidList(currentPageData, true);
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

// Check if cache is still valid
function isCacheValid() {
    // For CID list, we consider cache valid if we have data, even without timestamp
    // This ensures mobile back navigation works properly
    if (!cacheTimestamp) {
        // If no timestamp but we have cached data, consider it valid
        return pageCidListMap.has(currentPage);
    }
    return (Date.now() - cacheTimestamp) < CACHE_DURATION;
}

// Check if avatar cache is still valid
function isAvatarCacheValid() {
    if (!avatarCacheTimestamp) return false;
    return (Date.now() - avatarCacheTimestamp) < AVATAR_CACHE_DURATION;
}

// Load CID list
async function loadCidList(page = 1, useCache = true, config = null) {
    try {
        // Check if we have cached data for this page
        if (useCache && pageCidListMap.has(page) && isCacheValid()) {
            await displayCidList(pageCidListMap.get(page));
            updatePaginationButtons();
            return;
        }

        loadingOverlay.show();
        loadingOverlay.setText('Loading CID list...');
        
        let url = `${getUrlHead()}${window.API.URL_TAIL.FREER_SEARCH}?`;
        
        if (config && config.searchString) {
            url += `part=${config.searchableFields.join(',')},${encodeURIComponent(config.searchString)}&`;
        } else {
            url += `range=birthHeight,gt,0&`;
        }
        
        url += `sort=lastHeight,desc,id,asc&size=${pageSize}`;
        
        // Add after parameter if not first page
        if (page > 1 && lastValues) {
            url += `&after=${lastValues.join(',')}`;
        }
        
        const response = await fetch(url);
        const data = await window.Utils.handleApiResponse(response, null, { page }); // Pass null as displayFunction
        
        if (data?.data) {
            // Save the CID list to our map
            pageCidListMap.set(page, data.data);
            
            // Update cache timestamp
            cacheTimestamp = Date.now();
            
            // Update last values for next page
            if (data.last) {
                lastValues = data.last;
            }
            
            // Display the data
            await displayCidList(data.data);
            
            // Update pagination buttons
            updatePaginationButtons();
        }
    } catch (error) {
        // Handle error silently
        console.error('Error loading CID list:', error);
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
    
    // Always clear cache and load fresh data for any search
    pageCidListMap.clear();
    lastValues = null;
    currentPage = 1;
    currentSearchString = searchString;
    // Keep avatar cache as avatars don't change with search
    // Only clear avatar cache on page refresh or when explicitly needed
    
    // Load new data with search configuration
    loadCidList(1, false, {
        searchString,
        searchableFields: config.searchableFields
    });
}

// Handle previous page
function handlePreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadCidList(currentPage, true);
    }
}

function handleNextPage() {
    currentPage++;
    const config = getSearchConfig();
    loadCidList(currentPage, true, {
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
        const currentPageData = pageCidListMap.get(currentPage);
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
async function fetchCidAvatars(ids) {
    if (window.avatarCacheManager) {
        return await window.avatarCacheManager.fetchAvatars(ids);
    }
    
    // Fallback to local cache if global cache manager is not available
    try {
        // Check if we have cached avatars for these IDs
        if (isAvatarCacheValid()) {
            const cachedAvatars = {};
            const missingIds = [];
            
            // Check which IDs we have cached
            ids.forEach(id => {
                if (avatarCache.has(id)) {
                    cachedAvatars[id] = avatarCache.get(id);
                } else {
                    missingIds.push(id);
                }
            });
            
            // If we have all avatars cached, return them
            if (missingIds.length === 0) {
                return cachedAvatars;
            }
            
            // If we have some cached, only fetch the missing ones
            if (missingIds.length > 0) {
                const url = `${getUrlHead()}${window.API.URL_TAIL.AVATARS}?ids=${missingIds.join(',')}`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data?.data) {
                    // Cache the new avatars
                    Object.entries(data.data).forEach(([id, avatar]) => {
                        avatarCache.set(id, avatar);
                    });
                    avatarCacheTimestamp = Date.now();
                    
                    // Return combined cached and new avatars
                    return { ...cachedAvatars, ...data.data };
                }
            }
        }
        
        // If no cache or cache invalid, fetch all avatars
        const url = `${getUrlHead()}${window.API.URL_TAIL.AVATARS}?ids=${ids.join(',')}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data?.data) {
            // Cache all avatars
            Object.entries(data.data).forEach(([id, avatar]) => {
                avatarCache.set(id, avatar);
            });
            avatarCacheTimestamp = Date.now();
            return data.data;
        }
        return {};
    } catch (error) {
        return {};
    }
}

// Display CID list
async function displayCidList(cidList, skipAvatarFetch = false) {
    const tableHeader = document.getElementById('cid-table-header');
    const tableBody = document.getElementById('cid-table-body');
    
    // Clear existing content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Get field width map and show field name map
    const fieldWidthMap = Cid.getFieldWidthMap();
    const showFieldNameMap = Cid.getShowFieldNameAsMap();
    const headers = Object.keys(fieldWidthMap);
    const currentLang = window.currentLanguage || 'en';
    
    // Add Avatar header first (empty text to hide label)
    const avatarTh = document.createElement('th');
    avatarTh.style.width = '40px';
    avatarTh.textContent = '';  // Empty text for Avatar header
    tableHeader.appendChild(avatarTh);
    
    // Always create table headers
    headers.forEach(field => {
        const th = document.createElement('th');
        th.style.width = `${fieldWidthMap[field]}px`;
        let fieldName;
        if (field === 'id') {
            fieldName = 'FID';
        } else {
            fieldName = window.strings[currentLang]?.fieldNames?.[field] ||
                      showFieldNameMap[field] ||
                      field.replace(/([A-Z])/g, ' $1').trim();
        }
        th.textContent = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        tableHeader.appendChild(th);
    });
    
    // Only create table body if cidList exists and has items
    if (cidList && cidList.length > 0) {
        const timestampFields = Cid.getTimestampFieldList();
        const satoshiFields = Cid.getSatoshiFieldList();
        
        // Fetch CID avatars for all IDs (skip if requested)
        let cidAvatarMap = {};
        if (!skipAvatarFetch) {
            const ids = [...new Set(cidList.map(cid => cid.id).filter(Boolean))];
            cidAvatarMap = await fetchCidAvatars(ids);
        } else {
            // When skipping avatar fetch, try to get avatars from global cache
            if (window.avatarCacheManager) {
                const ids = [...new Set(cidList.map(cid => cid.id).filter(Boolean))];
                cidAvatarMap = await window.avatarCacheManager.getCachedAvatars(ids);
            }
        }
        
        cidList.forEach(cid => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            
            // Add click handler for the entire row
            tr.addEventListener('click', (event) => {
                // If clicking on text content, only copy and don't navigate
                if (event.target.nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                    return;
                }
                
                // Store the CID data in sessionStorage with avatar
                const cidData = {
                    ...cid,
                    avatar: cidAvatarMap[cid.id]
                };
                sessionStorage.setItem('cidDetail', JSON.stringify(cidData));
                
                // Navigate to CID detail page
                window.location.href = '/html/cid-detail.html';
            });

            // Add Avatar cell
            const avatarTd = document.createElement('td');
            const avatarData = cidAvatarMap[cid.id];
            if (avatarData) {  // Check if avatar data exists
                const img = document.createElement('img');
                img.src = `data:image/png;base64,${avatarData}`;  // Use avatar data directly
                img.style.width = '40px';
                img.style.height = '40px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                avatarTd.appendChild(img);
            }
            tr.appendChild(avatarTd);
            
            headers.forEach(field => {
                const td = document.createElement('td');
                let value = cid[field] ?? "";
                
                // Handle different field types
                if (timestampFields.includes(field)) {
                    const textSpan = document.createElement('span');
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
                    // Add link color for owner and cash fields
                    if ( field === 'cash') {
                        textSpan.style.color = 'var(--link-color)';  // Use CSS variable for link color
                    }
                    td.appendChild(textSpan);
                }
                
                // Add click functionality for all fields
                td.style.cursor = 'pointer';
                let titleText = 'Click to copy';
                if (field === 'cash') {
                    titleText = 'Click to view My Cash';
                }
                td.title = titleText;
                td.addEventListener('click', async (event) => {
                    // If clicking on text content
                    if (event.target.nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                        if (field === 'cash') {
                            // Navigate to My Cash page with the CID's id as fid parameter
                            window.location.href = `/html/myCash.html?fid=${cid.id}`;
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
    const description = window.strings[currentLang]?.cidDescription || '';
    
    const enDesc = document.querySelector('.description.en');
    const zhDesc = document.querySelector('.description.zh');
    
    if (enDesc) enDesc.textContent = window.strings.en.cidDescription;
    if (zhDesc) zhDesc.textContent = window.strings.zh.cidDescription;
    
    // Show/hide appropriate description based on language
    if (enDesc) enDesc.style.display = currentLang === 'en' ? 'inline-block' : 'none';
    if (zhDesc) zhDesc.style.display = currentLang === 'zh' ? 'inline-block' : 'none';
}

// Export functions for Header.js to use
window.CidList = {
    updateStrings: async () => {
        const currentPageData = pageCidListMap.get(currentPage);
        if (currentPageData) {
            await displayCidList(currentPageData);
            updatePaginationButtons();
        }
    }
}; 