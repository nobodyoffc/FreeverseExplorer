// Global constant array for server URL heads (base URLs) with fallback functionality.
// Tried in order. To run this explorer against your own ApipServer, replace these
// with its base URL, e.g. 'https://your.domain/APIP'.
const SERVER_URL_HEADS = [
    // 'http://127.0.0.1:8081/APIP',
	'https://freecash.info/APIP',
	// 'https://info.freecash.org/APIP',
    'https://cid.cash/APIP'
];

// Global urlHead variable - load from localStorage if available
let urlHead = localStorage.getItem('workingServerUrlHead') || SERVER_URL_HEADS[0];

// URL tail constants for different API endpoints
const URL_TAIL = {
    // API version 1 endpoints
    TOTALS: '/totals/v1',
    PING: '/ping/v1',
    APP_SEARCH: '/sn7/appSearch/v1',
    APP_BY_IDS: '/sn7/appByIds/v1',
    BOX_SEARCH: '/sn10/boxSearch/v1',
    BOX_BY_IDS: '/sn10/boxByIds/v1',
    CASH_SEARCH: '/sn2/cashSearch/v1',
    CASH_BY_IDS: '/sn2/cashByIds/v1',
    BLOCK_SEARCH: '/sn2/blockSearch/v1',
    BLOCK_BY_IDS: '/sn2/blockByIds/v1',
    TX_SEARCH: '/sn2/txSearch/v1',
    TX_BY_IDS: '/sn2/txByIds/v1',
    FREER_SEARCH: '/sn3/freerSearch/v1',
    FREER_BY_IDS: '/sn3/freerByIds/v1',
    AVATARS: '/sn3/avatars/v1',
    CODE_SEARCH: '/sn5/codeSearch/v1',
    CODE_BY_IDS: '/sn5/codeByIds/v1',
    SQUARE_SEARCH: '/sn8/squareSearch/v1',
    SQUARE_BY_IDS: '/sn8/squareByIds/v1',
    MAIL_SEARCH: '/sn13/mailSearch/v1',
    MAIL_BY_IDS: '/sn13/mailByIds/v1',
    MULTISIG_SEARCH: '/sn2/multisigSearch/v1',
    MULTISIG_BY_IDS: '/sn2/multisigByIds/v1',
    NOBODY_SEARCH: '/sn3/nobodySearch/v1',
    NOBODY_BY_IDS: '/sn3/nobodyByIds/v1',
    OPRETURN_SEARCH: '/sn2/opReturnSearch/v1',
    OPRETURN_BY_IDS: '/sn2/opReturnByIds/v1',

    PROOF_SEARCH: '/sn14/proofSearch/v1',
    PROOF_BY_IDS: '/sn14/proofByIds/v1',
    PROTOCOL_SEARCH: '/sn4/protocolSearch/v1',
    PROTOCOL_BY_IDS: '/sn4/protocolByIds/v1',

    NEWS_SEARCH: '/sn21/newsSearch/v1',
    NEWS_BY_IDS: '/sn21/newsByIds/v1',
    
    TEXT_SEARCH: '/sn22/textSearch/v1',
    TEXT_BY_IDS: '/sn22/textByIds/v1',
    REMARK_SEARCH: '/sn23/remarkSearch/v1',
    REMARK_BY_IDS: '/sn23/remarkByIds/v1',
    SOUND_SEARCH: '/sn24/soundSearch/v1',
    SOUND_BY_IDS: '/sn24/soundByIds/v1',
    IMAGE_SEARCH: '/sn25/imageSearch/v1',
    IMAGE_BY_IDS: '/sn25/imageByIds/v1',
    VIDEO_SEARCH: '/sn26/videoSearch/v1',
    VIDEO_BY_IDS: '/sn26/videoByIds/v1',

    SECRET_SEARCH: '/sn12/secretSearch/v1',
    SECRET_BY_IDS: '/sn12/secretByIds/v1',
    SERVICE_SEARCH: '/sn6/serviceSearch/v1',
    SERVICE_BY_IDS: '/sn6/serviceByIds/v1',
    STATEMENT_SEARCH: '/sn15/statementSearch/v1',
    STATEMENT_BY_IDS: '/sn15/statementByIds/v1',
    TEAM_SEARCH: '/sn9/teamSearch/v1',
    TEAM_BY_IDS: '/sn9/teamByIds/v1',
    TOKEN_SEARCH: '/sn16/tokenSearch/v1',
    TOKEN_BY_IDS: '/sn16/tokenByIds/v1',
    TOKEN_HOLDER_SEARCH: '/sn16/tokenHolderSearch/v1',
    TOKEN_HOLDER_BY_IDS: '/sn16/tokenHolderByIds/v1',
    CONTACT_SEARCH: '/sn11/contactSearch/v1',
    CONTACT_DETAIL: '/sn11/contactByIds/v1',
    CHAIN_INFO: '/sn2/chainInfo/v1',

    NID_SEARCH: '/sn19/nidSearch/v1',
    NID_BY_IDS: '/sn19/nidByIds/v1',
    CID_AVATAR_BY_IDS: '/sn3/cidAvatarByIds/v1',
    FID_CID_SEEK: '/sn3/fidCidSeek/v1',
    BROADCAST_TX: '/sn18/broadcastTx/v1',
    DECODE_TX: '/sn18/decodeTx/v1',
    ADDRESSES: '/sn17/addresses/v1',
    ENCRYPT: '/sn17/encrypt/v1',
    VERIFY: '/sn17/verify',
    NODE_LIST: '/nodeList'
};

// API configuration
const API_CONFIG = {
    timeout: 5000, // 5 seconds timeout
    retryAttempts: 3,
    retryDelay: 1000 // 1 second delay between retries
};

// Track the working server URL head for optimization - load from localStorage if available
let workingServerUrlHead = localStorage.getItem('workingServerUrlHead') || null;

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
            return await response.json();
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
            // Persist to localStorage so it survives page navigations
            localStorage.setItem('workingServerUrlHead', baseUrl);
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
    // Persist to localStorage so it survives page navigations
    if (newServer) {
        localStorage.setItem('workingServerUrlHead', newServer);
    } else {
        localStorage.removeItem('workingServerUrlHead');
    }
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
        console.log(`🔍 Testing URL: ${fullUrl}`);
        
        const response = await makeRequest(fullUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        await response.json(); // Try to parse JSON to ensure it's a valid response
        console.log(`✅ Server ${serverUrlHead} is working`);
        return true;
        
    } catch (error) {
        console.log(`❌ Server ${serverUrlHead} failed: ${error.message}`);
        return false;
    }
}

// Export API functions
window.API = {
    SERVER_URL_HEADS,
    URL_TAIL,
    API_CONFIG,
    // Use getter to always return the current value (either from workingServerUrlHead or urlHead)
    get urlHead() {
        return workingServerUrlHead || urlHead;
    },
    // Allow setting urlHead which also persists to localStorage
    set urlHead(value) {
        urlHead = value;
        workingServerUrlHead = value;
        if (value) {
            localStorage.setItem('workingServerUrlHead', value);
        }
    },
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    loadDataFromAPI,
    getWorkingServer,
    resetWorkingServer,
    testServer
}; 