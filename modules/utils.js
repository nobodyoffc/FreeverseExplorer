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
    // Load QR code library if not already loaded
    if (typeof QRCode === 'undefined') {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
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
    
    // Split bytes into chunks of 300 bytes
    const chunks = [];
    for (let i = 0; i < bytes.length; i += 300) {
        chunks.push(bytes.slice(i, i + 300));
    }
    
    let currentPage = 0;
    
    // Function to update QR code display
    const updateQRCode = () => {
        qrContainer.innerHTML = '';
        const qrDiv = document.createElement('div');
        qrDiv.style.width = '300px';
        qrDiv.style.height = '300px';
        qrContainer.appendChild(qrDiv);
        
        // Convert bytes to string using UTF-8
        const text = new TextDecoder().decode(chunks[currentPage]);
        
        // Create QR code
        new QRCode(qrDiv, {
            text: text,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.L
        });
        
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

// Initialize Utils in global scope
if (typeof window !== 'undefined') {
    window.Utils = {
        dismissKeyboard,
        handleApiResponse,
        showToast,
        showAsQrCodes,
        escapeHtmlEntities,
        decodeHtmlEntities
    };
}

// Export for ES modules
export {
    dismissKeyboard,
    handleApiResponse,
    showToast,
    showAsQrCodes,
    escapeHtmlEntities,
    decodeHtmlEntities
}; 