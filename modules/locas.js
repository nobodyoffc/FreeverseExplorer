// Rendering for the `locas` field of Text, Remark, Sound, Image and Video
// (FEIP21-25): where the work's bytes can be downloaded.
//
// Entries are written by the publisher and are untrusted:
// - `(sid)<SID>`        a DISK service; linked to its service page.
// - `fudp://host:port`  a DISK service addressed directly; shown as text.
// - `https://...`       a web mirror; opened only when the user clicks.
// Whatever is downloaded should be checked against the record's DID.

const SID_PREFIX = '(sid)';
const SID_PATTERN = /^[0-9a-fA-F]{64}$/;

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function shortSid(sid) {
    return `${sid.slice(0, 6)}…${sid.slice(-6)}`;
}

function renderLoca(loca) {
    if (typeof loca !== 'string' || loca === '') return '';

    if (loca.startsWith(SID_PREFIX)) {
        const sid = loca.slice(SID_PREFIX.length);
        if (SID_PATTERN.test(sid)) {
            return `<a href="service-detail.html?id=${sid}" title="${escapeHtml(loca)}">DISK ${shortSid(sid)}</a>`;
        }
    }

    let url = null;
    try {
        url = new URL(loca);
    } catch (e) {
        // Not a URL; shown as text below.
    }
    if (url && (url.protocol === 'https:' || url.protocol === 'http:')) {
        // noreferrer: the mirror is a server nobody vouched for, and need
        // not learn which record the reader came from.
        return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer nofollow" title="${escapeHtml(url.href)}">${escapeHtml(url.host)}</a>`;
    }

    return `<span>${escapeHtml(loca)}</span>`;
}

// One table row for a record's locas, or '' when it has none.
export function renderLocasRow(fieldName, locas) {
    if (!Array.isArray(locas) || locas.length === 0) return '';
    const items = locas.map(renderLoca).filter(html => html !== '');
    if (items.length === 0) return '';
    return `
            <tr>
                <th>${escapeHtml(fieldName)}</th>
                <td class="locas-cell">${items.join('<br>')}</td>
            </tr>
        `;
}
