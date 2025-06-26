// Import OpReturn class
import OpReturn from '../entity/OpReturn.js';
import { getSearchConfig } from './search-config.js';
import { escapeHtmlEntities, decodeHtmlEntities, showAsQrCodes, showToast } from './utils.js';
import { QR_CODE_ICON_SVG } from '../constants/constants.js';

// Get the URL head from global API
let urlHead = window.API.urlHead;
const urlTail = window.API.URL_TAIL.OPRETURN_BY_IDS;
let loadingOverlay;

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for strings to be loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let opReturnInstance;

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
        loadingOverlay.setText('Loading OP_RETURN details...');
        
        // Fetch OP_RETURN by ID
        opReturnInstance = await fetchOpReturnById(id);
        
        // Hide loading overlay
        loadingOverlay.hide();
    } else {
        // Get the opReturn instance data from sessionStorage
        const opReturnDetailData = sessionStorage.getItem('opReturnDetail');
        if (!opReturnDetailData) {
            console.error('No OP_RETURN detail data found');
            return;
        }
        opReturnInstance = JSON.parse(opReturnDetailData);
    }

    if (!opReturnInstance) {
        console.error('Failed to get OP_RETURN data');
        return;
    }

    // Set page title
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].fieldNames.opReturnDetail;
    document.title = `${headerTitle} - ${pageTitle}`;
    
    // Display opReturn details
    displayOpReturnDetails(opReturnInstance);

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            // Update page title
            const currentLang = event.detail.lang;
            const title = window.strings[currentLang]?.fieldNames?.opReturnDetail || 'OP_RETURN Detail';
            document.title = `${window.strings[currentLang].siteTitle} - ${title}`;
            
            // Re-render the details with new field names
            displayOpReturnDetails(opReturnInstance);
        }
    });

    // Set data-disable-header-search attribute to hide search bar
    document.body.setAttribute('data-disable-header-search', 'true');
});

// Function to fetch OP_RETURN by ID
async function fetchOpReturnById(id) {
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
        console.error('Error fetching OP_RETURN by ID:', error);
        return null;
    }
}

// Display opReturn details
function displayOpReturnDetails(opReturnInstance) {
    const detailContent = document.getElementById('opreturn-detail-content');
    if (!detailContent) return;

    // Get field name map and field types for formatting
    const showFieldNameMap = OpReturn.getShowFieldNameAsMap();
    const timestampFields = OpReturn.getTimestampFieldList();

    // Create detail table
    let detailHTML = '<table class="detail-table-unified">';

    // Get fields from OpReturn constructor
    const opReturn = new OpReturn();
    const orderedFields = Object.keys(opReturn);

    // Add rows for all properties of the opReturn instance in the defined order
    orderedFields.forEach(field => {
        const value = opReturnInstance[field];
        // Skip if field is null or undefined
        if (value === null || value === undefined) return;

        const originalValue = value; // Store original value for copying
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
            });
        }

        // Ensure originalValue is a string for copying
        let copyValue;
        if (originalValue === null) {
            copyValue = '';
        } else if (typeof originalValue === 'object') {
            // Handle JSON objects properly
            copyValue = JSON.stringify(originalValue, null, 2);
        } else {
            copyValue = String(originalValue);
        }

        // Escape HTML attributes to prevent parsing issues
        const escapedCopyValue = escapeHtmlEntities(copyValue);

        // Get localized field name from strings object
        const currentLang = window.currentLanguage || 'en';
        const fieldName = window.strings[currentLang]?.fieldNames?.[field] || 
                         showFieldNameMap[field] || 
                         field.replace(/([A-Z])/g, ' $1').trim();

        // Add QR code icon for fields that should show QR code
        const qrIcon = OpReturn.getShowQrCodeFieldList().includes(field) ? `
            <svg class="qr-icon" viewBox="0 0 24 24" width="24" height="24">
                ${QR_CODE_ICON_SVG}
            </svg>
        ` : '';

        detailHTML += `
            <tr>
                <th>${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</th>
                <td>
                    <span class="copyable" data-value="${escapedCopyValue}" style="cursor: pointer;">
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
    });
}

// Export functions for Header.js to use
window.OpReturnDetail = {
    updateStrings: () => {
        const opReturnDetailData = sessionStorage.getItem('opReturnDetail');
        if (opReturnDetailData) {
            const opReturnInstance = JSON.parse(opReturnDetailData);
            displayOpReturnDetails(opReturnInstance);
        }
    }
}; 