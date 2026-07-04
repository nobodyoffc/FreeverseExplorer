// Import required modules
import { PAGE_SIZE, QR_CODE_ICON_SVG } from '../constants/constants.js';
import { escapeHtmlEntities, decodeHtmlEntities, showToast, showAsQrCodes } from './utils.js';
import '../modules/api.js';  // Import API module
import '../modules/LoadingOverlay.js';  // Import LoadingOverlay module

// Global variables
let pageSize = PAGE_SIZE;
let currentPubkey = '';
let loadingOverlay;

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

        // Initialize loading overlay
        loadingOverlay = new LoadingOverlay();

        // Set page title
        const headerTitle = window.strings[window.currentLanguage]?.siteTitle || 'Freeverse';
        const pageTitle = window.strings[window.currentLanguage]?.encrypt || 'Encrypt';
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
    // Pubkey confirm button
    const pubkeyConfirmBtn = document.getElementById('pubkey-confirm-btn');
    if (pubkeyConfirmBtn) {
        pubkeyConfirmBtn.addEventListener('click', handlePubkeyConfirm);
    }

    // Pubkey input enter key event
    const pubkeyInput = document.getElementById('pubkey-input');
    if (pubkeyInput) {
        pubkeyInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handlePubkeyConfirm();
            }
        });
    }

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

    // Encrypt button
    const encryptBtn = document.getElementById('encrypt-btn');
    if (encryptBtn) {
        encryptBtn.addEventListener('click', handleEncrypt);
    }

    // Add click outside to close dropdowns
    document.addEventListener('click', (event) => {
        // Close FID dropdown
        const fidDropdown = document.getElementById('fid-dropdown');
        if (fidDropdown && !event.target.closest('.pubkey-input-container')) {
            fidDropdown.classList.remove('active');
        }
    });
}

// Handle pubkey confirm button click
async function handlePubkeyConfirm() {
    const pubkeyInput = document.getElementById('pubkey-input');
    const searchString = pubkeyInput.value.trim();

    if (!searchString) return;

    // Check if input is a valid FID
    if (searchString.length === 34 && (searchString[0] === 'F' || searchString[0] === '3')) {
        // Valid FID format, get pubkey for it
        await getPubkeyFromFid(searchString);
    } else if (isValidPubkey(searchString)) {
        // Valid pubkey format, no need to search
        currentPubkey = searchString;
        return;
    } else {
        // Search for FID
        await searchFid(searchString);
    }
}

// Check if string is a valid pubkey (02 or 03 followed by 64 hex characters)
function isValidPubkey(str) {
    return /^[02][0-9a-fA-F]{64}$/.test(str);
}

// Format JSON string to remove outer quotes and internal whitespace
function formatCompressedJson(jsonString) {
    // Remove outer quotes if the string starts and ends with quotes
    let formatted = jsonString;
    if (formatted.startsWith('"') && formatted.endsWith('"')) {
        formatted = formatted.slice(1, -1);
    }
    
    // Remove \n, \r, \t and other escape sequences, and all whitespace
    formatted = formatted.replace(/\\n/g, '')  // Remove \n
                         .replace(/\\r/g, '')   // Remove \r
                         .replace(/\\t/g, '')   // Remove \t
                         .replace(/\\"/g, '"')  // Replace \" with "
                         .replace(/\\\\/g, '\\') // Replace \\ with \
                         .replace(/\s+/g, '');  // Remove all remaining whitespace
    
    return formatted;
}

// Show chosen FID below the pubkey input
function showChosenFid(fid) {
    const chosenFidEl = document.getElementById('chosen-fid');
    if (chosenFidEl) {
        chosenFidEl.textContent = `FID: ${fid}`;
        chosenFidEl.classList.add('active');
    }
}

// Get pubkey from FID
async function getPubkeyFromFid(fid) {
    try {
        if (!window.API?.URL_TAIL?.FREER_BY_IDS) {
            console.error('FREER_BY_IDS endpoint not available');
            showEncryptError(window.strings[window.currentLanguage]?.error || 'Error');
            return;
        }

        // Get the current working server URL
        const currentUrlHead = window.API.getWorkingServer() || window.API.SERVER_URL_HEADS[0];
        const cidUrl = `${currentUrlHead}${window.API.URL_TAIL.FREER_BY_IDS}?ids=${fid}`;
        
        const cidResponse = await fetch(cidUrl);
        
        if (cidResponse.ok) {
            const contentType = cidResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const cidData = await cidResponse.json();
                
                // Check if response code is 0 and pubkey exists
                if (cidData.code === 0 && cidData.data && cidData.data[fid] && cidData.data[fid].pubkey) {
                    currentPubkey = cidData.data[fid].pubkey;
                    document.getElementById('pubkey-input').value = currentPubkey;
                    showChosenFid(fid);
                } else {
                    showEncryptError(window.strings[window.currentLanguage]?.error || 'Error');
                }
            }
        } else {
            showEncryptError(window.strings[window.currentLanguage]?.error || 'Error');
        }
    } catch (cidError) {
        console.error('Error getting pubkey for FID:', cidError);
        showEncryptError(window.strings[window.currentLanguage]?.error || 'Error');
    }
}

// Search for FID
async function searchFid(searchString) {
    try {
        if (!window.API?.URL_TAIL?.FID_CID_SEEK) {
            console.error('FID_CID_SEEK endpoint not available');
            return;
        }
        
        // Show loading overlay
        loadingOverlay.show();
        loadingOverlay.setText(window.strings[window.currentLanguage]?.searchingFid || 'Searching FID...');
        
        // Get the current working server URL
        const currentUrlHead = window.API.getWorkingServer() || window.API.SERVER_URL_HEADS[0];
        const fidUrl = `${currentUrlHead}${window.API.URL_TAIL.FID_CID_SEEK}?part=id,cid,${searchString}&sort=id,asc&size=${pageSize}`;
        
        const response = await fetch(fidUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();

        if (data?.data) {
            displayFidDropdown(Object.keys(data.data));
        }
    } catch (error) {
        console.error('Error searching FID:', error);
        showToast(window.strings[window.currentLanguage].error);
    } finally {
        // Hide loading overlay
        loadingOverlay.hide();
    }
}

// Display FID dropdown
async function displayFidDropdown(fids) {
    const dropdown = document.getElementById('fid-dropdown');
    dropdown.innerHTML = '';

    // If only one result, auto-select it
    if (fids.length === 1) {
        document.getElementById('pubkey-input').value = fids[0];
        dropdown.classList.remove('active');
        await getPubkeyFromFid(fids[0]);
        return;
    }

    dropdown.classList.add('active');

    fids.forEach(fid => {
        const item = document.createElement('div');
        item.className = 'fid-dropdown-item';
        item.textContent = fid;
        item.addEventListener('click', async () => {
            document.getElementById('pubkey-input').value = fid;
            dropdown.classList.remove('active');
            // Get pubkey for selected FID
            await getPubkeyFromFid(fid);
        });
        dropdown.appendChild(item);
    });
}

// Handle copy
function handleCopy(event) {
    const cipherContent = document.getElementById('cipher-content');
    const copyableSpan = cipherContent.querySelector('.copyable');
    
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

// Show error message above encrypt button
function showEncryptError(message) {
    // Remove any existing error message
    const existingError = document.querySelector('.encrypt-error-message');
    if (existingError) {
        existingError.remove();
    }

    const encryptBtn = document.getElementById('encrypt-btn');
    if (!encryptBtn) return;

    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'encrypt-error-message';
    errorMessage.style.position = 'absolute';
    errorMessage.style.bottom = '100%';
    errorMessage.style.left = '50%';
    errorMessage.style.transform = 'translateX(-50%)';
    errorMessage.style.marginBottom = '8px';
    errorMessage.style.padding = '8px 12px';
    errorMessage.style.backgroundColor = '#dc3545';
    errorMessage.style.color = 'white';
    errorMessage.style.borderRadius = '4px';
    errorMessage.style.fontSize = '14px';
    errorMessage.style.whiteSpace = 'nowrap';
    errorMessage.style.zIndex = '1000';
    errorMessage.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
    errorMessage.textContent = message;

    // Insert error message before the button
    encryptBtn.parentElement.style.position = 'relative';
    encryptBtn.parentElement.insertBefore(errorMessage, encryptBtn);

    // Remove error message after 3 seconds
    setTimeout(() => {
        if (errorMessage.parentElement) {
            errorMessage.remove();
        }
    }, 3000);
}

// Handle encrypt
async function handleEncrypt() {
    const pubkeyInput = document.getElementById('pubkey-input');
    const plaintextInput = document.getElementById('plaintext-input');
    const pubkey = pubkeyInput.value.trim();
    const plaintext = plaintextInput.value.trim();

    if (!pubkey) {
        showEncryptError(window.strings[window.currentLanguage]?.inputError || 'Input Error');
        return;
    }

    if (!plaintext) {
        showEncryptError(window.strings[window.currentLanguage]?.inputError || 'Input Error');
        return;
    }

    // Use currentPubkey if available, otherwise use the input value
    const finalPubkey = currentPubkey || pubkey;

    try {
        // Disable encrypt button and show encrypting state
        const encryptBtn = document.getElementById('encrypt-btn');
        const originalText = encryptBtn.textContent;
        encryptBtn.disabled = true;
        encryptBtn.textContent = window.strings[window.currentLanguage]?.encrypting || 'Encrypting...';

        if (!window.API?.URL_TAIL?.ENCRYPT) {
            console.error('ENCRYPT endpoint not available');
            showEncryptError('API endpoint not available');
            return;
        }

        // Create the encrypt input object
        const encryptInput = {
            type: "AsyOneWay",
            pubkey: finalPubkey,
            msg: plaintext,
            alg: "FC_EccK1AesCbc256_No1_NrC7"
        };

        // URL encode the encrypt input
        const encodedInput = encodeURIComponent(JSON.stringify(encryptInput));

        // Get the current working server URL
        const currentUrlHead = window.API.getWorkingServer() || window.API.SERVER_URL_HEADS[0];
        const encryptUrl = `${currentUrlHead}${window.API.URL_TAIL.ENCRYPT}?encryptInput=${encodedInput}`;
        
        const response = await fetch(encryptUrl);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();

        // Display result
        const cipherContent = document.getElementById('cipher-content');
        if (cipherContent) {
            let displayContent;
            let copyValue;
            
            // Check if code is 0 and data exists
            if (data.code === 0 && data.data !== undefined) {
                // If code is 0, display only the data value as compressed JSON
                // Convert data to JSON string first, then format it
                const jsonString = JSON.stringify(data.data);
                displayContent = formatCompressedJson(jsonString);
                copyValue = jsonString; // Keep original JSON for copying
            } else {
                // Otherwise display the full JSON as compressed
                const jsonString = JSON.stringify(data);
                displayContent = formatCompressedJson(jsonString);
                copyValue = jsonString; // Keep original JSON for copying
            }
            
            // Escape HTML attributes to prevent parsing issues
            const escapedCopyValue = escapeHtmlEntities(copyValue);
            
            // Create the content with copyable span and QR code icon
            cipherContent.innerHTML = `<span class="copyable" data-value="${escapedCopyValue}" style="cursor: pointer;">${displayContent}</span><svg class="qr-icon" viewBox="0 0 24 24" width="24" height="24" style="cursor: pointer; margin-left: 8px; vertical-align: middle;">${QR_CODE_ICON_SVG}</svg>`;
            
            // Add click handler for copyable content
            const copyableSpan = cipherContent.querySelector('.copyable');
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
            
            // Add click handler for QR code icon
            const qrIcon = cipherContent.querySelector('.qr-icon');
            if (qrIcon) {
                qrIcon.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const value = copyableSpan.getAttribute('data-value');
                    
                    if (value) {
                        try {
                            // Decode HTML entities to get the original value
                            const decodedValue = decodeHtmlEntities(value);
                            
                            // Convert string to UTF-8 bytes
                            const encoder = new TextEncoder();
                            const bytes = encoder.encode(decodedValue);
                            
                            // Show QR codes
                            await showAsQrCodes(bytes);
                        } catch (error) {
                            console.error('Error showing QR code:', error);
                            showToast('Error showing QR code');
                        }
                    }
                });
            }
        }
        
    } catch (error) {
        console.error('Error encrypting:', error);
        showEncryptError(window.strings[window.currentLanguage]?.encryptFailed || 'Encrypt failed');
    } finally {
        // Re-enable encrypt button and restore original text
        const encryptBtn = document.getElementById('encrypt-btn');
        encryptBtn.disabled = false;
        encryptBtn.textContent = window.strings[window.currentLanguage]?.encrypt || 'Encrypt';
    }
}

// Handle clear
function handleClear() {
    // Clear pubkey input
    const pubkeyInput = document.getElementById('pubkey-input');
    if (pubkeyInput) {
        pubkeyInput.value = '';
    }

    // Clear plaintext input
    const plaintextInput = document.getElementById('plaintext-input');
    if (plaintextInput) {
        plaintextInput.value = '';
    }

    // Clear cipher content
    const cipherContent = document.getElementById('cipher-content');
    if (cipherContent) {
        cipherContent.innerHTML = '';
    }

    // Clear FID dropdown
    const fidDropdown = document.getElementById('fid-dropdown');
    if (fidDropdown) {
        fidDropdown.classList.remove('active');
        fidDropdown.innerHTML = '';
    }

    // Clear chosen FID display
    const chosenFidEl = document.getElementById('chosen-fid');
    if (chosenFidEl) {
        chosenFidEl.textContent = '';
        chosenFidEl.classList.remove('active');
    }

    // Clear any error messages
    const errorMessage = document.querySelector('.encrypt-error-message');
    if (errorMessage) {
        errorMessage.remove();
    }

    // Reset current pubkey
    currentPubkey = '';
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

// Export functions for Header.js to use
window.Encrypt = {
    updateStrings: () => {
        updateStrings();
    }
}; 