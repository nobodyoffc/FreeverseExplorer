// Global variables for homepage
let currentPage = 1;
const itemsPerPage = 5;

// DOM elements for homepage
let sections = document.querySelectorAll('.section');
let tableBody = null;
let searchInput = null;
let sortSelect = null;
let prevBtn = null;
let nextBtn = null;
let pageInfo = null;

// Initialize homepage DOM elements
function initializeHomepageElements() {
    tableBody = document.getElementById('table-body');
    searchInput = document.getElementById('search-input');
    sortSelect = document.getElementById('sort-select');
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    pageInfo = document.getElementById('page-info');
}

// Initialize homepage functionality
function initializeHomepage() {
    // Initialize language strings
    initializeLanguageStrings();
    
    // Initialize language switcher
    initializeLanguageSwitcher();
    
    initializeHomepageElements();
    setupHomepageEventListeners();
    loadHomepageData();
}

// Initialize language strings
function initializeLanguageStrings() {
    if (!window.strings) {
        console.error('Strings not loaded');
        return;
    }

    // Get language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('preferredLanguage');
    // Only use system language if no saved preference exists
    const defaultLang = savedLang || (navigator.language.startsWith('zh') ? 'zh' : 'en');
    window.currentLanguage = defaultLang;
    
    // If no saved preference exists, save the default language
    if (!savedLang) {
        localStorage.setItem('preferredLanguage', defaultLang);
    }
    
    // Always update language strings on initial load to ensure cards are labeled correctly
    updateLanguageStrings(defaultLang);
}

// Initialize language switcher
function initializeLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    if (!langButtons.length) {
        console.error('Language switcher buttons not found');
        return;
    }

    // Set initial active state based on current language
    const currentLang = window.currentLanguage;
    langButtons.forEach(btn => {
        if (btn.id.includes(currentLang)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.id.includes('en') ? 'en' : 'zh';
            
            // Update active state for all buttons
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Save language preference to localStorage
            localStorage.setItem('preferredLanguage', lang);
            window.currentLanguage = lang;
            
            // Use the global language switching function
            if (typeof window.switchLanguage === 'function') {
                window.switchLanguage(lang);
            }
            
            // Update language strings
            updateLanguageStrings(lang);
            
            // Dispatch language change event
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { lang }
            }));
        });
    });
}

// Function to update homepage card labels
function updateHomepageCardLabels(strings) {
    // Use the global card configuration
    if (!window.HOMEPAGE_CARD_CONFIG) {
        console.error('HOMEPAGE_CARD_CONFIG not found');
        return;
    }

    // Helper function to safely update card labels
    const updateCards = (sectionIndex, keys) => {
        const cards = document.querySelectorAll(`#home .section-container:nth-child(${sectionIndex}) .stats-grid .stat-card h3`);
        cards.forEach((card, index) => {
            if (keys[index] && strings[keys[index]]) {
                card.textContent = strings[keys[index]];
            }
        });
    };

    // Update all sections using the configuration
    window.HOMEPAGE_CARD_CONFIG.forEach(config => {
        updateCards(config.section, config.keys);
    });
}

// Function to update language strings
function updateLanguageStrings(lang) {
    if (!window.strings || !window.strings[lang]) {
        console.error(`Language strings for ${lang} not found`);
        return;
    }

    const strings = window.strings[lang];

    // Update section titles
    document.getElementById('blockchain-title').textContent = strings.blockchain || '...';
    document.getElementById('identity-title').textContent = strings.identity || '...';
    document.getElementById('construct-title').textContent = strings.construct || '...';
    document.getElementById('organization-title').textContent = strings.organization || '...';
    document.getElementById('personal-title').textContent = strings.personal || '...';
    document.getElementById('publish-title').textContent = strings.publish || '...';
    document.getElementById('business-title').textContent = strings.business || '...';

    // Update all card labels directly (don't rely on Header being loaded)
    updateHomepageCardLabels(strings);

    // Update search placeholder
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = strings.searchPlaceholder || 'Search...';
    }

    // Update pagination text
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        pageInfo.textContent = getStringWithParams('pageOf', currentPage, totalPages);
    }
}

// Setup homepage event listeners
function setupHomepageEventListeners() {
    // Table controls
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changePage(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changePage(1));
    }
}

// Load homepage data
function loadHomepageData() {
    // Load TOTALS data from API to populate stat cards and table
    loadTotalsFromAPI()
        .then(data => {
            const totalsData = data && data.data ? data.data : data;
            if (totalsData) {
                // Update stat cards
                populateStatCards(totalsData);
                
                // Update table data
                currentData = Array.isArray(totalsData) ? totalsData : [];
                filteredData = [...currentData];
                renderTable();
                updatePagination();
            } else {
                console.warn('⚠️ Invalid TOTALS response format');
                populateStatCards({});
                currentData = [];
                filteredData = [];
                renderTable();
                updatePagination();
            }
        })
        .catch(error => {
            console.error('❌ Failed to load TOTALS data:', error);
            populateStatCards({});
            currentData = [];
            filteredData = [];
            renderTable();
            updatePagination();
            // Add retry mechanism
            setTimeout(() => {
                loadHomepageData();
            }, 5000); // Retry after 5 seconds
        });
}

/**
 * Load TOTALS data from API
 * @returns {Promise} - Promise that resolves with the TOTALS response data
 */
async function loadTotalsFromAPI() {
    try {
        const data = await window.API.apiGet(window.API.URL_TAIL.TOTALS);
        return data;
    } catch (error) {
        console.warn('⚠️ Failed to load TOTALS data from API:', error.message);
        throw error;
    }
}

/**
 * Populate stat cards with data from TOTALS API response
 * @param {Object} data - The data object from TOTALS API response
 */
function populateStatCards(data) {
    // Validate data structure
    if (!data || typeof data !== 'object') {
        console.error('Invalid data structure received:', data);
        return;
    }

    // Helper function to safely parse integer values
    const safeParseInt = (value) => {
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    try {
        // Main blockchain stats - map API values to correct cards
        const cashValue = safeParseInt(data.cash);
        const txValue = safeParseInt(data.tx);
        const opreturnValue = safeParseInt(data.opreturn);
        const blockValue = safeParseInt(data.block);

        // Update main blockchain stats with correct mapping
        updateElement('cash-value', cashValue);
        updateElement('tx-value', txValue);
        updateElement('opreturn-value', opreturnValue);
        updateElement('block-value', blockValue);

        // Identity stats
        updateElement('cid-value', safeParseInt(data.freer));
        updateElement('nobody-value', safeParseInt(data.nobody));
        updateElement('multisig-value', safeParseInt(data.multisig));
        updateElement('nid-value', safeParseInt(data.nid));

        // Construct stats
        updateElement('protocol-value', safeParseInt(data.protocol));
        updateElement('code-value', safeParseInt(data.code));
        updateElement('service-value', safeParseInt(data.service));
        updateElement('app-value', safeParseInt(data.app));

        // Organization stats
        updateElement('square-value', safeParseInt(data.square));
        updateElement('team-value', safeParseInt(data.team));

        // Personal stats
        updateElement('mail-value', safeParseInt(data.mail));
        updateElement('contact-value', safeParseInt(data.contact));
        updateElement('secret-value', safeParseInt(data.secret));
        updateElement('box-value', safeParseInt(data.box));

        // Publish stats
        updateElement('news-value', safeParseInt(data.news));
        updateElement('text-value', safeParseInt(data.text));
        updateElement('sound-value', safeParseInt(data.sound));
        updateElement('image-value', safeParseInt(data.image));
        updateElement('video-value', safeParseInt(data.video));
        updateElement('remark-value', safeParseInt(data.remark));

        // Business stats
        updateElement('statement-value', safeParseInt(data.statement));
        updateElement('proof-value', safeParseInt(data.proof));
        updateElement('token-value', safeParseInt(data.token));
        updateElement('tokenHolder-value', safeParseInt(data.token_holder));
    } catch (error) {
        console.error('❌ Error updating stat cards:', error);
    }
}

/**
 * Helper function to safely update element content
 * @param {string} elementId - The ID of the element to update
 * @param {string|number} value - The value to set
 */
function updateElement(elementId, value) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
        } else {
            console.warn(`Element with ID '${elementId}' not found`);
        }
    } catch (error) {
        console.error(`Error updating element ${elementId}:`, error);
    }
}

function renderTable() {
    if (!tableBody) {
        console.warn('Table body element not found, skipping table render');
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.value}</td>
            <td>${item.category}</td>
            <td>${item.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // Only update pagination if elements are available
    if (prevBtn && nextBtn && pageInfo) {
        updatePagination();
    }
}

function handleSearch() {
    const searchText = searchInput.value.toLowerCase();
    filteredData = currentData.filter(item => 
        item.name.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText) ||
        item.date.toLowerCase().includes(searchText)
    );
    
    currentPage = 1;
    renderTable();
    updatePagination();
}

function handleSort() {
    const sortValue = sortSelect.value;
    filteredData.sort((a, b) => {
        switch (sortValue) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'value-asc':
                return a.value - b.value;
            case 'value-desc':
                return b.value - a.value;
            default:
                return a.id - b.id;
        }
    });
    
    currentPage = 1;
    renderTable();
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
    }
}

function updatePagination() {
    if (!prevBtn || !nextBtn || !pageInfo) {
        console.warn('Pagination elements not found, skipping pagination update');
        return;
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    
    pageInfo.textContent = getStringWithParams('pageOf', currentPage, totalPages);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for strings to be loaded first
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Initialize API
    try {
        console.log('🔍 Starting API server testing...');
        
        // Test the first server and update urlHead if needed
        console.log(`📡 Testing server 1: ${window.API.SERVER_URL_HEADS[0]}`);
        const isFirstServerWorking = await window.API.testServer(window.API.SERVER_URL_HEADS[0]);
        console.log(`✅ Server 1 (${window.API.SERVER_URL_HEADS[0]}) test result: ${isFirstServerWorking}`);
        
        if (!isFirstServerWorking) {
            console.log('❌ First server failed, trying other servers...');
            // If first server fails, try others
            for (let i = 1; i < window.API.SERVER_URL_HEADS.length; i++) {
                console.log(`📡 Testing server ${i + 1}: ${window.API.SERVER_URL_HEADS[i]}`);
                const isWorking = await window.API.testServer(window.API.SERVER_URL_HEADS[i]);
                console.log(`✅ Server ${i + 1} test result: ${isWorking}`);
                if (isWorking) {
                    console.log(`🎯 Setting working server to: ${window.API.SERVER_URL_HEADS[i]}`);
                    window.API.urlHead = window.API.SERVER_URL_HEADS[i];
                    // Also set the working server URL head to the full base URL
                    window.API.resetWorkingServer(window.API.SERVER_URL_HEADS[i]);
                    break;
                }
            }
        } else {
            console.log(`🎯 Setting working server to: ${window.API.SERVER_URL_HEADS[0]}`);
            // If first server works, set it as the working server
            window.API.resetWorkingServer(window.API.SERVER_URL_HEADS[0]);
        }
        
        console.log(`🏁 Final working server: ${window.API.getWorkingServer()}`);
    } catch (error) {
        console.error('❌ Error initializing API:', error);
    }
    
    // Initialize homepage
    initializeHomepage();

    // Add periodic refresh for stats
    // setInterval(() => {
    //     loadHomepageData();
    // }, 300000); // Refresh every 5 minutes
    
    // Listen for language change event from other pages
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            window.currentLanguage = event.detail.lang;
            updateLanguageStrings(event.detail.lang);
            
            // Update active state of language buttons
            const langButtons = document.querySelectorAll('.lang-btn');
            langButtons.forEach(btn => {
                if (btn.id.includes(event.detail.lang)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Re-render the table if needed
            if (tableBody) {
                renderTable();
            }
            if (prevBtn && nextBtn && pageInfo) {
                updatePagination();
            }
        }
    });

    // Add visibility change listener to refresh data when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            loadHomepageData();
        }
    });
});

// Export homepage functions
window.Homepage = {
    initializeHomepage,
    // updateHomepageStrings
}; 