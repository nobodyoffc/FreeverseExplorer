// Import Cash class
import Cash from '../entity/Cash.js';
import { getSearchConfig } from './search-config.js';
import { showAsQrCodes } from './utils.js';
import { QR_CODE_ICON_SVG } from '../constants/constants.js';

// Get the URL head from global API
// Use a getter function to always get the current working server URL
const getUrlHead = () => window.API.urlHead;
const urlTail = window.API.URL_TAIL.CASH_BY_IDS;
let loadingOverlay;

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for strings to be loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let cashInstance;

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
        loadingOverlay.setText('Loading Cash details...');
        
        // Fetch Cash by ID
        cashInstance = await fetchCashById(id);
        
        // Hide loading overlay
        loadingOverlay.hide();
    } else {
        // Get the cash instance data from sessionStorage
        const cashDetailData = sessionStorage.getItem('cashDetail');
        if (!cashDetailData) {
            console.error('No cash detail data found');
            return;
        }
        cashInstance = JSON.parse(cashDetailData);
    }

    if (!cashInstance) {
        console.error('Failed to get Cash data');
        return;
    }

    // Set page title
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].fieldNames.cashDetail;
    document.title = `${headerTitle} - ${pageTitle}`;
    
    // Display cash details
    displayCashDetails(cashInstance);

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            // Update page title
            const currentLang = event.detail.lang;
            const title = window.strings[currentLang]?.fieldNames?.cashDetail || 'Cash Detail';
            document.title = `${window.strings[currentLang].siteTitle} - ${title}`;
            
            // Re-render the details with new field names
            displayCashDetails(cashInstance);
        }
    });

    // Set data-disable-header-search attribute to hide search bar
    document.body.setAttribute('data-disable-header-search', 'true');
});

// Function to fetch Cash by ID
async function fetchCashById(id) {
    try {
        
        const parameters = `?ids=${id}`;
        const url = getUrlHead() + urlTail + parameters;

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
        console.error('Error fetching Cash by ID:', error);
        return null;
    }
}

// Display cash details
function displayCashDetails(cashInstance) {
    const detailContent = document.getElementById('cash-detail-content');
    if (!detailContent) return;

    // Get field name map and field types for formatting
    const showFieldNameMap = Cash.getShowFieldNameAsMap();
    const timestampFields = Cash.getTimestampFieldList();
    const satoshiFields = Cash.getSatoshiFieldList();

    // Create detail table
    let detailHTML = '<table class="detail-table-unified">';

    // Get fields from Cash constructor
    const cash = new Cash();
    const orderedFields = Object.keys(cash);

    // Add rows for all properties of the cash instance in the defined order
    orderedFields.forEach(field => {
        const value = cashInstance[field];
        // Skip if field is null or undefined
        if (value === null || value === undefined) return;

        const originalValue = value; // Store original value for copying
        let valueClass = ''; // For styling boolean values
        let displayValue = value; // Store display value
        
        // Handle different field types
        if (timestampFields.includes(field)) {
            const date = new Date(value * 1000);
            displayValue = date.toLocaleString(undefined, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(/\//g, '-');
        } else if (satoshiFields.includes(field)) {
            displayValue = formatNumber(value / 100000000, 8);
        } else if (field === 'fee') {
            displayValue = formatNumber(value / 1000000, 6) + 'c';
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

        // Add QR code icon for fields that should show QR code
        const qrIcon = Cash.getShowQrCodeFieldList().includes(field) ? `
            <svg class="qr-icon" viewBox="0 0 24 24" width="24" height="24">
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
            
            const row = e.target.closest('tr');
            const value = row.querySelector('.copyable').getAttribute('data-value');
            
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
window.CashDetail = {
    updateStrings: () => {
        const cashDetailData = sessionStorage.getItem('cashDetail');
        if (cashDetailData) {
            const cashInstance = JSON.parse(cashDetailData);
            displayCashDetails(cashInstance);
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

// Add to each page's initialization code
window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && window.strings[savedLang]) {
        window.currentLanguage = savedLang;
        if (typeof window.updateAllStrings === 'function') {
            window.updateAllStrings();
        }
    }
}); 