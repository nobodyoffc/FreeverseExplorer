import Mail from '../entity/Mail.js';
import { getSearchConfig } from './search-config.js';
import { showAsQrCodes } from './utils.js';
import { QR_CODE_ICON_SVG } from '../constants/constants.js';

// Get the URL head from global API
let urlHead = window.API.urlHead;
const urlTail = window.API.URL_TAIL.MAIL_BY_IDS;
let loadingOverlay;

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for strings to be loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let mailInstance;

    if (id) {
        // Load LoadingOverlay script if not already loaded
        if (!window.LoadingOverlay) {
            const script = document.createElement('script');
            script.src = '/modules/LoadingOverlay.js';
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // Initialize loading overlay
        loadingOverlay = new LoadingOverlay();
        
        // Show loading overlay
        loadingOverlay.show();
        loadingOverlay.setText('Loading Mail details...');
        
        // Fetch Mail by ID
        mailInstance = await fetchMailById(id);
        
        // Hide loading overlay
        loadingOverlay.hide();
    } else {
        // Get the mail instance data from sessionStorage
        const mailDetailData = sessionStorage.getItem('mailDetail');
        if (!mailDetailData) {
            console.error('No mail detail data found');
            return;
        }
        mailInstance = JSON.parse(mailDetailData);
    }

    if (!mailInstance) {
        console.error('Failed to get Mail data');
        return;
    }

    // Set page title
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].fieldNames.mailDetail;
    document.title = `${headerTitle} - ${pageTitle}`;
    
    // Display mail details
    displayMailDetails(mailInstance);

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            // Update page title
            const currentLang = event.detail.lang;
            const title = window.strings[currentLang]?.fieldNames?.mailDetail || 'Mail Detail';
            document.title = `${window.strings[currentLang].siteTitle} - ${title}`;
            
            // Re-render the details with new field names
            displayMailDetails(mailInstance);
        }
    });

    // Set data-disable-header-search attribute to hide search bar
    document.body.setAttribute('data-disable-header-search', 'true');
});

// Function to fetch Mail by ID
async function fetchMailById(id) {
    try {
        const parameters = `?ids=${id}`;
        const url = urlHead + urlTail + parameters;

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result?.data && result.data[id]) {
            return result.data[id];
        }
        return null;
    } catch (error) {
        console.error('Error fetching Mail by ID:', error);
        return null;
    }
}

// Display mail details
function displayMailDetails(mailInstance) {
    const detailContent = document.getElementById('mail-detail-content');
    if (!detailContent) return;

    // Get field name map and field types for formatting
    const showFieldNameMap = Mail.getShowFieldNameAsMap();
    const timestampFields = Mail.getTimestampFieldList();
    const satoshiFields = Mail.getSatoshiFieldList();

    // Create detail table
    let detailHTML = '<table class="detail-table-unified">';

    // Get fields from Mail constructor
    const mail = new Mail();
    const orderedFields = Object.keys(mail);

    // Add rows for all properties of the mail instance in the defined order
    orderedFields.forEach(field => {
        const value = mailInstance[field];
        // Skip if field is null or undefined
        if (value === null || value === undefined) return;

        const originalValue = value; // Store original value for copying
        let valueClass = ''; // For styling boolean values
        let displayValue = value; // Store display value
        
        // Handle different field types
        if (timestampFields.includes(field)) {
            if (value) {
                const date = new Date(value * 1000);
                displayValue = date.toLocaleString(undefined, {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
            }
        } else if (satoshiFields.includes(field)) {
            displayValue = formatNumber(value / 100000000, 8);
        } else if (typeof value === 'boolean') {
            displayValue = value ? '✓' : '✗';
            valueClass = value ? 'boolean-true' : 'boolean-false';
        }

        // Ensure originalValue is a string for copying
        const copyValue = originalValue === null ? '' : String(originalValue);

        // Get localized field name from strings object
        const currentLang = window.currentLanguage || 'en';
        const fieldName = window.strings[currentLang]?.fieldNames?.[field] || 
                         showFieldNameMap[field] || 
                         field.replace(/([A-Z])/g, ' $1').trim();

        // Add QR code icon for fields that need QR code
        const qrIcon = Mail.getShowQrCodeFieldList().includes(field) && value ? `
            <svg class="qr-icon" viewBox="0 0 24 24" width="24" height="24" data-field="${field}">
                ${QR_CODE_ICON_SVG}
            </svg>
        ` : '';

        detailHTML += `
            <tr>
                <th>${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</th>
                <td>
                    <span class="copyable ${valueClass}" data-value="${copyValue}" style="cursor: pointer;">
                        ${displayValue}
                    </span>
                    ${qrIcon}
                </td>
            </tr>
        `;
    });

    detailHTML += '</table>';
    detailContent.innerHTML = detailHTML;

    // Add click handlers for copyable values
    document.querySelectorAll('.copyable').forEach(span => {
        span.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                const valueToCopy = span.getAttribute('data-value');
                if (!valueToCopy) {
                    console.warn('No value to copy');
                    return;
                }
                
                await navigator.clipboard.writeText(String(valueToCopy));
                
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
    });

    // Add click handler for QR code icon
    document.querySelectorAll('.qr-icon').forEach(icon => {
        icon.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const field = e.target.closest('.qr-icon').getAttribute('data-field');
            const value = mailInstance[field];
            
            if (value) {
                try {
                    // Convert string to UTF-8 bytes
                    const encoder = new TextEncoder();
                    const bytes = encoder.encode(value);
                    
                    // Show QR codes
                    await showAsQrCodes(bytes);
                } catch (error) {
                    console.error('Error showing QR code:', error);
                    showToast('Error showing QR code', 'error');
                }
            }
        });
    });
}

// Format number to remove redundant trailing zeros
function formatNumber(value, decimals) {
    return Number(value).toFixed(decimals).replace(/\.?0+$/, '');
}

// Export functions for Header.js to use
window.MailDetail = {
    updateStrings: () => {
        const mailDetailData = sessionStorage.getItem('mailDetail');
        if (mailDetailData) {
            const mailInstance = JSON.parse(mailDetailData);
            displayMailDetails(mailInstance);
        }
    }
};

// Toast notification function
function showToast(message, x, y) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Position the toast near the click
    const rect = document.body.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate position relative to viewport
    const posX = x - rect.left + scrollLeft;
    const posY = y - rect.top + scrollTop;
    
    // Set position
    toast.style.position = 'absolute';
    toast.style.left = `${posX}px`;
    toast.style.top = `${posY}px`;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
} 