// Import Code class
import Code from '../entity/Code.js';
import { getSearchConfig } from './search-config.js';

// Get the URL head from global API
// Use a getter function to always get the current working server URL
const getUrlHead = () => window.API.urlHead;
const urlTail = window.API.URL_TAIL.CODE_BY_IDS;
let loadingOverlay;

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for strings to be loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let codeInstance;

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
        loadingOverlay.setText('Loading Code details...');
        
        // Fetch Code by ID
        codeInstance = await fetchCodeById(id);
        
        // Hide loading overlay
        loadingOverlay.hide();
    } else {
        // Get the code instance data from sessionStorage
        const codeDetailData = sessionStorage.getItem('codeDetail');
        if (!codeDetailData) {
            console.error('No code detail data found');
            return;
        }
        codeInstance = JSON.parse(codeDetailData);
    }

    if (!codeInstance) {
        console.error('Failed to get Code data');
        return;
    }

    // Set page title
    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].fieldNames.codeDetail;
    document.title = `${headerTitle} - ${pageTitle}`;
    
    // Display code details
    displayCodeDetails(codeInstance);

    // Add language change listener
    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            // Update page title
            const currentLang = event.detail.lang;
            const title = window.strings[currentLang]?.fieldNames?.codeDetail || 'Code Detail';
            document.title = `${window.strings[currentLang].siteTitle} - ${title}`;
            
            // Re-render the details with new field names
            displayCodeDetails(codeInstance);
        }
    });

    // Set data-disable-header-search attribute to hide search bar
    document.body.setAttribute('data-disable-header-search', 'true');
});

// Function to fetch Code by ID
async function fetchCodeById(id) {
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
        console.error('Error fetching Code by ID:', error);
        return null;
    }
}

// Display code details
function displayCodeDetails(codeInstance) {
    const detailContent = document.getElementById('code-detail-content');
    if (!detailContent) return;

    // Get field name map and field types for formatting
    const showFieldNameMap = Code.getShowFieldNameAsMap();
    const timestampFields = Code.getTimestampFieldList();
    const satoshiFields = Code.getSatoshiFieldList();

    // Create detail table
    let detailHTML = '<table class="detail-table-unified">';

    // Get fields from Code constructor
    const code = new Code();
    const orderedFields = Object.keys(code);

    // Add rows for all properties of the code instance in the defined order
    orderedFields.forEach(field => {
        const value = codeInstance[field];
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
                }).replace(/\//g, '-');
            }
        } else if (satoshiFields.includes(field)) {
            displayValue = formatNumber(value / 100000000, 8);
        } else if (typeof value === 'boolean') {
            displayValue = value ? '✓' : '✗';
            valueClass = value ? 'boolean-true' : 'boolean-false';
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            displayValue = formatComplexObject(value);
            valueClass = 'complex-object';
        }

        // Ensure originalValue is a string for copying
        let copyValue;
        if (typeof originalValue === 'object' && originalValue !== null) {
            copyValue = JSON.stringify(originalValue, null, 2);
        } else {
            copyValue = originalValue === null ? '' : String(originalValue);
        }
        copyValue = copyValue.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

        // Get localized field name from strings object
        const currentLang = window.currentLanguage || 'en';
        const fieldName = window.strings[currentLang]?.fieldNames?.[field] ||
                         showFieldNameMap[field] ||
                         field.replace(/([A-Z])/g, ' $1').trim();

        detailHTML += `
            <tr>
                <th>${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</th>
                <td>
                    <span class="copyable ${valueClass}" data-value="${copyValue}" style="cursor: pointer;">
                        ${valueClass === 'complex-object' ? `<div style="white-space: pre-line;">${displayValue}</div>` : displayValue}
                    </span>
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
}

// Format number to remove redundant trailing zeros
function formatComplexObject(obj) {
    if (!obj || typeof obj !== 'object') return String(obj);
    const lines = [];
    for (const [key, value] of Object.entries(obj)) {
        let displayValue = value;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            displayValue = JSON.stringify(value);
        } else if (Array.isArray(value)) {
            displayValue = value.join(', ');
        } else if (typeof value === 'boolean') {
            displayValue = value ? '✓' : '✗';
        } else if (value === null || value === undefined) {
            displayValue = '';
        }
        lines.push(`<strong>${key}</strong>: ${displayValue}`);
    }
    return lines.join('<br>');
}

function formatNumber(value, decimals) {
    return Number(value).toFixed(decimals).replace(/\.?0+$/, '');
}

// Export functions for Header.js to use
window.CodeDetail = {
    updateStrings: () => {
        const codeDetailData = sessionStorage.getItem('codeDetail');
        if (codeDetailData) {
            const codeInstance = JSON.parse(codeDetailData);
            displayCodeDetails(codeInstance);
        }
    }
};

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