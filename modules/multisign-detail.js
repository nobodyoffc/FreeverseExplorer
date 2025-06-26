// Import Multisign class
import Multisign from '../entity/Multisign.js';
import { getSearchConfig } from './search-config.js';
import { showAsQrCodes } from './utils.js';
import { QR_CODE_ICON_SVG } from '../constants/constants.js';

// Get the URL head from global API
let urlHead = window.API.urlHead;
const urlTail = window.API.URL_TAIL.MULTISIGN_BY_IDS;
let loadingOverlay;

// Add download function to global scope
window.downloadAvatar = function(dataUrl, filename) {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Function to fetch CID avatar
async function fetchCidAvatar(id) {
    try {
        const url = `${urlHead}${window.API.URL_TAIL.AVATARS}?ids=${id}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data?.data && data.data[id]) {
            return data.data[id];
        }
        return null;
    } catch (error) {
        console.error('Error fetching CID avatar:', error);
        return null;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for strings to be loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let multisignInstance;
    let avatar = null;

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
        loadingOverlay.setText('Loading Multisign details...');
        
        // Fetch Multisign by ID
        multisignInstance = await fetchMultisignById(id);
        
        // Fetch avatar if we have an ID
        if (multisignInstance) {
            avatar = await fetchCidAvatar(multisignInstance.id);
        }
        
        // Hide loading overlay
        loadingOverlay.hide();
    } else {
        // Get the multisign instance data from sessionStorage
        const multisignDetailData = sessionStorage.getItem('multisignDetail');
        if (!multisignDetailData) {
            console.error('No multisign detail data found');
            return;
        }
        multisignInstance = JSON.parse(multisignDetailData);
        // Fetch avatar for the stored ID
        if (multisignInstance.id) {
            avatar = await fetchCidAvatar(multisignInstance.id);
        }
    }

    if (!multisignInstance) {
        console.error('Failed to get Multisign data');
        return;
    }

    // Set page title
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].fieldNames.multisignDetail;
    document.title = `${headerTitle} - ${pageTitle}`;
    
    // Display multisign details
    displayMultisignDetails(multisignInstance, avatar);

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            // Update page title
            const currentLang = event.detail.lang;
            const title = window.strings[currentLang]?.fieldNames?.multisignDetail || 'Multisign Detail';
            document.title = `${window.strings[currentLang].siteTitle} - ${title}`;
            
            // Re-render the details with new field names
            displayMultisignDetails(multisignInstance, avatar);
        }
    });

    // Set data-disable-header-search attribute to hide search bar
    document.body.setAttribute('data-disable-header-search', 'true');
});

// Function to fetch Multisign by ID
async function fetchMultisignById(id) {
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
        console.error('Error fetching Multisign by ID:', error);
        return null;
    }
}

// Display multisign details
function displayMultisignDetails(multisignInstance, avatar) {
    const detailContent = document.getElementById('multisign-detail-content');
    if (!detailContent) return;

    // Create avatar container if avatar exists
    let avatarHTML = '';
    if (avatar) {
        avatarHTML = `
            <div class="avatar-container" style="margin: 20px 0 20px 20px;">
                <img src="data:image/png;base64,${avatar}" 
                     style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; cursor: pointer;"
                     alt="CID Avatar"
                     onclick="window.downloadAvatar(this.src, '${multisignInstance.id}.png')">
            </div>
        `;
    }

    // Get field name map and field types for formatting
    const showFieldNameMap = Multisign.getShowFieldNameAsMap();
    const timestampFields = Multisign.getTimestampFieldList();

    // Create detail table
    let detailHTML = avatarHTML + '<table class="detail-table-unified">';

    // Get fields from Multisign constructor
    const multisign = new Multisign();
    const orderedFields = Object.keys(multisign);

    // Add rows for all properties of the multisign instance in the defined order
    orderedFields.forEach(field => {
        const value = multisignInstance[field];
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
            } else {
                displayValue = '';
            }
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
        const qrIcon = Multisign.getShowQrCodeFieldList().includes(field) ? `
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

// Export functions for Header.js to use
window.MultisignDetail = {
    updateStrings: () => {
        const multisignDetailData = sessionStorage.getItem('multisignDetail');
        if (multisignDetailData) {
            const multisignInstance = JSON.parse(multisignDetailData);
            displayMultisignDetails(multisignInstance);
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