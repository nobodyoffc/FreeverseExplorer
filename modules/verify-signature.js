// Import required modules
import { showToast } from './utils.js';
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
        const pageTitle = window.strings[window.currentLanguage]?.verifySignature || 'Verify Signature';
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

    // Verify button
    const verifyBtn = document.getElementById('verify-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', handleVerify);
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
    
    // Use clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content).then(() => {
            showCopyNotification(event);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(content, event);
        });
    } else {
        fallbackCopyTextToClipboard(content, event);
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

// Show error message above verify button
function showVerifyError(message) {
    // Remove any existing error message
    const existingError = document.querySelector('.verify-error-message');
    if (existingError) {
        existingError.remove();
    }

    const verifyBtn = document.getElementById('verify-btn');
    if (!verifyBtn) return;

    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'verify-error-message';
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
    verifyBtn.parentElement.style.position = 'relative';
    verifyBtn.parentElement.insertBefore(errorMessage, verifyBtn);

    // Remove error message after 3 seconds
    setTimeout(() => {
        if (errorMessage.parentElement) {
            errorMessage.remove();
        }
    }, 3000);
}

// Handle verify
async function handleVerify() {
    const signatureInput = document.getElementById('signature-input');
    const signature = signatureInput.value.trim();

    if (!signature) {
        showVerifyError(window.strings[window.currentLanguage]?.inputError || 'Input Error');
        return;
    }

    try {
        // Disable verify button and show verifying state
        const verifyBtn = document.getElementById('verify-btn');
        const originalText = verifyBtn.textContent;
        verifyBtn.disabled = true;
        verifyBtn.textContent = window.strings[window.currentLanguage]?.verifying || 'Verifying...';

        if (!window.API?.URL_TAIL?.VERIFY) {
            console.error('VERIFY endpoint not available');
            showVerifyError('API endpoint not available');
            return;
        }

        // URL encode the signature
        const encodedSignature = encodeURIComponent(signature);

        // Get the current working server URL
        const currentUrlHead = window.API.getWorkingServer() || window.API.SERVER_URL_HEADS[0];
        const verifyUrl = `${currentUrlHead}${window.API.URL_TAIL.VERIFY}?sign=${encodedSignature}`;
        
        const response = await fetch(verifyUrl);
        
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
        const resultContent = document.getElementById('result-content');
        if (resultContent) {
            // Check if code is 0
            if (data.code === 0) {
                // Check if data is true or false
                if (data.data === true) {
                    // Show green checkmark
                    resultContent.innerHTML = `
                        <div class="result-icon result-success">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                        </div>
                    `;
                } else if (data.data === false) {
                    // Show red X
                    resultContent.innerHTML = `
                        <div class="result-icon result-failure">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </div>
                    `;
                } else {
                    // Show the data as text
                    resultContent.innerHTML = `<span class="copyable" data-value="${JSON.stringify(data.data)}">${JSON.stringify(data.data)}</span>`;
                }
            } else {
                // Show the full response data when code is not 0
                resultContent.innerHTML = `<span class="copyable" data-value="${JSON.stringify(data)}">${JSON.stringify(data, null, 2)}</span>`;
            }
        }
        
    } catch (error) {
        console.error('Error verifying signature:', error);
        showVerifyError(window.strings[window.currentLanguage]?.verifyFailed || 'Verify failed');
    } finally {
        // Re-enable verify button and restore original text
        const verifyBtn = document.getElementById('verify-btn');
        verifyBtn.disabled = false;
        verifyBtn.textContent = window.strings[window.currentLanguage]?.verifyButton || 'Verify';
    }
}

// Handle clear
function handleClear() {
    // Clear signature input
    const signatureInput = document.getElementById('signature-input');
    if (signatureInput) {
        signatureInput.value = '';
    }

    // Clear result content
    const resultContent = document.getElementById('result-content');
    if (resultContent) {
        resultContent.innerHTML = '';
    }

    // Clear any error messages
    const errorMessage = document.querySelector('.verify-error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
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
            if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.hasAttribute('placeholder') && element.id !== 'signature-input') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
}

// Export functions for Header.js to use
window.VerifySignature = {
    updateStrings: () => {
        updateStrings();
    }
}; 