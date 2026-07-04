// Cache for the current best block height (used by CoinDay/CDD calculations).
let cachedBestHeight = null;

/**
 * Fetch the current best block height from the chain info endpoint.
 * The value is cached so synchronous callers (e.g. CD summaries) can reuse the
 * last-known height without re-fetching. Returns the cached value on failure.
 * @returns {Promise<number|null>} the current best block height, or null if unavailable
 */
async function getBestHeight() {
    try {
        const data = await window.API.apiGet(window.API.URL_TAIL.CHAIN_INFO);
        if (data?.code === 0 && data?.data?.height != null) {
            cachedBestHeight = parseInt(data.data.height);
        }
    } catch (error) {
        console.error('Error fetching best block height:', error);
    }
    return cachedBestHeight;
}

/**
 * Get the last-known best block height synchronously (may be null if never fetched).
 * @returns {number|null}
 */
function getCachedBestHeight() {
    return cachedBestHeight;
}

/**
 * Dismiss keyboard when clicking outside input elements
 */
function dismissKeyboard() {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
        activeElement.blur();
    }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('error', 'success', 'info', etc.)
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Add to container
    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

/**
 * Handle API response with proper error handling and toast notifications
 * @param {Response} response - The fetch Response object
 * @param {Function} displayFunction - Optional function to display results
 * @param {Object} displayParams - Optional parameters for display function
 * @returns {Promise<Object>} - The parsed JSON data if successful
 * @throws {Error} - If there's an error in processing the response
 */
async function handleApiResponse(response, displayFunction = null, displayParams = {}) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is JSON and not empty
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        // Show non-JSON response in toast
        showToast(text, 'error');
        return null;
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Empty response');
    }

    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error('Invalid JSON response');
    }

    // Check response code
    if (data.code !== 0) {
        // Get current language
        const currentLang = window.currentLanguage || 'en';
        
        // Get error message from strings.js
        const errorMessage = window.strings[currentLang]?.codeMessage?.[`code${data.code}`] || 
                           window.strings['en']?.codeMessage?.[`code${data.code}`] || 
                           'Unknown error';
        
        // Show error in toast with code and localized message
        const toastMessage = `Code${data.code}: ${errorMessage}`;
        showToast(toastMessage, 'error');

        // If display function is provided, call it with empty data
        if (displayFunction) {
            displayFunction([], displayParams);
        }
        return null;
    }

    // If display function is provided and data exists, call it with the data
    if (displayFunction && data.data) {
        displayFunction(data.data, displayParams);
    }

    return data;
}

/**
 * Show bytes as QR codes in a modal dialog
 * @param {Uint8Array} bytes - The bytes to display as QR codes
 */
async function showAsQrCodes(bytes) {
    // Load QR code library if not already loaded.
    // qrcodejs 1.0.0 has a bug: the array `b` used for UTF-8 byte sequences
    // is never reset between loop iterations, so after the first multi-byte
    // character, all subsequent ASCII chars append stale extra bytes, causing
    // "code length overflow" errors. We patch the source to add `b=[]` at the
    // start of each iteration before loading.
    if (typeof QRCode === 'undefined') {
        await new Promise(async (resolve, reject) => {
            try {
                const res = await fetch('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js');
                let src = await res.text();
                // Fix 1: Reset byte array `b` each iteration to prevent stale bytes
                src = src.replace(
                    'e>d;d++){var f=this.data.charCodeAt(d)',
                    'e>d;d++){b=[];var f=this.data.charCodeAt(d)'
                );
                // Fix 2: Remove spurious UTF-8 BOM prepended to multi-byte data
                src = src.replace(
                    'this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))',
                    'this.parsedData.length!=this.data.length&&void 0'
                );
                const blob = new Blob([src], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => { URL.revokeObjectURL(url); resolve(); };
                script.onerror = reject;
                document.head.appendChild(script);
            } catch (e) {
                // Fallback: load unpatched version
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            }
        });
    }

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'qr-modal-content';
    
    // Create QR code container
    const qrContainer = document.createElement('div');
    qrContainer.className = 'qr-container';
    
    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'qr-nav-btn prev-btn';
    prevBtn.innerHTML = '&lt;';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'qr-nav-btn next-btn';
    nextBtn.innerHTML = '&gt;';
    
    // Create page indicator
    const pageIndicator = document.createElement('div');
    pageIndicator.className = 'qr-page-indicator';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'qr-close-btn';
    closeBtn.textContent = window.currentLanguage === 'en' ? 'OK' : '返回';
    
    // Chunk the text string by character, keeping each chunk's UTF-8 byte size
    // under the limit. This lets qrcodejs handle encoding natively, avoiding the
    // double-encoding issue where Latin-1 chars > 127 get re-expanded to UTF-8.
    const MAX_CHUNK_BYTES = 300;
    const text = new TextDecoder().decode(bytes);
    const encoder = new TextEncoder();
    const chunks = [];
    let current = '';
    let currentBytes = 0;
    for (const char of text) {
        const charBytes = encoder.encode(char).length;
        if (currentBytes + charBytes > MAX_CHUNK_BYTES && current.length > 0) {
            chunks.push(current);
            current = char;
            currentBytes = charBytes;
        } else {
            current += char;
            currentBytes += charBytes;
        }
    }
    if (current) chunks.push(current);

    let currentPage = 0;

    // Function to update QR code display
    const updateQRCode = () => {
        qrContainer.innerHTML = '';
        const qrDiv = document.createElement('div');
        qrDiv.style.width = '300px';
        qrDiv.style.height = '300px';
        qrContainer.appendChild(qrDiv);

        try {
            new QRCode(qrDiv, {
                text: chunks[currentPage],
                width: 300,
                height: 300,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.L
            });
        } catch (e) {
            console.error('QR generation failed:', e);
        }
        
        pageIndicator.textContent = `${currentPage + 1}/${chunks.length}`;
        
        // Update button states
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === chunks.length - 1;
    };
    
    // Add event listeners
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateQRCode();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < chunks.length - 1) {
            currentPage++;
            updateQRCode();
        }
    });
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Add touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    qrContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    qrContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left
            if (currentPage < chunks.length - 1) {
                currentPage++;
                updateQRCode();
            }
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            if (currentPage > 0) {
                currentPage--;
                updateQRCode();
            }
        }
    };
    
    // Assemble modal
    modalContent.appendChild(qrContainer);
    modalContent.appendChild(prevBtn);
    modalContent.appendChild(nextBtn);
    modalContent.appendChild(pageIndicator);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    
    // Add to document and show first QR code
    document.body.appendChild(modal);
    updateQRCode();
}

/**
 * Escape HTML entities for safe use in HTML attributes
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text
 */
function escapeHtmlEntities(text) {
    if (typeof text !== 'string') {
        text = String(text);
    }
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Decode HTML entities back to original characters
 * @param {string} text - The text to decode
 * @returns {string} - The decoded text
 */
function decodeHtmlEntities(text) {
    if (typeof text !== 'string') {
        text = String(text);
    }
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

/**
 * Show a success notification at a specific button position
 * @param {HTMLElement} buttonElement - The button element to show notification above
 * @param {string} message - The success message to display (optional, will use default based on language)
 * @param {number} duration - Duration in milliseconds (default: 2000)
 */
function showSuccessNotification(buttonElement, message = null, duration = 2000) {
    if (!buttonElement) return;
    
    const rect = buttonElement.getBoundingClientRect();
    
    const successMessage = document.createElement('div');
    successMessage.style.position = 'fixed';
    successMessage.style.left = `${rect.left + rect.width / 2}px`;
    successMessage.style.top = `${rect.top - 30}px`;
    successMessage.style.transform = 'translateX(-50%)';
    successMessage.style.padding = '4px 8px';
    successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.9)'; // Green background
    successMessage.style.color = 'white';
    successMessage.style.borderRadius = '4px';
    successMessage.style.zIndex = '1000';
    successMessage.style.fontSize = '12px';
    successMessage.style.pointerEvents = 'none';
    successMessage.style.fontWeight = 'bold';
    
    // Set message text based on current language if not provided
    if (!message) {
        const currentLang = window.currentLanguage || 'en';
        message = currentLang === 'zh' ? '成功' : 'Success';
    }
    successMessage.textContent = message;
    
    document.body.appendChild(successMessage);
    
    // Remove message after duration
    setTimeout(() => {
        successMessage.remove();
    }, duration);
}

// Global avatar cache manager
class AvatarCacheManager {
    constructor() {
        this.avatarCache = new Map();
        this.avatarCacheTimestamp = null;
        this.AVATAR_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
    }

    // Check if cache is still valid
    isCacheValid() {
        if (!this.avatarCacheTimestamp) return false;
        return (Date.now() - this.avatarCacheTimestamp) < this.AVATAR_CACHE_DURATION;
    }

    // Get cached avatar
    getCachedAvatar(id) {
        if (this.isCacheValid() && this.avatarCache.has(id)) {
            return this.avatarCache.get(id);
        }
        return null;
    }

    // Get multiple cached avatars
    getCachedAvatars(ids) {
        if (!ids || ids.length === 0) return {};
        
        const cachedAvatars = {};
        ids.forEach(id => {
            const cachedAvatar = this.getCachedAvatar(id);
            if (cachedAvatar !== null) {
                cachedAvatars[id] = cachedAvatar;
            }
        });
        return cachedAvatars;
    }

    // Set cached avatar
    setCachedAvatar(id, avatar) {
        this.avatarCache.set(id, avatar);
        this.avatarCacheTimestamp = Date.now();
    }

    // Clear cache
    clearCache() {
        this.avatarCache.clear();
        this.avatarCacheTimestamp = null;
    }

    // Fetch avatar with cache support
    async fetchAvatar(id) {
        // Check cache first
        const cachedAvatar = this.getCachedAvatar(id);
        if (cachedAvatar !== null) {
            return cachedAvatar;
        }

        // Fetch from API if not cached
        try {
            const url = `${window.API.urlHead}${window.API.URL_TAIL.AVATARS}?ids=${id}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data?.data && data.data[id]) {
                const avatar = data.data[id];
                this.setCachedAvatar(id, avatar);
                return avatar;
            }
            return null;
        } catch (error) {
            console.error('Error fetching avatar:', error);
            return null;
        }
    }

    // Fetch multiple avatars with cache support
    async fetchAvatars(ids) {
        if (!ids || ids.length === 0) return {};

        // Check cache first
        const cachedAvatars = {};
        const missingIds = [];
        
        ids.forEach(id => {
            const cachedAvatar = this.getCachedAvatar(id);
            if (cachedAvatar !== null) {
                cachedAvatars[id] = cachedAvatar;
            } else {
                missingIds.push(id);
            }
        });

        // If all avatars are cached, return them
        if (missingIds.length === 0) {
            return cachedAvatars;
        }

        // Fetch missing avatars
        try {
            const url = `${window.API.urlHead}${window.API.URL_TAIL.AVATARS}?ids=${missingIds.join(',')}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data?.data) {
                // Cache and return all avatars
                Object.entries(data.data).forEach(([id, avatar]) => {
                    this.setCachedAvatar(id, avatar);
                    cachedAvatars[id] = avatar;
                });
            }
        } catch (error) {
            console.error('Error fetching avatars:', error);
        }

        return cachedAvatars;
    }

    // Fetch CID avatars with cache support (for cash and multisig lists)
    async fetchCidAvatars(owners) {
        if (!owners || owners.length === 0) return new Map();

        // Check cache first
        const cachedAvatars = new Map();
        const missingOwners = [];
        
        owners.forEach(owner => {
            const cachedAvatar = this.getCachedAvatar(owner);
            if (cachedAvatar !== null) {
                cachedAvatars.set(owner, cachedAvatar);
            } else {
                missingOwners.push(owner);
            }
        });

        // If all avatars are cached, return them
        if (missingOwners.length === 0) {
            return cachedAvatars;
        }

        // Fetch missing avatars
        try {
            const url = `${window.API.urlHead}${window.API.URL_TAIL.CID_AVATAR_BY_IDS}?ids=${missingOwners.join(',')}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data?.data) {
                // Cache and return all avatars
                Object.entries(data.data).forEach(([owner, innerMap]) => {
                    const avatarMap = new Map(Object.entries(innerMap));
                    this.setCachedAvatar(owner, avatarMap);
                    cachedAvatars.set(owner, avatarMap);
                });
            }
        } catch (error) {
            console.error('Error fetching CID avatars:', error);
        }

        return cachedAvatars;
    }
}

// Create global avatar cache manager instance
window.avatarCacheManager = new AvatarCacheManager();

// Initialize Utils in global scope
if (typeof window !== 'undefined') {
    window.Utils = {
        dismissKeyboard,
        handleApiResponse,
        showToast,
        showAsQrCodes,
        escapeHtmlEntities,
        decodeHtmlEntities,
        showSuccessNotification
    };
}

// Export for ES modules
export {
    dismissKeyboard,
    handleApiResponse,
    showToast,
    showAsQrCodes,
    escapeHtmlEntities,
    decodeHtmlEntities,
    showSuccessNotification,
    getBestHeight,
    getCachedBestHeight
};