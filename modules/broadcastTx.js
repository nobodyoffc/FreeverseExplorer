// Import required modules
import { escapeHtmlEntities, decodeHtmlEntities } from './utils.js';
import '../modules/api.js';  // Import API module

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for strings to be loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Ensure API is initialized
        if (!window.API || !window.API.URL_TAIL) {
            console.error('API not properly initialized');
            return;
        }

        // Ensure currentLanguage is set
        if (!window.currentLanguage) {
            window.currentLanguage = 'en'; // Default to English
        }

        // Set page title
        const headerTitle = window.strings[window.currentLanguage]?.siteTitle || 'Freeverse';
        const pageTitle = window.strings[window.currentLanguage]?.broadcastTx || 'Broadcast TX';
        document.title = `${headerTitle} - ${pageTitle}`;

        // Set data-disable-header-search attribute to hide search bar
        document.body.setAttribute('data-disable-header-search', 'true');

        // Initialize event listeners
        initializeEventListeners();

        // Add language change listener
        window.addEventListener('languageChanged', (event) => {
            if (event.detail && event.detail.lang) {
                updateStrings();
            }
        });

        // Initial string update
        updateStrings();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// Initialize event listeners
function initializeEventListeners() {
    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', handleClear);
    }

    // Copy button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopy);
    }

    // Broadcast button
    const broadcastBtn = document.getElementById('broadcast-btn');
    if (broadcastBtn) {
        broadcastBtn.addEventListener('click', handleBroadcast);
    }

    // Decode button
    const decodeBtn = document.getElementById('decode-btn');
    if (decodeBtn) {
        decodeBtn.addEventListener('click', handleDecode);
    }
}

// Handle clear
function handleClear() {
    // Clear raw TX input
    const rawTxInput = document.getElementById('raw-tx-input');
    if (rawTxInput) {
        rawTxInput.value = '';
    }

    // Clear result content
    const resultContent = document.getElementById('result-content');
    if (resultContent) {
        resultContent.innerHTML = '';
    }
}

// Handle copy
function handleCopy(event) {
    const resultContent = document.getElementById('result-content');
    const copyableSpan = resultContent.querySelector('.copyable');
    
    if (!copyableSpan) {
        console.warn('No copyable content found');
        return;
    }
    
    const content = copyableSpan.getAttribute('data-value');
    
    if (!content) {
        console.warn('No content to copy');
        return;
    }
    
    // Decode HTML entities to get the original value
    const decodedContent = decodeHtmlEntities(content);
    
    // Use clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(decodedContent).then(() => {
            showCopyNotification(event);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(decodedContent, event);
        });
    } else {
        fallbackCopyTextToClipboard(decodedContent, event);
    }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text, event) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification(event);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showToast(window.strings[window.currentLanguage]?.failedToCopy || 'Failed to copy');
    }
    
    document.body.removeChild(textArea);
}

// Show copy notification at button position
function showCopyNotification(event) {
    // Show copy confirmation message at button position
    const copyMessage = document.createElement('div');
    copyMessage.style.position = 'fixed';
    copyMessage.style.left = `${event.clientX}px`;
    copyMessage.style.top = `${event.clientY - 30}px`; // Position above the click
    copyMessage.style.transform = 'translateX(-50%)';
    copyMessage.style.padding = '4px 8px';
    copyMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    copyMessage.style.color = 'white';
    copyMessage.style.borderRadius = '4px';
    copyMessage.style.zIndex = '1000';
    copyMessage.style.fontSize = '12px';
    copyMessage.style.pointerEvents = 'none'; // Prevent message from interfering with clicks
    
    // Set message text based on current language
    const currentLang = window.currentLanguage || 'en';
    copyMessage.textContent = currentLang === 'zh' ? '已复制' : 'Copied';
    
    document.body.appendChild(copyMessage);
    
    // Remove message after 1 second
    setTimeout(() => {
        copyMessage.remove();
    }, 1000);
}

// Handle broadcast
async function handleBroadcast() {
    try {
        const rawTxInput = document.getElementById('raw-tx-input');
        const rawTx = rawTxInput.value.trim();
        
        if (!rawTx) {
            showToast(window.strings[window.currentLanguage]?.enterRawTx || 'Please enter raw transaction');
            return;
        }
        
        // Validate hex format
        if (!/^[0-9a-fA-F]+$/.test(rawTx)) {
            showToast(window.strings[window.currentLanguage]?.invalidHexFormat || 'Invalid hex format');
            return;
        }
        
        // Show loading state
        const resultContent = document.getElementById('result-content');
        resultContent.innerHTML = window.strings[window.currentLanguage]?.broadcasting || 'Broadcasting...';
        
        // Call broadcast API
        const response = await broadcastTransaction(rawTx);
        
        // Display result
        displayResult(response);
        
    } catch (error) {
        console.error('Error broadcasting transaction:', error);
        showToast(window.strings[window.currentLanguage]?.error || 'Error');
        
        // Display error in result
        const resultContent = document.getElementById('result-content');
        resultContent.innerHTML = `<span class="error">${error.message || 'Broadcast failed'}</span>`;
    }
}

// Broadcast transaction API call
async function broadcastTransaction(rawTx) {
    try {
        if (!window.API?.URL_TAIL?.BROADCAST_TX) {
            throw new Error('Broadcast API endpoint not available');
        }
        
        const url = `${window.API.urlHead}${window.API.URL_TAIL.BROADCAST_TX}?rawTx=${encodeURIComponent(rawTx)}`;
        console.log('Broadcast URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Broadcast API error:', error);
        throw new Error(window.strings[window.currentLanguage]?.broadcastFailed || 'Broadcast failed');
    }
}

// Display result
function displayResult(result) {
    const resultContent = document.getElementById('result-content');
    
    if (!result) {
        resultContent.innerHTML = '<span class="error">No result received</span>';
        return;
    }
    
    // Convert result to JSON string
    const jsonString = JSON.stringify(result, null, 2);
    
    // Escape HTML entities to prevent parsing issues
    const escapedJsonString = escapeHtmlEntities(jsonString);
    
    // Create the content with copyable span
    resultContent.innerHTML = `<span class="copyable" data-value="${escapedJsonString}" style="cursor: pointer;">${jsonString}</span>`;
    
    // Add click handler for copyable content
    const copyableSpan = resultContent.querySelector('.copyable');
    if (copyableSpan) {
        copyableSpan.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                const valueToCopy = copyableSpan.getAttribute('data-value');
                if (!valueToCopy) {
                    console.warn('No value to copy');
                    return;
                }
                
                // Decode HTML entities to get the original value
                const decodedValue = decodeHtmlEntities(valueToCopy);
                
                await navigator.clipboard.writeText(decodedValue);
                
                // Show copy confirmation message at clicked position
                const copyMessage = document.createElement('div');
                copyMessage.style.position = 'fixed';
                copyMessage.style.left = `${e.clientX}px`;
                copyMessage.style.top = `${e.clientY - 30}px`; // Position above the click
                copyMessage.style.transform = 'translateX(-50%)';
                copyMessage.style.padding = '4px 8px';
                copyMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                copyMessage.style.color = 'white';
                copyMessage.style.borderRadius = '4px';
                copyMessage.style.zIndex = '1000';
                copyMessage.style.fontSize = '12px';
                copyMessage.style.pointerEvents = 'none'; // Prevent message from interfering with clicks
                copyMessage.textContent = document.querySelector('.lang-btn.active')?.id.includes('en') ? 'Copied' : '已复制';
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
}

// Show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Update strings
function updateStrings() {
    const elements = document.querySelectorAll('[data-string-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-string-key');
        const currentLang = window.currentLanguage || 'en';
        
        let text;
        // Handle nested keys (e.g., "fieldNames.birthTime")
        if (key.includes('.')) {
            const keyParts = key.split('.');
            text = window.strings[currentLang];
            for (const part of keyParts) {
                text = text?.[part];
            }
        } else {
            // Handle simple keys (e.g., "to", "amount")
            text = window.strings[currentLang]?.[key];
        }
        
        if (text) {
            if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.hasAttribute('placeholder')) {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
}

// Handle decode
async function handleDecode() {
    try {
        const rawTxInput = document.getElementById('raw-tx-input');
        const rawTx = rawTxInput.value.trim();
        
        if (!rawTx) {
            showToast(window.strings[window.currentLanguage]?.enterRawTx || 'Please enter raw transaction');
            return;
        }
        
        // Validate hex format
        if (!/^[0-9a-fA-F]+$/.test(rawTx)) {
            showToast(window.strings[window.currentLanguage]?.invalidHexFormat || 'Invalid hex format');
            return;
        }
        
        // Show loading state
        const resultContent = document.getElementById('result-content');
        resultContent.innerHTML = window.strings[window.currentLanguage]?.decoding || 'Decoding...';
        
        // Call decode API
        const response = await decodeTransaction(rawTx);
        
        // Display result
        displayResult(response);
        
    } catch (error) {
        console.error('Error decoding transaction:', error);
        showToast(window.strings[window.currentLanguage]?.error || 'Error');
        
        // Display error in result
        const resultContent = document.getElementById('result-content');
        resultContent.innerHTML = `<span class="error">${error.message || 'Decode failed'}</span>`;
    }
}

// Decode transaction API call
async function decodeTransaction(rawTx) {
    try {
        if (!window.API?.URL_TAIL?.DECODE_TX) {
            throw new Error('Decode API endpoint not available');
        }
        
        const url = `${window.API.urlHead}${window.API.URL_TAIL.DECODE_TX}?rawTx=${encodeURIComponent(rawTx)}`;
        console.log('Decode URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Decode API error:', error);
        throw new Error(window.strings[window.currentLanguage]?.decodeFailed || 'Decode failed');
    }
}

// Export functions for Header.js to use
window.BroadcastTx = {
    updateStrings: () => {
        updateStrings();
    }
}; 