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

// One table row for a Text, Sound or Video `cover`: the record id of a FEIP24
// Image, linked to that Image's page, or '' when it is not an id. The page
// shows the Image's current version, since an update of the Image changes it.
// With a `picture` (see Picture below) the row also shows the image itself.
export function renderCoverRow(fieldName, cover, picture) {
    if (typeof cover !== 'string' || !SID_PATTERN.test(cover)) return '';
    const link = `<a href="image-detail.html?id=${cover}" title="${cover}">${shortSid(cover)}</a>`;
    return `
            <tr>
                <th>${escapeHtml(fieldName)}</th>
                <td>${picture ? `${picture.html()}<div>${link}</div>` : link}</td>
            </tr>
        `;
}

// One table row for a Token's `cover` (FEIP20): the record id of a FEIP24 Image
// shown as its logo. A token can never be updated, so the logo is shown only
// when the Image was published by the token's deployer; otherwise whoever owns
// the Image could change another's logo, or a new token could borrow the logo
// of an established one. `image` is the fetched Image record, or null.
// `picture` is the Picture loading that Image.
export function renderTokenCoverRow(fieldName, cover, image, deployer, picture) {
    if (typeof cover !== 'string' || !SID_PATTERN.test(cover)) return '';
    const zh = (window.currentLanguage || 'en') === 'zh';
    let cell;
    if (image && !image.deleted && deployer && image.publisher === deployer) {
        const link = `<a href="image-detail.html?id=${cover}" title="${cover}">${shortSid(cover)}</a>`;
        cell = `${picture ? picture.html() : ''}<div>${link}</div>`;
    } else {
        const why = !image
            ? (zh ? '未找到该图片' : 'no such Image')
            : image.deleted
                ? (zh ? '图片已删除' : 'the Image is deleted')
                : (zh ? '图片不是部署者发布的' : 'the Image was not published by the deployer');
        cell = `<span class="cover-rejected" title="${cover}">${escapeHtml(zh ? '不显示：' : 'Not shown: ')}${escapeHtml(why)}</span>`;
    }
    return `
            <tr>
                <th>${escapeHtml(fieldName)}</th>
                <td>${cell}</td>
            </tr>
        `;
}

function renderThumb(thumb, zh, side) {
    if (thumb === undefined) {
        return `<div class="cover-thumb-note">${zh ? '正在加载图片…' : 'Loading the image…'}</div>`;
    }
    if (thumb.url) {
        return `<img class="cover-thumb" src="${thumb.url}" alt="" style="max-width:${side}px;max-height:${side}px;border-radius:8px;display:block;margin-bottom:6px;">`;
    }
    const buttons = (thumb.web || []).map((u, i) =>
        `<button type="button" class="cover-load-web" data-index="${i}">${escapeHtml(zh ? `从 ${u.host} 加载图片` : `Load the image from ${u.host}`)}</button>`
    ).join(' ');
    const note = thumb.note ? `<div class="cover-thumb-note">${escapeHtml(thumb.note)}</div>` : '';
    return `${buttons ? `<div>${buttons}</div>` : ''}${note}`;
}

// The largest image fetched for a thumbnail; anything larger is not one.
const MAX_IMAGE_BYTES = 20 << 20;

async function sha256x2Hex(bytes) {
    const once = await crypto.subtle.digest('SHA-256', bytes);
    const twice = await crypto.subtle.digest('SHA-256', once);
    return Array.from(new Uint8Array(twice), b => b.toString(16).padStart(2, '0')).join('');
}

// The bytes at `url` if they are the Image's (sha256x2 == did), else a reason.
export async function fetchVerified(url, did, format) {
    let response;
    try {
        response = await fetch(url, { mode: 'cors', referrerPolicy: 'no-referrer' });
    } catch (e) {
        return { error: 'unreachable' };
    }
    if (!response.ok) return { error: `HTTP ${response.status}` };
    // An APIP that lacks the file answers 200 with a JSON error body.
    if ((response.headers.get('content-type') || '').includes('application/json')) return { error: 'not found' };
    const length = Number(response.headers.get('content-length') || 0);
    if (length > MAX_IMAGE_BYTES) return { error: 'too large' };
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_IMAGE_BYTES) return { error: 'too large' };
    if (await sha256x2Hex(bytes) !== did) return { error: 'other bytes' };
    const type = typeof format === 'string' && format.startsWith('image/') ? format : '';
    return { url: URL.createObjectURL(new Blob([bytes], type ? { type } : {})) };
}

// A thumbnail for a FEIP24 Image, fetched only from places the reader already
// talks to: the current APIP's DISK, then mirrors on this site's own origin.
// Bytes are shown only if they hash to the Image's DID. Other websites in its
// locas are returned in `web`, to be fetched only when the reader asks, since
// fetching tells that website who is looking.
// Returns { url } or { web: URL[], note }.
export async function loadVerifiedImage(image, apipUrlHead) {
    const zh = (window.currentLanguage || 'en') === 'zh';
    const did = typeof image?.did === 'string' ? image.did.toLowerCase() : '';
    if (!SID_PATTERN.test(did)) return { web: [], note: zh ? '图片没有有效的 DID。' : 'The Image has no valid DID.' };

    const tried = [];
    if (apipUrlHead) {
        const got = await fetchVerified(`${apipUrlHead}/disk/get/v1?did=${did}`, did, image.format);
        if (got.url) return got;
    }
    const web = [];
    const locas = Array.isArray(image.locas) ? image.locas : [];
    for (const loca of locas) {
        let url;
        try { url = new URL(loca); } catch (e) { continue; }
        // This site's own mirrors are fetched on any scheme it is served on.
        if (url.origin === window.location.origin) {
            const got = await fetchVerified(url.href, did, image.format);
            if (got.url) return got;
            tried.push(`${url.host}: ${got.error}`);
        } else if (url.protocol === 'https:') {
            web.push(url);
        }
    }
    const disks = locas.filter(l => typeof l === 'string' && l.startsWith(SID_PREFIX)).length;
    let note;
    if (web.length) {
        note = zh ? '图片由其他网站提供，仅在你点击时加载，且只有与 DID 相符才显示。'
                  : 'The image is served by another website. It is fetched only when you ask, and shown only if it matches its DID.';
    } else if (disks) {
        note = zh ? '图片只存放在浏览器无法访问的 DISK 服务上（FUDP）。'
                  : 'The image is only on a DISK service a browser cannot reach (FUDP).';
    } else {
        note = zh ? '没有可加载图片的位置。' : 'No location to load the image from.';
    }
    if (tried.length) note += ` (${tried.join('; ')})`;
    return { web, note };
}

// The Image record with this id, or null when there is none or the fetch fails.
export async function fetchImageRecord(apipUrlHead, id) {
    if (typeof id !== 'string' || !SID_PATTERN.test(id)) return null;
    try {
        const url = `${apipUrlHead}${window.API.URL_TAIL.IMAGE_BY_IDS}?ids=${id}`;
        const response = await fetch(url, { method: 'GET', mode: 'cors', headers: { 'Accept': 'application/json' } });
        if (!response.ok) return null;
        const result = await response.json();
        return result?.data?.[id] || null;
    } catch (error) {
        console.error('Error fetching Image:', error);
        return null;
    }
}

// One FEIP24 Image shown on a detail page: a cover, a token's logo, or the
// Image itself. Detail pages only: the check against the DID needs the whole
// file, so a list page would download every row's full original.
// `rerender` redraws the page; html() goes in it and bind() runs after it.
export class Picture {
    constructor(rerender, side = 160) {
        this.rerender = rerender;
        this.side = side;
        this.image = undefined;
        this.thumb = undefined;
    }

    async load(image, apipUrlHead) {
        const zh = (window.currentLanguage || 'en') === 'zh';
        this.image = image;
        if (!image) this.thumb = { web: [], note: zh ? '未找到该图片。' : 'No such Image.' };
        else if (image.deleted) this.thumb = { web: [], note: zh ? '图片已被发布者删除。' : 'The Image was deleted by its publisher.' };
        else this.thumb = await loadVerifiedImage(image, apipUrlHead);
        this.rerender();
    }

    html() {
        return renderThumb(this.thumb, (window.currentLanguage || 'en') === 'zh', this.side);
    }

    // A website mirror is fetched only on the reader's click.
    bind(container) {
        container.querySelectorAll('.cover-load-web').forEach(button => {
            button.addEventListener('click', async () => {
                const url = this.thumb?.web?.[Number(button.dataset.index)];
                if (!url || !this.image?.did) return;
                button.disabled = true;
                const got = await fetchVerified(url.href, this.image.did.toLowerCase(), this.image.format);
                this.thumb = got.url ? got : { ...this.thumb, note: `${url.host}: ${got.error}` };
                this.rerender();
            });
        });
    }
}
