// Hash Module - Double SHA-256 hashing for text and files
// All hashing is done locally in the browser - no data is sent to server

document.addEventListener('DOMContentLoaded', function() {
    initHashPage();
});

function initHashPage() {
    setupEventListeners();
    updateStrings();

    // Listen for language changes
    window.addEventListener('languageChanged', updateStrings);
}

function setupEventListeners() {
    const textInput = document.getElementById('text-input');
    const fileInput = document.getElementById('file-input');
    const hashTextBtn = document.getElementById('hash-text-btn');
    const hashFileBtn = document.getElementById('hash-file-btn');
    const copyBtn = document.getElementById('copy-btn');
    const fileName = document.getElementById('file-name');
    const fileInputWrapper = document.querySelector('.file-input-wrapper');

    // Hash text button
    hashTextBtn.addEventListener('click', async () => {
        const text = textInput.value;
        if (!text.trim()) {
            showToast(getString('hashTextEmpty'), 'error');
            return;
        }
        await hashText(text);
    });

    // Hash file button
    hashFileBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            showToast(getString('hashFileEmpty'), 'error');
            return;
        }
        await hashFile(file);
    });

    // File input change - show selected filename
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            fileName.classList.add('selected');
        } else {
            fileName.textContent = getString('noFileSelected');
            fileName.classList.remove('selected');
        }
    });

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileInputWrapper.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Visual feedback for drag and drop
    ['dragenter', 'dragover'].forEach(eventName => {
        fileInputWrapper.addEventListener(eventName, () => {
            fileInputWrapper.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileInputWrapper.addEventListener(eventName, () => {
            fileInputWrapper.classList.remove('drag-over');
        }, false);
    });

    // Handle dropped files
    fileInputWrapper.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            // Only take the first file
            const file = files[0];

            // Update the file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            // Trigger change event to update UI
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);

            showToast(getString('fileSelected') || `File selected: ${file.name}`, 'success');
        }
    }, false);

    // Copy button
    copyBtn.addEventListener('click', () => {
        const hashOutput = document.getElementById('hash-output').textContent;
        navigator.clipboard.writeText(hashOutput).then(() => {
            showToast(getString('copiedToClipboard'), 'success');
        }).catch(() => {
            showToast(getString('copyFailed'), 'error');
        });
    });

    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.addEventListener('click', () => {
        clearAll();
    });
}

async function hashText(text) {
    try {
        // Convert text to bytes
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        // Get selected algorithm
        const algorithm = getSelectedAlgorithm();

        // Calculate hash based on selected algorithm
        const hash = algorithm === 'sha256'
            ? await sha256(data)
            : await doubleSha256(data);

        // Display result
        displayResult(hash);
        showToast(getString('hashSuccess'), 'success');
    } catch (error) {
        console.error('Hash text error:', error);
        showToast(getString('hashError'), 'error');
    }
}

async function hashFile(file) {
    try {
        // Read file as ArrayBuffer
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const data = new Uint8Array(arrayBuffer);

        // Get selected algorithm
        const algorithm = getSelectedAlgorithm();

        // Calculate hash based on selected algorithm
        const hash = algorithm === 'sha256'
            ? await sha256(data)
            : await doubleSha256(data);

        // Display result
        displayResult(hash);
        showToast(getString('hashSuccess'), 'success');
    } catch (error) {
        console.error('Hash file error:', error);
        showToast(getString('hashError'), 'error');
    }
}

function getSelectedAlgorithm() {
    const sha256Radio = document.getElementById('sha256-radio');
    const sha256x2Radio = document.getElementById('sha256x2-radio');

    if (sha256Radio && sha256Radio.checked) {
        return 'sha256';
    } else if (sha256x2Radio && sha256x2Radio.checked) {
        return 'sha256x2';
    }

    // Default to sha256x2 (double SHA-256)
    return 'sha256x2';
}

async function sha256(data) {
    // Single SHA-256
    const hash = await crypto.subtle.digest('SHA-256', data);

    // Convert to hex string
    return arrayBufferToHex(hash);
}

async function doubleSha256(data) {
    // First SHA-256
    const hash1 = await crypto.subtle.digest('SHA-256', data);

    // Second SHA-256
    const hash2 = await crypto.subtle.digest('SHA-256', hash1);

    // Convert to hex string
    return arrayBufferToHex(hash2);
}

function arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
}

function displayResult(hash) {
    const resultSection = document.getElementById('result-section');
    const hashOutput = document.getElementById('hash-output');

    hashOutput.textContent = hash;
    resultSection.style.display = 'block';

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateStrings() {
    // Page title and description
    document.getElementById('page-title').textContent = getString('hashTitle');
    document.getElementById('page-description').textContent = getString('hashDescription');

    // Algorithm section
    document.getElementById('algorithm-title').textContent = getString('hashAlgorithmTitle');
    document.getElementById('sha256-label').textContent = getString('hashAlgorithmSHA256');
    document.getElementById('sha256x2-label').textContent = getString('hashAlgorithmSHA256x2');

    // Text section
    document.getElementById('text-hash-title').textContent = getString('hashTextTitle');
    document.getElementById('text-input-label').textContent = getString('hashTextLabel');
    document.getElementById('text-input').placeholder = getString('hashTextPlaceholder');
    document.getElementById('hash-text-btn').textContent = getString('hashTextButton');

    // File section
    document.getElementById('file-hash-title').textContent = getString('hashFileTitle');
    document.getElementById('file-input-label').textContent = getString('hashFileLabel');

    const fileName = document.getElementById('file-name');
    if (!fileName.classList.contains('selected')) {
        fileName.textContent = getString('noFileSelected');
    }

    document.getElementById('hash-file-btn').textContent = getString('hashFileButton');

    // Result section
    document.getElementById('result-title').textContent = getString('hashResultTitle');
    document.getElementById('hash-result-label').textContent = getString('hashResultLabel');

    // Footer
    const footer = document.querySelector('footer p');
    if (footer) {
        footer.textContent = getString('footer');
    }
}

function getString(key) {
    const lang = window.currentLanguage || 'en';
    return window.strings[lang][key] || key;
}

function clearAll() {
    // Clear text input
    const textInput = document.getElementById('text-input');
    textInput.value = '';

    // Clear file input
    const fileInput = document.getElementById('file-input');
    fileInput.value = '';
    
    // Reset file name display
    const fileName = document.getElementById('file-name');
    fileName.textContent = getString('noFileSelected');
    fileName.classList.remove('selected');

    // Hide result section
    const resultSection = document.getElementById('result-section');
    resultSection.style.display = 'none';

    // Clear hash output
    const hashOutput = document.getElementById('hash-output');
    hashOutput.textContent = '';

    // Reset algorithm selection to default (SHA256x2)
    const sha256x2Radio = document.getElementById('sha256x2-radio');
    if (sha256x2Radio) {
        sha256x2Radio.checked = true;
    }

    showToast(getString('cleared') || 'All cleared', 'success');
}

function showToast(message, type = 'info') {
    // Use the global toast function from utils.js if available
    if (window.showToast) {
        window.showToast(message, type);
        return;
    }

    // Fallback simple toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
