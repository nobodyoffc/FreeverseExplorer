const getUrlHead = () => window.API.urlHead;
const urlTail = window.API.URL_TAIL.NODE_LIST;
let loadingOverlay;

const DISPLAY_FIELDS = ['addr', 'subver', 'pingtime', 'lastrecv'];

document.addEventListener('DOMContentLoaded', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!window.LoadingOverlay) {
        const script = document.createElement('script');
        script.src = '/modules/LoadingOverlay.js';
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    loadingOverlay = new LoadingOverlay();
    loadingOverlay.show();
    loadingOverlay.setText('Loading Node List...');

    const nodes = await fetchNodeList();

    loadingOverlay.hide();

    if (!nodes || nodes.length === 0) {
        const content = document.getElementById('node-list-content');
        if (content) content.innerHTML = '<p style="text-align:center;color:#888;">No nodes found.</p>';
        return;
    }

    const headerTitle = window.strings[window.currentLanguage].siteTitle;
    const pageTitle = window.strings[window.currentLanguage].fieldNames.nodeList;
    document.title = `${headerTitle} - ${pageTitle}`;

    displayNodeList(nodes);

    window.addEventListener('languageChanged', (event) => {
        if (event.detail && event.detail.lang) {
            const currentLang = event.detail.lang;
            const title = window.strings[currentLang]?.fieldNames?.nodeList || 'Node List';
            document.title = `${window.strings[currentLang].siteTitle} - ${title}`;
            displayNodeList(nodes);
        }
    });
});

async function fetchNodeList() {
    try {
        const url = getUrlHead() + urlTail;
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

        if (result?.code === 0 && result?.data) {
            return Array.isArray(result.data) ? result.data : [result.data];
        }
        if (Array.isArray(result)) {
            return result;
        }
        return null;
    } catch (error) {
        console.error('Error fetching Node List:', error);
        return null;
    }
}

function getFieldName(field) {
    const currentLang = window.currentLanguage || 'en';
    return window.strings[currentLang]?.fieldNames?.[field] ||
           field.replace(/([A-Z])/g, ' $1').trim();
}

function formatValue(field, value) {
    if (value === null || value === undefined) return '-';

    if (field === 'lastrecv') {
        const date = new Date(value * 1000);
        return date.toLocaleString(undefined, {
            year: '2-digit', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
    }

    if (field === 'pingtime') {
        return (typeof value === 'number') ? value.toFixed(4) + 's' : String(value);
    }

    return String(value);
}

function displayNodeList(nodes) {
    const content = document.getElementById('node-list-content');
    if (!content) return;

    let html = '<table class="detail-table-unified">';
    html += '<thead><tr>';
    DISPLAY_FIELDS.forEach(field => {
        const name = getFieldName(field);
        html += `<th>${name.charAt(0).toUpperCase() + name.slice(1)}</th>`;
    });
    html += '</tr></thead><tbody>';

    nodes.forEach(node => {
        html += '<tr>';
        DISPLAY_FIELDS.forEach(field => {
            const raw = node[field];
            const display = formatValue(field, raw);
            const copyVal = (raw === null || raw === undefined) ? '' : String(raw);
            html += `<td><span class="copyable" data-value="${copyVal}" style="cursor:pointer;">${display}</span></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    content.innerHTML = html;

    addCopyHandlers();
}

function addCopyHandlers() {
    document.querySelectorAll('.copyable').forEach(span => {
        span.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                const valueToCopy = span.getAttribute('data-value');
                if (!valueToCopy) return;
                await navigator.clipboard.writeText(String(valueToCopy));
                const copyMessage = document.createElement('div');
                copyMessage.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY - 30}px;transform:translateX(-50%);padding:4px 8px;background:rgba(0,0,0,0.8);color:white;border-radius:4px;z-index:1000;font-size:12px;pointer-events:none;`;
                copyMessage.textContent = (window.currentLanguage === 'zh') ? '已复制' : 'Copied';
                document.body.appendChild(copyMessage);
                setTimeout(() => copyMessage.remove(), 1000);
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        });
    });
}

window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && window.strings[savedLang]) {
        window.currentLanguage = savedLang;
        if (typeof window.updateAllStrings === 'function' && !window.Header) {
            window.updateAllStrings();
        }
    }
});
