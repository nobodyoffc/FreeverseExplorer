// Import required modules
import Cash from '../entity/Cash.js';
import RawTxInfo from '../entity/RawTxInfo.js';
import SendTo from '../entity/SendTo.js';
import { PAGE_SIZE, QR_CODE_ICON_SVG } from '../constants/constants.js';
import { showAsQrCodes, escapeHtmlEntities, decodeHtmlEntities, getBestHeight, getCachedBestHeight } from './utils.js';
import '../modules/api.js';  // Import API module
import '../modules/LoadingOverlay.js';  // Import LoadingOverlay module

// Global variables
// Use a getter function to always get the current working server URL
const getUrlHead = () => window.API?.urlHead;
let lastValues = null;
let chosenCashMap = new Map();
let sendToList = [];
let currentPage = 1;
let pageSize = PAGE_SIZE;
let isCreateTxMode = false;
let loadingOverlay;

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for strings to be loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Ensure API is initialized
        if (!window.API || !window.API.URL_TAIL) {
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
        const pageTitle = window.strings[window.currentLanguage]?.myCash || 'My Cash';
        document.title = `${headerTitle} - ${pageTitle}`;

        // Set data-disable-header-search attribute to hide search bar
        document.body.setAttribute('data-disable-header-search', 'true');

        // Check for FID parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const fidParam = urlParams.get('fid');
        if (fidParam) {
            const senderInput = document.getElementById('sender-input');
            if (senderInput) {
                senderInput.value = fidParam;
                await searchCash(fidParam);
            }
        }

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
        // Handle initialization error silently
    }
});

// Initialize event listeners
function initializeEventListeners() {
    // Sender confirm button
    const senderConfirmBtn = document.getElementById('sender-confirm-btn');
    if (senderConfirmBtn) {
        senderConfirmBtn.addEventListener('click', handleSenderConfirm);
    }

    // Sender input enter key event
    const senderInput = document.getElementById('sender-input');
    if (senderInput) {
        senderInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSenderConfirm();
            }
        });
    }

    // Select all cash checkbox
    const selectAllCash = document.getElementById('select-all-cash');
    if (selectAllCash) {
        selectAllCash.addEventListener('change', handleSelectAllCash);
    }

    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }

    // Copy button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopy);
    }

    // QR Code button
    const qrCodeBtn = document.getElementById('qr-code-btn');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener('click', handleQrCode);
    }

    // Create TX button
    const createTxBtn = document.getElementById('create-tx-btn');
    if (createTxBtn) {
        createTxBtn.addEventListener('click', handleCreateTx);
    }

    // Add send to button (for Create TX mode)
    const addSendToBtn = document.getElementById('add-send-to-btn');
    if (addSendToBtn) {
        addSendToBtn.addEventListener('click', addSendToRow);
    }

    // Clear button (for Create TX mode)
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', handleClear);
    }

    // Copy TX button (for Create TX mode)
    const copyTxBtn = document.getElementById('copy-tx-btn');
    if (copyTxBtn) {
        copyTxBtn.addEventListener('click', handleCopyTx);
    }

    // Make TX button (for Create TX mode)
    const makeTxBtn = document.getElementById('make-tx-btn');
    if (makeTxBtn) {
        makeTxBtn.addEventListener('click', handleMakeTx);
    }

    // Initialize existing Send To FID inputs
    initializeSendToFidInputs();

    // Add click outside to close dropdowns
    document.addEventListener('click', (event) => {
        // Close sender FID dropdown
        const senderDropdown = document.getElementById('fid-dropdown');
        if (senderDropdown && !event.target.closest('.my-fid-container')) {
            senderDropdown.classList.remove('active');
        }
        
        // Close Send To FID dropdowns
        const sendToDropdowns = document.querySelectorAll('.send-to-fid-dropdown');
        sendToDropdowns.forEach(dropdown => {
            if (!event.target.closest('.input-group')) {
                dropdown.classList.remove('active');
            }
        });
    });
}

// Initialize Send To FID inputs
function initializeSendToFidInputs() {
    const fidInputs = document.querySelectorAll('.fid-input');
    fidInputs.forEach(fidInput => {
        // Add enter key event
        fidInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSendToFidSearch(fidInput);
            }
        });
        
        // Add click event for search icon
        const searchIcon = fidInput.parentElement.querySelector('.search-icon');
        if (searchIcon) {
            searchIcon.style.pointerEvents = 'auto'; // 启用点击事件
            searchIcon.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                handleSendToFidSearch(fidInput);
            });
        }
    });
}

// Handle sender confirm button click
async function handleSenderConfirm() {
    const senderInput = document.getElementById('sender-input');
    const searchString = senderInput.value.trim();

    console.log('Handle sender confirm - Search string:', searchString);
    console.log('Handle sender confirm - Search string length:', searchString.length);
    console.log('Handle sender confirm - Search string first char:', searchString[0]);

    if (!searchString) {
        console.log('Handle sender confirm - Empty search string, returning');
        return;
    }

    // Check if input is a valid FID
    if (searchString.length === 34 && (searchString[0] === 'F' || searchString[0] === '3')) {
        console.log('Handle sender confirm - Valid FID format, searching cash');
        await searchCash(searchString);
    } else {
        // Search for FID
        console.log('Handle sender confirm - Not valid FID format, searching FID');
        await searchFid(searchString);
    }
}

// Search for cash
async function searchCash(searchString) {
    try {
        if (!window.API?.URL_TAIL?.CASH_SEARCH) {
            return;
        }
        
        // Show loading overlay
        loadingOverlay.show();
        loadingOverlay.setText(window.strings[window.currentLanguage]?.loadingCash || 'Loading cash...');
        
        const cashUrl = `${getUrlHead()}${window.API.URL_TAIL.CASH_SEARCH}?equals=owner,${searchString}&terms=1,valid,true&sort=lastHeight,desc,birthTxIndex,desc,birthIndex,desc&size=${pageSize}`;
        
        const response = await fetch(cashUrl);
        const data = await response.json();

        if (data?.data) {
            lastValues = data.last;
            await displayCashList(data.data);

            // Check if there are more data available
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                if (data.data.length < pageSize) {
                    // No more data available, disable the button
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.textContent = window.strings[window.currentLanguage]?.noMoreData || 'No More Data';
                } else {
                    // More data available, enable the button
                    loadMoreBtn.disabled = false;
                    loadMoreBtn.textContent = window.strings[window.currentLanguage]?.loadMore || 'Load More';
                }
            }
        }
    } catch (error) {
        showToast(window.strings[window.currentLanguage].error);
    } finally {
        // Hide loading overlay
        loadingOverlay.hide();
    }
}

// Search for FID
async function searchFid(searchString) {
    try {
        if (!window.API?.URL_TAIL?.FID_CID_SEEK) {
            showToast(window.strings[window.currentLanguage]?.apiNotAvailable || 'API not available');
            return;
        }
        
        // Show loading overlay
        loadingOverlay.show();
        loadingOverlay.setText(window.strings[window.currentLanguage]?.searchingFid || 'Searching FID...');
        
        const fidUrl = `${getUrlHead()}${window.API.URL_TAIL.FID_CID_SEEK}?part=${encodeURIComponent(searchString)}&size=${pageSize}`;

        const response = await fetch(fidUrl);
        console.log('Searching FID - Response status:', response.status);
        console.log('Searching FID - Response ok:', response.ok);
        
        const data = await response.json();
        console.log('Searching FID - Full response JSON:', JSON.stringify(data, null, 2));
        console.log('Searching FID - Response data:', data);
        console.log('Searching FID - Data.data:', data?.data);
        console.log('Searching FID - Data.data type:', typeof data?.data);
        console.log('Searching FID - Data.data keys:', data?.data ? Object.keys(data.data) : 'undefined');
        console.log('Searching FID - Data.data length:', data?.data ? Object.keys(data.data).length : 0);

        if (data?.data && Object.keys(data.data).length > 0) {
            console.log('Searching FID - Found results, displaying dropdown');
            displayFidDropdown(Object.keys(data.data));
        } else {
            // No results found
            console.log('Searching FID - No results found');
            showToast(window.strings[window.currentLanguage]?.noFidFound || 'No FID found');
        }
    } catch (error) {
        showToast(window.strings[window.currentLanguage]?.searchFailed || 'Search failed');
    } finally {
        // Hide loading overlay
        loadingOverlay.hide();
    }
}

// Display FID dropdown
function displayFidDropdown(fids) {
    console.log('Display FID dropdown - FIDs to display:', fids);
    console.log('Display FID dropdown - FIDs length:', fids.length);
    
    const dropdown = document.getElementById('fid-dropdown');
    console.log('Display FID dropdown - Dropdown element:', dropdown);
    
    if (!dropdown) {
        console.error('Display FID dropdown - Dropdown element not found');
        return;
    }
    
    dropdown.innerHTML = '';

    // If only one result, auto-select it
    if (fids.length === 1) {
        document.getElementById('sender-input').value = fids[0];
        dropdown.classList.remove('active');
        searchCash(fids[0]);
        return;
    }

    dropdown.classList.add('active');

    fids.forEach((fid, index) => {
        const item = document.createElement('div');
        item.className = 'fid-dropdown-item';
        item.textContent = fid;
        item.addEventListener('click', () => {
            document.getElementById('sender-input').value = fid;
            dropdown.classList.remove('active');
            searchCash(fid);
        });
        dropdown.appendChild(item);
    });
}

// Display cash list
async function displayCashList(cashList) {
    const tableBody = document.getElementById('cash-table-body');
    tableBody.innerHTML = '';

    // Current best block height is the spend height for unspent cash (UTXO) CD.
    const bestHeight = await getBestHeight();

    cashList.forEach(cash => {
        const tr = document.createElement('tr');

        // Store the complete cash object as a data attribute
        tr.setAttribute('data-cash-id', cash.id);
        tr.setAttribute('data-cash-owner', cash.owner || '');
        tr.setAttribute('data-cash-birth-tx-id', cash.birthTxId || '');
        tr.setAttribute('data-cash-birth-index', cash.birthIndex !== null && cash.birthIndex !== undefined ? cash.birthIndex : '');
        tr.setAttribute('data-cash-value', cash.value || '');
        tr.setAttribute('data-cash-birth-time', cash.birthTime || '');
        tr.setAttribute('data-cash-birth-height', cash.birthHeight !== null && cash.birthHeight !== undefined ? cash.birthHeight : '');
        
        // Checkbox cell
        const checkboxTd = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = chosenCashMap.has(cash.id);
        checkbox.addEventListener('change', () => handleCashSelection(cash, checkbox.checked));
        checkboxTd.appendChild(checkbox);
        tr.appendChild(checkboxTd);

        // Value cell
        const valueTd = document.createElement('td');
        valueTd.textContent = formatNumber(cash.value / 100000000, 8);
        tr.appendChild(valueTd);

        // CD cell
        const cdTd = document.createElement('td');
        const cd = Cash.calculateCoinDays(cash.value, cash.birthHeight, bestHeight);
        cdTd.textContent = formatNumber(cd, 8);
        tr.appendChild(cdTd);

        // ID cell
        const idTd = document.createElement('td');
        idTd.textContent = cash.id;
        tr.appendChild(idTd);

        // Birth Time cell
        const birthTimeTd = document.createElement('td');
        const date = new Date(cash.birthTime * 1000);
        birthTimeTd.textContent = date.toLocaleString();
        tr.appendChild(birthTimeTd);

        tableBody.appendChild(tr);
    });

    // Update select all checkbox state
    const selectAllCheckbox = document.getElementById('select-all-cash');
    if (selectAllCheckbox) {
        const allCheckboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
        selectAllCheckbox.checked = allChecked;
    }
}

// Handle cash selection
function handleCashSelection(cash, selected) {
    if (selected) {
        chosenCashMap.set(cash.id, cash);
    } else {
        chosenCashMap.delete(cash.id);
    }
    updateCashSummary();
}

// Handle select all cash
function handleSelectAllCash(event) {
    const tableBody = document.getElementById('cash-table-body');
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        checkbox.checked = event.target.checked;
        
        // Create cash object from row data attributes
        const cash = new Cash();
        cash.id = row.getAttribute('data-cash-id');
        cash.owner = row.getAttribute('data-cash-owner');
        cash.birthTxId = row.getAttribute('data-cash-birth-tx-id');
        const birthIndexAttr = row.getAttribute('data-cash-birth-index');
        cash.birthIndex = birthIndexAttr !== '' ? parseInt(birthIndexAttr) : null;
        cash.value = parseFloat(row.getAttribute('data-cash-value'));
        cash.birthTime = parseInt(row.getAttribute('data-cash-birth-time'));
        const birthHeightAttr = row.getAttribute('data-cash-birth-height');
        cash.birthHeight = birthHeightAttr !== '' && birthHeightAttr !== null ? parseInt(birthHeightAttr) : null;

        // Update chosenCashMap
        if (event.target.checked) {
            chosenCashMap.set(cash.id, cash);
        } else {
            chosenCashMap.delete(cash.id);
        }
    });
    updateCashSummary();
}

// Update cash summary
function updateCashSummary() {
    let totalValue = 0;
    let totalCd = 0;
    
    const bestHeight = getCachedBestHeight();
    chosenCashMap.forEach(cash => {
        totalValue += cash.value;
        const cd = Cash.calculateCoinDays(cash.value, cash.birthHeight, bestHeight);
        totalCd += cd;
    });
    
    // Update display
    const totalValueElement = document.getElementById('total-value');
    const totalCdElement = document.getElementById('total-cd');
    
    if (totalValueElement) {
        totalValueElement.textContent = formatNumber(totalValue / 100000000, 8);
    }
    
    if (totalCdElement) {
        totalCdElement.textContent = formatNumber(totalCd, 8);
    }
}

// Handle load more
async function handleLoadMore() {
    if (!lastValues) return;

    try {
        // Show loading overlay
        loadingOverlay.show();
        loadingOverlay.setText(window.strings[window.currentLanguage]?.loadingMore || 'Loading more...');
        
        const senderInput = document.getElementById('sender-input');
        const searchString = senderInput.value.trim();
        const cashUrl = `${getUrlHead()}${window.API.URL_TAIL.CASH_SEARCH}?equals=owner,${searchString}&terms=1,valid,true&sort=lastHeight,desc,birthTxIndex,desc,birthIndex,desc&size=${pageSize}&after=${lastValues.join(',')}`;
        
        const response = await fetch(cashUrl);
        const data = await response.json();

        if (data?.data) {
            lastValues = data.last;
            // Get existing cash list from table data attributes
            const tableBody = document.getElementById('cash-table-body');
            const existingCashList = Array.from(tableBody.querySelectorAll('tr')).map(row => {
                const cash = new Cash();
                cash.id = row.getAttribute('data-cash-id');
                cash.owner = row.getAttribute('data-cash-owner');
                cash.birthTxId = row.getAttribute('data-cash-birth-tx-id');
                const birthIndexAttr = row.getAttribute('data-cash-birth-index');
                cash.birthIndex = birthIndexAttr !== '' ? parseInt(birthIndexAttr) : null;
                cash.value = parseFloat(row.getAttribute('data-cash-value'));
                cash.birthTime = parseInt(row.getAttribute('data-cash-birth-time'));
                const birthHeightAttr = row.getAttribute('data-cash-birth-height');
                cash.birthHeight = birthHeightAttr !== '' && birthHeightAttr !== null ? parseInt(birthHeightAttr) : null;
                return cash;
            });
            
            // Combine existing and new cash list
            const combinedCashList = existingCashList.concat(data.data);
            await displayCashList(combinedCashList);
            
            // Check if there are more data available
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                if (data.data.length < pageSize) {
                    // No more data available, disable the button
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.textContent = window.strings[window.currentLanguage]?.noMoreData || 'No More Data';
                } else {
                    // More data available, enable the button
                    loadMoreBtn.disabled = false;
                    loadMoreBtn.textContent = window.strings[window.currentLanguage]?.loadMore || 'Load More';
                }
            }
        }
    } catch (error) {
        showToast(window.strings[window.currentLanguage].error);
    } finally {
        // Hide loading overlay
        loadingOverlay.hide();
    }
}

// Cash list to JSON method
function cashListToJson() {
    const selectedCash = Array.from(chosenCashMap.values());
    return selectedCash.map(cash => {
        return {
            owner: cash.owner,
            birthTxId: cash.birthTxId,
            birthIndex: cash.birthIndex,
            value: cash.value,
            birthTime: cash.birthTime
        };
    });
}

// Handle copy
function handleCopy(event) {
    const cashList = cashListToJson();
    if (cashList.length === 0) {
        showToast(window.strings[window.currentLanguage]?.noContentToCopy || 'No content to copy');
        return;
    }
    
    // Convert each cash object to JSON string and concatenate without separator
    const jsonStrings = cashList.map(cash => JSON.stringify(cash));
    const concatenatedString = jsonStrings.join('');
    
    // Use clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(concatenatedString).then(() => {
            showCopyNotification(event);
        }).catch(err => {
            fallbackCopyTextToClipboard(concatenatedString, event);
        });
    } else {
        fallbackCopyTextToClipboard(concatenatedString, event);
    }
}

// Handle QR Code
async function handleQrCode(event) {
    const cashList = cashListToJson();
    if (cashList.length === 0) {
        showToast(window.strings[window.currentLanguage]?.noContentToCopy || 'No content to copy');
        return;
    }
    
    try {
        // Show loading overlay
        loadingOverlay.show();
        loadingOverlay.setText(window.strings[window.currentLanguage]?.loadingQrCode || 'Loading QR code...');
        
        // Convert cash list to JSON string, then to bytes for chunked QR display
        const fullText = cashList.map(cash => JSON.stringify(cash)).join('\n');
        const bytes = new TextEncoder().encode(fullText);

        // Show QR codes using the shared chunked QR code utility
        await showAsQrCodes(bytes);
        
    } catch (error) {
        showToast('Error showing QR code');
    } finally {
        // Hide loading overlay
        loadingOverlay.hide();
    }
}

// Handle Create TX
function handleCreateTx() {
    isCreateTxMode = true;
    
    // Hide Copy, QR Code, Create TX buttons
    const copyBtn = document.getElementById('copy-btn');
    const qrCodeBtn = document.getElementById('qr-code-btn');
    const createTxBtn = document.getElementById('create-tx-btn');
    
    if (copyBtn) copyBtn.style.display = 'none';
    if (qrCodeBtn) qrCodeBtn.style.display = 'none';
    if (createTxBtn) createTxBtn.style.display = 'none';
    
    // Show Clear, Copy TX, Make TX buttons
    const clearBtn = document.getElementById('clear-btn');
    const copyTxBtn = document.getElementById('copy-tx-btn');
    const makeTxBtn = document.getElementById('make-tx-btn');
    
    if (clearBtn) clearBtn.style.display = 'inline-block';
    if (copyTxBtn) copyTxBtn.style.display = 'inline-block';
    if (makeTxBtn) makeTxBtn.style.display = 'inline-block';
    
    // Show hidden containers
    const issueCashContainer = document.querySelector('.issue-cash-container');
    const carvingContainer = document.querySelector('.carving-container');
    const rawTxContainer = document.querySelector('.raw-tx-container');
    
    if (issueCashContainer) issueCashContainer.style.display = 'block';
    if (carvingContainer) carvingContainer.style.display = 'block';
    if (rawTxContainer) rawTxContainer.style.display = 'block';
}

// Add send to row
function addSendToRow() {
    const sendToList = document.getElementById('send-to-list');
    const newRow = document.createElement('div');
    newRow.className = 'send-to-row';
    newRow.innerHTML = `
        <div class="input-group">
            <label data-string-key="to"></label>
            <div class="fid-input-wrapper">
                <input type="text" class="fid-input" placeholder="" data-string-key="enterFid">
                <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                </svg>
            </div>
            <div class="send-to-fid-dropdown fid-dropdown"></div>
        </div>
        <div class="input-group">
            <label data-string-key="amount"></label>
            <input type="number" class="amount-input" placeholder="" data-string-key="enterAmount">
            <span class="currency">F</span>
            <button class="delete-send-to-btn" onclick="deleteSendToRow(this)">×</button>
        </div>
    `;

    // Insert the new row at the end of the list (before the Add button)
    sendToList.appendChild(newRow);
    
    // Add event listeners for the new FID input
    const newFidInput = newRow.querySelector('.fid-input');
    if (newFidInput) {
        // Add enter key event
        newFidInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSendToFidSearch(newFidInput);
            }
        });
        
        // Add click event for search icon
        const searchIcon = newRow.querySelector('.search-icon');
        if (searchIcon) {
            searchIcon.style.pointerEvents = 'auto'; // 启用点击事件
            searchIcon.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                handleSendToFidSearch(newFidInput);
            });
        }
    }
    
    updateStrings();
}

// Delete send to row
function deleteSendToRow(button) {
    const row = button.closest('.send-to-row');
    row.remove();
}

// Handle Send To FID search
async function handleSendToFidSearch(fidInput) {
    const searchString = fidInput.value.trim();

    console.log('Handle Send To FID search - Search string:', searchString);
    console.log('Handle Send To FID search - Search string length:', searchString.length);
    console.log('Handle Send To FID search - Search string first char:', searchString[0]);
    console.log('Handle Send To FID search - FID input element:', fidInput);

    if (!searchString) {
        console.log('Handle Send To FID search - Empty search string, returning');
        return;
    }

    // Check if input is a valid FID
    if (searchString.length === 34 && (searchString[0] === 'F' || searchString[0] === '3')) {
        // Valid FID format, no need to search
        console.log('Handle Send To FID search - Valid FID format, no need to search');
        return;
    } else {
        // Search for FID
        console.log('Handle Send To FID search - Not valid FID format, searching FID');
        await searchSendToFid(fidInput, searchString);
    }
}

// Search for Send To FID
async function searchSendToFid(fidInput, searchString) {
    try {
        if (!window.API?.URL_TAIL?.FID_CID_SEEK) {
            showToast(window.strings[window.currentLanguage]?.apiNotAvailable || 'API not available');
            return;
        }
        
        // Show loading overlay
        loadingOverlay.show();
        loadingOverlay.setText(window.strings[window.currentLanguage]?.searchingFid || 'Searching FID...');
        
        const fidUrl = `${getUrlHead()}${window.API.URL_TAIL.FID_CID_SEEK}?part=${encodeURIComponent(searchString)}&size=${pageSize}`;

        const response = await fetch(fidUrl);
        const data = await response.json();
        console.log('Searching Send To FID - Full response JSON:', JSON.stringify(data, null, 2));
        console.log('Searching Send To FID - Response data:', data);
        console.log('Searching Send To FID - Data.data:', data?.data);
        console.log('Searching Send To FID - Data.data type:', typeof data?.data);
        console.log('Searching Send To FID - Data.data keys:', data?.data ? Object.keys(data.data) : 'undefined');
        console.log('Searching Send To FID - Data.data length:', data?.data ? Object.keys(data.data).length : 0);

        if (data?.data && Object.keys(data.data).length > 0) {
            console.log('Searching Send To FID - Found results, displaying dropdown');
            displaySendToFidDropdown(fidInput, Object.keys(data.data));
        } else {
            // No results found
            console.log('Searching Send To FID - No results found');
            showToast(window.strings[window.currentLanguage]?.noFidFound || 'No FID found');
        }
    } catch (error) {
        showToast(window.strings[window.currentLanguage]?.searchFailed || 'Search failed');
    } finally {
        // Hide loading overlay
        loadingOverlay.hide();
    }
}

// Display Send To FID dropdown
function displaySendToFidDropdown(fidInput, fids) {
    console.log('Display Send To FID dropdown - FIDs to display:', fids);
    console.log('Display Send To FID dropdown - FIDs length:', fids.length);
    console.log('Display Send To FID dropdown - FID input element:', fidInput);
    
    const inputGroup = fidInput.closest('.input-group');
    console.log('Display Send To FID dropdown - Input group:', inputGroup);
    
    const dropdown = inputGroup.querySelector('.send-to-fid-dropdown');
    console.log('Display Send To FID dropdown - Dropdown element:', dropdown);
    
    if (!dropdown) {
        console.error('Display Send To FID dropdown - Dropdown element not found');
        return;
    }
    
    dropdown.innerHTML = '';
    dropdown.classList.add('active');
    console.log('Display Send To FID dropdown - Dropdown activated');

    fids.forEach((fid, index) => {
        console.log(`Display Send To FID dropdown - Creating item ${index + 1}:`, fid);
        const item = document.createElement('div');
        item.className = 'fid-dropdown-item';
        item.textContent = fid;
        item.addEventListener('click', () => {
            console.log('Display Send To FID dropdown - Item clicked:', fid);
            fidInput.value = fid;
            dropdown.classList.remove('active');
        });
        dropdown.appendChild(item);
    });
    
    console.log('Display Send To FID dropdown - Total items created:', fids.length);
}

// Handle copy TX
function handleCopyTx(event) {
    const rawTxContent = document.getElementById('raw-tx-content');
    const copyableSpan = rawTxContent.querySelector('.copyable');
    
    if (!copyableSpan) {
        return;
    }
    
    const content = copyableSpan.getAttribute('data-value');
    
    if (!content) {
        return;
    }
    
    // Decode HTML entities to get the original value
    const decodedContent = decodeHtmlEntities(content);
    
    // Use clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(decodedContent).then(() => {
            showCopyNotification(event);
        }).catch(err => {
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

// Helper function to remove null values from objects recursively
function removeNullValues(obj) {
    if (obj === null || obj === undefined) {
        return undefined;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => removeNullValues(item)).filter(item => item !== undefined);
    }
    
    if (typeof obj === 'object') {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            const cleanedValue = removeNullValues(value);
            if (cleanedValue !== undefined) {
                cleaned[key] = cleanedValue;
            }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }
    
    return obj;
}

// Handle make TX
function handleMakeTx() {
    try {
        // Create RawTxInfo instance
        const rawTxInfo = new RawTxInfo();
        
        // Get sender FID
        const senderInput = document.getElementById('sender-input');
        const senderFid = senderInput.value.trim();
        if (senderFid) {
            rawTxInfo.sender = senderFid;
        }
        
        // Get selected cash for inputs
        if (chosenCashMap.size > 0) {
            const inputs = Array.from(chosenCashMap.values()).map(cash => {
                const cashInput = {
                    birthTxId: cash.birthTxId,
                    birthIndex: cash.birthIndex,
                    birthTime: cash.birthTime,
                    value: cash.value
                };
                
                // If sender is empty, include owner field
                if (!senderFid) {
                    cashInput.owner = cash.owner;
                }
                
                return cashInput;
            });
            rawTxInfo.inputs = inputs;
        }
        
        // Get send to list for outputs
        const sendToRows = document.querySelectorAll('.send-to-row');
        const sendToList = [];
        
        sendToRows.forEach(row => {
            const fidInput = row.querySelector('.fid-input');
            const amountInput = row.querySelector('.amount-input');
            
            if (fidInput && amountInput) {
                const fid = fidInput.value.trim();
                const amount = amountInput.value.trim();
                
                if (fid && amount) {
                    const sendTo = new SendTo();
                    sendTo.fid = fid;
                    sendTo.amount = amount;
                    sendToList.push(sendTo);
                }
            }
        });
        
        if (sendToList.length > 0) {
            rawTxInfo.outputs = sendToList;
        }
        
        // Get carve text for opReturn
        const carvingInput = document.getElementById('carving-input');
        if (carvingInput) {
            const carveText = carvingInput.value.trim();
            if (carveText) {
                rawTxInfo.opReturn = carveText;
            }
        }
        
        // Remove null values before converting to JSON
        const cleanedRawTxInfo = removeNullValues(rawTxInfo);
        
        // Convert to compressed JSON and display
        const rawTxContent = document.getElementById('raw-tx-content');
        if (rawTxContent) {
            const jsonString = JSON.stringify(cleanedRawTxInfo);
            
            // Escape HTML attributes to prevent parsing issues
            const escapedJsonString = escapeHtmlEntities(jsonString);
            
            // Create the content with copyable span and QR code icon
            rawTxContent.innerHTML = `<span class="copyable" data-value="${escapedJsonString}" style="cursor: pointer;">${jsonString}</span><svg class="qr-icon" viewBox="0 0 24 24" width="24" height="24" style="cursor: pointer; margin-left: 8px; vertical-align: middle;">${QR_CODE_ICON_SVG}</svg>`;
            
            // Add click handler for copyable content
            const copyableSpan = rawTxContent.querySelector('.copyable');
            if (copyableSpan) {
                copyableSpan.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    try {
                        const valueToCopy = copyableSpan.getAttribute('data-value');
                        if (!valueToCopy) {
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
                        // Handle copy error silently
                    }
                });
            }
            
            // Add click handler for QR code icon
            const qrIcon = rawTxContent.querySelector('.qr-icon');
            if (qrIcon) {
                qrIcon.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const value = copyableSpan.getAttribute('data-value');
                    
                    if (value) {
                        try {
                            // Show loading overlay
                            loadingOverlay.show();
                            loadingOverlay.setText(window.strings[window.currentLanguage]?.loadingQrCode || 'Loading QR code...');
                            
                            // Decode HTML entities to get the original value
                            const decodedValue = decodeHtmlEntities(value);
                            
                            // Convert string to UTF-8 bytes
                            const encoder = new TextEncoder();
                            const bytes = encoder.encode(decodedValue);
                            
                            // Show QR codes
                            await showAsQrCodes(bytes);
                        } catch (error) {
                            showToast('Error showing QR code');
                        } finally {
                            // Hide loading overlay
                            loadingOverlay.hide();
                        }
                    }
                });
            }
        }
        
    } catch (error) {
        showToast(window.strings[window.currentLanguage]?.error || 'Error');
    }
}

// Handle clear
function handleClear() {
    // Reset create TX mode
    isCreateTxMode = false;
    
    // Show Copy, QR Code, Create TX buttons
    const copyBtn = document.getElementById('copy-btn');
    const qrCodeBtn = document.getElementById('qr-code-btn');
    const createTxBtn = document.getElementById('create-tx-btn');
    
    if (copyBtn) copyBtn.style.display = 'inline-block';
    if (qrCodeBtn) qrCodeBtn.style.display = 'inline-block';
    if (createTxBtn) createTxBtn.style.display = 'inline-block';
    
    // Hide Clear, Copy TX, Make TX buttons
    const clearBtn = document.getElementById('clear-btn');
    const copyTxBtn = document.getElementById('copy-tx-btn');
    const makeTxBtn = document.getElementById('make-tx-btn');
    
    if (clearBtn) clearBtn.style.display = 'none';
    if (copyTxBtn) copyTxBtn.style.display = 'none';
    if (makeTxBtn) makeTxBtn.style.display = 'none';
    
    // Hide create TX containers
    const issueCashContainer = document.querySelector('.issue-cash-container');
    const carvingContainer = document.querySelector('.carving-container');
    const rawTxContainer = document.querySelector('.raw-tx-container');
    
    if (issueCashContainer) issueCashContainer.style.display = 'none';
    if (carvingContainer) carvingContainer.style.display = 'none';
    if (rawTxContainer) rawTxContainer.style.display = 'none';

    // Clear sender input
    const senderInput = document.getElementById('sender-input');
    if (senderInput) {
        senderInput.value = '';
    }

    // Clear cash table
    const tableBody = document.getElementById('cash-table-body');
    tableBody.innerHTML = '';

    // Clear send to list
    const sendToList = document.getElementById('send-to-list');
    sendToList.innerHTML = '';
    
    // Add one empty row with delete button
    const newRow = document.createElement('div');
    newRow.className = 'send-to-row';
    newRow.innerHTML = `
        <div class="input-group">
            <label data-string-key="to"></label>
            <div class="fid-input-wrapper">
                <input type="text" class="fid-input" placeholder="" data-string-key="enterFid">
                <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                </svg>
            </div>
            <div class="send-to-fid-dropdown fid-dropdown"></div>
        </div>
        <div class="input-group">
            <label data-string-key="amount"></label>
            <input type="number" class="amount-input" placeholder="" data-string-key="enterAmount">
            <span class="currency">F</span>
            <button class="delete-send-to-btn" onclick="deleteSendToRow(this)">×</button>
        </div>
    `;
    sendToList.appendChild(newRow);

    // Add event listeners for the new row
    const newFidInput = newRow.querySelector('.fid-input');
    if (newFidInput) {
        // Add enter key event
        newFidInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSendToFidSearch(newFidInput);
            }
        });
        
        // Add click event for search icon
        const searchIcon = newRow.querySelector('.search-icon');
        if (searchIcon) {
            searchIcon.style.pointerEvents = 'auto'; // 启用点击事件
            searchIcon.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                handleSendToFidSearch(newFidInput);
            });
        }
    }

    // Clear raw TX
    const rawTxContent = document.getElementById('raw-tx-content');
    rawTxContent.innerHTML = '';

    // Clear carving input
    const carvingInput = document.getElementById('carving-input');
    if (carvingInput) {
        carvingInput.value = '';
    }

    // Clear global variables
    lastValues = null;
    chosenCashMap.clear();
    sendToList.length = 0;

    // Reset select all checkbox
    const selectAllCash = document.getElementById('select-all-cash');
    if (selectAllCash) {
        selectAllCash.checked = false;
    }
    
    // Reset Load More button state
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = window.strings[window.currentLanguage]?.loadMore || 'Load More';
    }
    
    // Update cash summary
    updateCashSummary();
    
    // Update strings for the new row
    updateStrings();
}

// Format number
function formatNumber(value, decimals) {
    return Number(value).toFixed(decimals).replace(/\.?0+$/, '');
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

// Export functions for Header.js to use
window.MyCash = {
    updateStrings: () => {
        updateStrings();
    }
};

// Make deleteSendToRow globally available for onclick handlers
window.deleteSendToRow = deleteSendToRow; 