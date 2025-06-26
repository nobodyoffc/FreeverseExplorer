// Global constant array for server URL heads (base URLs) with fallback functionality
const SERVER_URL_HEADS = [
    'https://apip.cash/APIP',
    'http://127.0.0.1:8080/APIP',
    'https://help.cash/APIP',
    'https://cid.cash/APIP'
];

// Global urlHead variable
let urlHead = SERVER_URL_HEADS[0];

// URL tail constants for different API endpoints
const URL_TAIL = {
    // API version 1 endpoints
    TOTALS: '/v1/totals',
    PING: '/v1/ping',
    APP_SEARCH: '/sn7/v1/appSearch',
    APP_BY_IDS: '/sn7/v1/appByIds',
    BOX_SEARCH: '/sn10/v1/boxSearch',
    BOX_BY_IDS: '/sn10/v1/boxByIds',
    BOOK_SEARCH: '/sn24/v1/bookSearch',
    BOOK_BY_IDS: '/sn24/v1/bookByIds',
    CASH_SEARCH: '/sn2/v1/cashSearch',
    CASH_BY_IDS: '/sn2/v1/cashByIds',
    BLOCK_SEARCH: '/sn2/v1/blockSearch',
    BLOCK_BY_IDS: '/sn2/v1/blockByIds',
    TX_SEARCH: '/sn2/v1/txSearch',
    TX_BY_IDS: '/sn2/v1/txByIds',
    CID_SEARCH: '/sn3/v1/cidSearch',
    CID_INFO_BY_IDS: '/sn3/v1/cidInfoByIds',
    AVATARS: '/sn3/v1/avatars',
    CODE_SEARCH: '/sn5/v1/codeSearch',
    CODE_BY_IDS: '/sn5/v1/codeByIds',
    ESSAY_SEARCH: '/sn21/v1/essaySearch',
    ESSAY_BY_IDS: '/sn21/v1/essayByIds',
    GROUP_SEARCH: '/sn8/v1/groupSearch',
    GROUP_BY_IDS: '/sn8/v1/groupByIds',
    MAIL_SEARCH: '/sn13/v1/mailSearch',
    MAIL_BY_IDS: '/sn13/v1/mailByIds',
    MULTISIGN_SEARCH: '/sn2/v1/multisignSearch',
    MULTISIGN_BY_IDS: '/sn2/v1/multisignByIds',
    NOBODY_SEARCH: '/sn3/v1/nobodySearch',
    NOBODY_BY_IDS: '/sn3/v1/nobodyByIds',
    OPRETURN_SEARCH: '/sn2/v1/opReturnSearch',
    OPRETURN_BY_IDS: '/sn2/v1/opReturnByIds',
    PAPER_SEARCH: '/sn23/v1/paperSearch',
    PAPER_BY_IDS: '/sn23/v1/paperByIds',
    PROOF_SEARCH: '/sn14/v1/proofSearch',
    PROOF_BY_IDS: '/sn14/v1/proofByIds',
    PROTOCOL_SEARCH: '/sn4/v1/protocolSearch',
    PROTOCOL_BY_IDS: '/sn4/v1/protocolByIds',
    REPORT_SEARCH: '/sn22/v1/reportSearch',
    REPORT_BY_IDS: '/sn22/v1/reportByIds',
    REMARK_SEARCH: '/sn26/v1/remarkSearch',
    REMARK_BY_IDS: '/sn26/v1/remarkByIds',
    SECRET_SEARCH: '/sn12/v1/secretSearch',
    SECRET_BY_IDS: '/sn12/v1/secretByIds',
    SERVICE_SEARCH: '/sn6/v1/serviceSearch',
    SERVICE_BY_IDS: '/sn6/v1/serviceByIds',
    STATEMENT_SEARCH: '/sn15/v1/statementSearch',
    STATEMENT_BY_IDS: '/sn15/v1/statementByIds',
    TEAM_SEARCH: '/sn9/v1/teamSearch',
    TEAM_BY_IDS: '/sn9/v1/teamByIds',
    TOKEN_SEARCH: '/sn16/v1/tokenSearch',
    TOKEN_BY_IDS: '/sn16/v1/tokenByIds',
    TOKEN_HOLDER_SEARCH: '/sn16/v1/tokenHolderSearch',
    TOKEN_HOLDER_BY_IDS: '/sn16/v1/tokenHolderByIds',
    CONTACT_SEARCH: '/sn11/v1/contactSearch',
    CONTACT_DETAIL: '/sn11/v1/contactByIds',
    CHAIN_INFO: '/sn2/v1/chainInfo',

    ARTWORK_SEARCH: '/sn25/v1/artworkSearch',
    ARTWORK_BY_IDS: '/sn25/v1/artworkByIds',
    NID_SEARCH: '/sn19/v1/nidSearch',
    NID_BY_IDS: '/sn19/v1/nidByIds',
    CID_AVATAR_BY_IDS: '/sn3/v1/cidAvatarByIds',
    AVATARS: '/sn3/v1/avatars',
    FID_CID_SEEK: '/sn3/v1/fidCidSeek',
    BROADCAST_TX: '/sn18/v1/broadcastTx',
    DECODE_TX: '/sn18/v1/decodeTx',
    ADDRESSES: '/sn17/v1/addresses',
    ENCRYPT: '/sn17/v1/encrypt',
    VERIFY: '/sn17/v1/verify'
};

// API configuration
const API_CONFIG = {
    timeout: 5000, // 5 seconds timeout
    retryAttempts: 3,
    retryDelay: 1000 // 1 second delay between retries
};

// Track the working server URL head for optimization
let workingServerUrlHead = null;

/**
 * Sleep function for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after the delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make a single API request with timeout
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Promise that resolves with the response or rejects with error
 */
async function makeRequest(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Make a single API request with retries
 * @param {string} url - The full API URL
 * @param {Object} options - Fetch options
 * @returns {Promise} - Promise that resolves with the response data
 */
async function makeRequestWithRetries(url, options = {}) {
    for (let attempt = 1; attempt <= API_CONFIG.retryAttempts; attempt++) {
        try {
            const response = await makeRequest(url, options);
            const data = await response.json();
            return data;
        } catch (error) {
            if (attempt < API_CONFIG.retryAttempts) {
                await sleep(API_CONFIG.retryDelay);
            } else {
                throw error;
            }
        }
    }
}

/**
 * Make API request with server fallback support
 * @param {string} endpoint - The API endpoint path (e.g., '/v1/totals')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Promise that resolves with the response data or rejects with error
 */
async function apiRequest(endpoint, options = {}) {
    // First, try the working server if we have one
    if (workingServerUrlHead) {
        try {
            const fullUrl = `${workingServerUrlHead}${endpoint}`;
            const data = await makeRequestWithRetries(fullUrl, options);
            // Keep the working server URL head as the full base URL, not just the domain
            return data;
        } catch (error) {
            workingServerUrlHead = null;
        }
    }
    
    // Try each server URL
    for (const baseUrl of SERVER_URL_HEADS) {
        try {
            const fullUrl = `${baseUrl}${endpoint}`;
            const data = await makeRequestWithRetries(fullUrl, options);
            // Set workingServerUrlHead to the full base URL, not just the domain
            workingServerUrlHead = baseUrl;
            return data;
        } catch (error) {
            // Continue to next server
        }
    }
    
    throw new Error('All API endpoints failed');
}

/**
 * Convenience method for GET requests
 * @param {string} endpoint - The API endpoint path
 * @param {Object} headers - Optional headers
 * @returns {Promise} - Promise that resolves with the response data
 */
async function apiGet(endpoint, headers = {}) {
    return apiRequest(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}

/**
 * Convenience method for POST requests
 * @param {string} endpoint - The API endpoint path
 * @param {Object} data - Data to send in request body
 * @param {Object} headers - Optional headers
 * @returns {Promise} - Promise that resolves with the response data
 */
async function apiPost(endpoint, data = {}, headers = {}) {
    return apiRequest(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(data)
    });
}

/**
 * Convenience method for PUT requests
 * @param {string} endpoint - The API endpoint path
 * @param {Object} data - Data to send in request body
 * @param {Object} headers - Optional headers
 * @returns {Promise} - Promise that resolves with the response data
 */
async function apiPut(endpoint, data = {}, headers = {}) {
    return apiRequest(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(data)
    });
}

/**
 * Convenience method for DELETE requests
 * @param {string} endpoint - The API endpoint path
 * @param {Object} headers - Optional headers
 * @returns {Promise} - Promise that resolves with the response data
 */
async function apiDelete(endpoint, headers = {}) {
    return apiRequest(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}

/**
 * Load data from API
 * @param {string} endpoint - The API endpoint to fetch data from
 * @returns {Promise} - Promise that resolves with the data
 */
async function loadDataFromAPI(endpoint) {
    try {
        const data = await apiGet(endpoint);
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Get the current working server URL head
 * @returns {string|null} - The current working server URL head or null if none set
 */
function getWorkingServer() {
    return workingServerUrlHead;
}

/**
 * Reset the working server URL head (forces trying all servers on next request)
 * @param {string} newServer - Optional: Set a specific server as the working one
 */
function resetWorkingServer(newServer = null) {
    const oldServer = workingServerUrlHead;
    workingServerUrlHead = newServer;
}

/**
 * Check if a specific server is available
 * @param {string} serverUrlHead - The server URL head to test
 * @param {string} endpoint - The endpoint to test (default: /v1/totals)
 * @returns {Promise<boolean>} - Promise that resolves to true if server is available
 */
async function testServer(serverUrlHead, endpoint = URL_TAIL.PING) {
    try {
        const fullUrl = `${serverUrlHead}${endpoint}`;
        
        const response = await makeRequest(fullUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        await response.json(); // Try to parse JSON to ensure it's a valid response
        return true;
        
    } catch (error) {
        return false;
    }
}

// Export API functions
window.API = {
    SERVER_URL_HEADS,
    URL_TAIL,
    API_CONFIG,
    urlHead,
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    loadDataFromAPI,
    getWorkingServer,
    resetWorkingServer,
    testServer
}; 