// Download page - renders the release catalog from download-data.js
import { GITHUB_OWNER, SIGNING, RELEASE_FAMILIES, OTHER_DOWNLOADS, GUIDE } from './download-data.js?v=20261008d';

const FILTER_STORAGE_KEY = 'downloadPlatformFilter';
const PLATFORMS = ['all', 'android', 'mac', 'server'];
const PLATFORM_LABEL_KEYS = {
    all: 'dlFilterAll',
    android: 'dlFilterAndroid',
    mac: 'dlFilterMac',
    server: 'dlFilterServer'
};

let currentFilter = loadFilter();
// Collapsible sections start closed; the ones opened on this visit stay open across re-renders
const openSections = new Set();

document.addEventListener('DOMContentLoaded', () => {
    render();
    window.addEventListener('languageChanged', render);

    document.addEventListener('toggle', (e) => {
        const key = e.target.dataset && e.target.dataset.section;
        if (!key) return;
        if (e.target.open) openSections.add(key);
        else openSections.delete(key);
    }, true);

    document.addEventListener('click', (e) => {
        const jumpLink = e.target.closest('[data-jump]');
        if (jumpLink) {
            e.preventDefault();
            jumpTo(jumpLink.dataset.jump);
            return;
        }
        const filterBtn = e.target.closest('[data-filter]');
        if (filterBtn) {
            setFilter(filterBtn.dataset.filter);
            return;
        }
        const copyBtn = e.target.closest('[data-copy]');
        if (copyBtn) {
            copyText(copyBtn.dataset.copy, copyBtn);
        }
    });
});

function lang() {
    return window.currentLanguage === 'zh' ? 'zh' : 'en';
}

function t(value) {
    if (value == null) return '';
    return typeof value === 'string' ? value : (value[lang()] ?? value.en ?? '');
}

function esc(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function loadFilter() {
    try {
        const saved = localStorage.getItem(FILTER_STORAGE_KEY);
        if (PLATFORMS.includes(saved)) return saved;
    } catch (e) { /* storage unavailable */ }
    return /android/i.test(navigator.userAgent) ? 'android' : 'all';
}

function openAttr(key) {
    return openSections.has(key) ? ' open' : '';
}

// Scroll to a release family or section, showing all platforms if the filter hides it
function jumpTo(id) {
    let target = document.getElementById(id);
    if (!target || target.hidden) {
        setFilter('all');
        target = document.getElementById(id);
    }
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setFilter(filter) {
    if (!PLATFORMS.includes(filter)) return;
    currentFilter = filter;
    try { localStorage.setItem(FILTER_STORAGE_KEY, filter); } catch (e) { /* ignore */ }
    render();
}

function formatSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function repoUrl(repo) {
    return `https://github.com/${GITHUB_OWNER}/${repo}`;
}

function assetUrl(build, asset) {
    return asset.href || `${repoUrl(build.repo)}/releases/download/${build.tag}/${encodeURIComponent(asset.name)}`;
}

function platformIcon(platform) {
    const icons = {
        android: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.6 9.48l1.84-3.18a.5.5 0 1 0-.87-.5l-1.86 3.22A11.4 11.4 0 0 0 12 8.1c-1.7 0-3.3.33-4.71.92L5.43 5.8a.5.5 0 1 0-.87.5L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>',
        mac: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79a4.43 4.43 0 0 0-3.74 2.27c-1.6 2.77-.41 6.87 1.15 9.12.76 1.1 1.67 2.33 2.85 2.29 1.15-.05 1.58-.74 2.96-.74s1.77.74 2.98.71c1.23-.02 2.01-1.12 2.76-2.22a9.8 9.8 0 0 0 1.25-2.57 3.98 3.98 0 0 1-2.38-3.64zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.75-.96 2.79 1.02.08 2.05-.52 2.68-1.27z"/></svg>',
        server: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 10h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1zm3-6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm0 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>'
    };
    return icons[platform] || '';
}

function copyIcon() {
    return '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 5.5h-7A1.5 1.5 0 0 0 5 7v7a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 15 14V7a1.5 1.5 0 0 0-1.5-1.5z M3 10.5h-.5A1.5 1.5 0 0 1 1 9V2A1.5 1.5 0 0 1 2.5.5h7A1.5 1.5 0 0 1 11 2v.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function render() {
    document.documentElement.lang = lang() === 'zh' ? 'zh-CN' : 'en';
    document.title = `${getString('dlPageTitle')} - Freeverse`;
    document.getElementById('page-title').textContent = getString('dlPageTitle');
    document.getElementById('page-description').textContent = getString('dlPageDescription');

    renderGuide();
    renderFilters();
    renderReleases();
    renderVerify();
    renderOther();
    renderOld();
}

// Diagram geometry, in viewBox units; labels come from GUIDE.nodes
const GUIDE_BOX_H = 64;
const GUIDE_LAYOUT = {
    safe:     { x: 40,  y: 56,  w: 150 },
    qr:       { x: 230, y: 56,  w: 150 },
    freer:    { x: 420, y: 56,  w: 170 },
    mycoins:  { x: 630, y: 56,  w: 140 },
    explorer: { x: 790, y: 56,  w: 140 },
    fapi:     { x: 420, y: 214, w: 170 },
    apip:     { x: 630, y: 214, w: 170 },
    manager:  { x: 814, y: 214, w: 122 },
    es:       { x: 420, y: 318, w: 380, h: 56 },
    fch:      { x: 420, y: 440, w: 160 },
    feip:     { x: 640, y: 440, w: 160 },
    node:     { x: 40,  y: 440, w: 250 }
};
// both: arrowheads at both ends (request and reply); offline: dashed, no network
const GUIDE_EDGES = [
    { d: 'M290 472 H414', label: 'blocks', lx: 352, ly: 463 },
    { d: 'M580 472 H634', text: 'OP_RETURN', lx: 610, ly: 434 },
    { d: 'M500 440 V380' },
    { d: 'M720 440 V380' },
    { d: 'M505 318 V284' },
    { d: 'M715 318 V284' },
    { d: 'M814 246 H806' },
    { d: 'M505 208 V126', both: true, text: 'FUDP', lx: 513, ly: 172, anchor: 'start' },
    { d: 'M700 208 V126', both: true, text: 'HTTP', lx: 708, ly: 172, anchor: 'start' },
    { d: 'M760 208 V184 H860 V126', both: true },
    { d: 'M196 88 H224', both: true, offline: true },
    { d: 'M386 88 H414', both: true, offline: true }
];

function renderGuide() {
    const cards = GUIDE.cards.map(card => `
        <div class="dl-guide-card">
            <h4>${esc(t(card.title))}</h4>
            <p>${esc(t(card.text))}</p>
            <div class="dl-guide-chips">
                ${card.apps.map(id => `<a href="#${esc(id)}" class="dl-chip" data-jump="${esc(id)}">${esc(chipName(id))}</a>`).join('')}
            </div>
        </div>`).join('');

    document.getElementById('dl-guide').innerHTML = `
        <details data-section="guide"${openAttr('guide')}>
            <summary>
                <h3>${esc(getString('dlGuideTitle'))}</h3>
                <span class="dl-guide-intro">${esc(getString('dlGuideIntro'))}</span>
            </summary>
            <div class="dl-guide-body">
                <div class="dl-diagram-scroll">${guideDiagram()}</div>
                <p class="dl-diagram-hint">${esc(getString('dlGuideHint'))}</p>
                <h4 class="dl-guide-which">${esc(getString('dlGuideWhich'))}</h4>
                <div class="dl-guide-cards">${cards}</div>
            </div>
        </details>`;
}

function chipName(id) {
    const family = RELEASE_FAMILIES.find(f => f.id === id);
    return family ? family.name : t(GUIDE.chipNames[id]);
}

function guideDiagram() {
    const boxes = Object.entries(GUIDE_LAYOUT).map(([key, box]) => {
        const node = GUIDE.nodes[key];
        const h = box.h || GUIDE_BOX_H;
        const cx = box.x + box.w / 2;
        const external = !node.jump;
        const inner = `
            <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${h}" rx="8"/>
            <text class="dg-name" x="${cx}" y="${box.y + h / 2 - 4}">${esc(t(node.name))}</text>
            <text class="dg-sub" x="${cx}" y="${box.y + h / 2 + 15}">${esc(t(node.sub))}</text>`;
        return external
            ? `<g class="dg-box external">${inner}</g>`
            : `<a href="#${esc(node.jump)}" class="dg-box" data-jump="${esc(node.jump)}">${inner}</a>`;
    }).join('');

    const edges = GUIDE_EDGES.map(edge => {
        const label = edge.label ? t(GUIDE.edgeLabels[edge.label]) : edge.text;
        return `
            <path class="dg-edge${edge.offline ? ' offline' : ''}" d="${edge.d}"
                marker-end="url(#dg-arrow)"${edge.both ? ' marker-start="url(#dg-arrow)"' : ''}/>
            ${label ? `<text class="dg-label" x="${edge.lx}" y="${edge.ly}" text-anchor="${edge.anchor || 'middle'}">${esc(label)}</text>` : ''}`;
    }).join('');

    const note = t(GUIDE.bands.serversNote);
    return `
    <svg class="dl-diagram" viewBox="0 0 960 544" role="img" aria-labelledby="dg-title">
        <title id="dg-title">${esc(getString('dlGuideTitle'))}</title>
        <defs>
            <marker id="dg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z"/>
            </marker>
        </defs>
        <rect class="dg-band" x="16" y="16" width="928" height="128" rx="12"/>
        <rect class="dg-band" x="16" y="160" width="928" height="368" rx="12"/>
        <text class="dg-band-label" x="40" y="42">${esc(t(GUIDE.bands.devices))}</text>
        <text class="dg-band-label" x="40" y="236">${esc(t(GUIDE.bands.servers))}</text>
        ${note.map((line, i) => `<text class="dg-band-note" x="40" y="${260 + i * 18}">${esc(line)}</text>`).join('')}
        ${edges}
        ${boxes}
    </svg>`;
}

function renderFilters() {
    document.getElementById('dl-filters').innerHTML = PLATFORMS.map(p => `
        <button type="button" class="dl-filter${p === currentFilter ? ' active' : ''}" data-filter="${p}" aria-pressed="${p === currentFilter}">
            ${p === 'all' ? '' : platformIcon(p)}<span>${esc(getString(PLATFORM_LABEL_KEYS[p]))}</span>
        </button>`).join('');
}

function renderReleases() {
    const container = document.getElementById('dl-releases');
    const html = RELEASE_FAMILIES.map(family => {
        const builds = family.builds.filter(b => currentFilter === 'all' || b.platform === currentFilter);
        if (builds.length === 0) return '';
        return `
        <section class="dl-family" id="${esc(family.id)}">
            <div class="dl-family-head">
                <h3>${esc(family.name)}</h3>
                <p>${esc(t(family.tagline))}</p>
            </div>
            <div class="dl-builds${builds.length > 1 ? ' two' : ''}">
                ${builds.map(renderBuild).join('')}
            </div>
        </section>`;
    }).join('');
    container.innerHTML = html || `<p class="dl-empty">${esc(getString('dlNoMatch'))}</p>`;
}

function renderBuild(build) {
    const onGithub = Boolean(build.tag);
    const badges = [
        `<span class="dl-badge platform-${build.platform}">${platformIcon(build.platform)}${esc(getString(PLATFORM_LABEL_KEYS[build.platform]))}</span>`,
        build.prerelease
            ? `<span class="dl-badge pre">${esc(getString('dlPrerelease'))}</span>`
            : (onGithub ? `<span class="dl-badge latest">${esc(getString('dlLatest'))}</span>` : '')
    ].join('');

    const changes = build.changes ? t(build.changes) : [];
    const links = [];
    if (onGithub) {
        links.push(`<a href="${repoUrl(build.repo)}/releases/tag/${encodeURIComponent(build.tag)}" target="_blank" rel="noopener">${esc(getString('dlReleaseNotes'))}</a>`);
        links.push(`<a href="${repoUrl(build.repo)}/releases" target="_blank" rel="noopener">${esc(getString('dlAllReleases'))}</a>`);
    }
    links.push(`<a href="${repoUrl(build.repo)}" target="_blank" rel="noopener">${esc(getString('dlSource'))}</a>`);

    return `
    <article class="dl-build">
        <div class="dl-build-head">
            <div>
                <h4>${esc(build.title)} <span class="dl-version">v${esc(build.version)}</span></h4>
                <div class="dl-meta">${esc(getString('dlReleased'))} ${esc(build.date)}</div>
            </div>
            <div class="dl-badges">${badges}</div>
        </div>

        ${build.requirements ? `<p class="dl-req"><strong>${esc(getString('dlRequirements'))}:</strong> ${esc(t(build.requirements))}</p>` : ''}
        ${!onGithub ? `<p class="dl-note">${esc(getString('dlFromThisSite'))}</p>` : ''}
        ${build.notice ? `<p class="dl-notice">${esc(t(build.notice))}</p>` : ''}

        <div class="dl-assets">
            ${build.assets.map(a => renderAsset(build, a)).join('')}
        </div>

        ${changes.length ? `
        <details class="dl-changes" data-section="changes:${esc(build.repo)}"${openAttr(`changes:${build.repo}`)}>
            <summary>${esc(getString('dlWhatsNew'))} <span class="dl-count">${changes.length}</span></summary>
            <ul>${changes.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
        </details>` : ''}

        <div class="dl-links">${links.join('<span aria-hidden="true">·</span>')}</div>
    </article>`;
}

function renderAsset(build, asset) {
    const hash = asset.sha256 || asset.did;
    const hashLabel = asset.sha256 ? 'SHA-256' : 'DID';
    return `
    <div class="dl-asset">
        <a class="dl-btn" href="${esc(assetUrl(build, asset))}" ${asset.href ? 'download' : 'rel="noopener"'}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V4a1 1 0 0 1 1-1zM5 19h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2z"/></svg>
            <span class="dl-btn-text">
                <span class="dl-file">${esc(asset.name)}</span>
                ${asset.size ? `<span class="dl-size">${esc(formatSize(asset.size))}</span>` : ''}
            </span>
        </a>
        ${asset.label ? `<div class="dl-asset-label">${esc(t(asset.label))}</div>` : ''}
        ${hash ? `
        <div class="dl-hash">
            <span class="dl-hash-label">${hashLabel}</span>
            <code title="${esc(hash)}">${esc(hash)}</code>
            <button type="button" class="dl-copy" data-copy="${esc(hash)}" title="${esc(getString('dlCopyHash'))}" aria-label="${esc(getString('dlCopyHash'))}">${copyIcon()}</button>
        </div>` : ''}
    </div>`;
}

function renderVerify() {
    const cert = SIGNING.android;
    document.getElementById('dl-verify').innerHTML = `
        <h3>${esc(getString('dlVerifyTitle'))}</h3>
        <ul>
            <li>${esc(getString('dlVerifyHash'))}</li>
            <li>${esc(getString('dlVerifyAndroid'))}
                <div class="dl-cert">
                    <div>${esc(cert.subject)}</div>
                    <div class="dl-hash">
                        <span class="dl-hash-label">SHA-256</span>
                        <code>${esc(cert.sha256)}</code>
                        <button type="button" class="dl-copy" data-copy="${esc(cert.sha256)}" title="${esc(getString('dlCopyHash'))}" aria-label="${esc(getString('dlCopyHash'))}">${copyIcon()}</button>
                    </div>
                </div>
            </li>
            <li>${esc(getString('dlVerifyMac'))} <code>${esc(SIGNING.macTeam)}</code></li>
            <li>${esc(getString('dlGithubSlow'))}</li>
        </ul>`;
}

function renderOther() {
    const section = document.getElementById('dl-other');
    const show = currentFilter === 'all' || currentFilter === 'server';
    section.hidden = !show;
    if (!show) return;
    section.innerHTML = `
        <div class="dl-family-head">
            <h3>${esc(getString('dlOtherTitle'))}</h3>
            <p>${esc(getString('dlOtherDescription'))}</p>
        </div>
        <div class="dl-builds two">
            ${OTHER_DOWNLOADS.map(group => `
            <article class="dl-build">
                <h4>${esc(t(group.title))}</h4>
                <div class="dl-assets">
                    ${group.files.map(f => renderAsset({}, f)).join('')}
                </div>
            </article>`).join('')}
        </div>`;
}

function renderOld() {
    document.getElementById('dl-old').innerHTML = `
        <div>
            <h3>${esc(getString('dlOldTitle'))}</h3>
            <p>${esc(getString('dlOldDescription'))}</p>
        </div>
        <a class="dl-old-link" href="download-old.html">${esc(getString('dlOldLink'))} →</a>`;
}

async function copyText(text, button) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); } catch (err) { /* ignore */ }
        textarea.remove();
    }
    button.classList.add('copied');
    button.title = getString('dlCopied');
    setTimeout(() => {
        button.classList.remove('copied');
        button.title = getString('dlCopyHash');
    }, 1500);
}
