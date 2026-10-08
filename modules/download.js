// Download page - renders the release catalog from download-data.js
import { GITHUB_OWNER, SIGNING, RELEASE_FAMILIES, OTHER_DOWNLOADS } from './download-data.js?v=20261008b';

const FILTER_STORAGE_KEY = 'downloadPlatformFilter';
const PLATFORMS = ['all', 'android', 'mac', 'server'];
const PLATFORM_LABEL_KEYS = {
    all: 'dlFilterAll',
    android: 'dlFilterAndroid',
    mac: 'dlFilterMac',
    server: 'dlFilterServer'
};

let currentFilter = loadFilter();

document.addEventListener('DOMContentLoaded', () => {
    render();
    window.addEventListener('languageChanged', render);

    document.addEventListener('click', (e) => {
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

    renderFilters();
    renderReleases();
    renderVerify();
    renderOther();
    renderOld();
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
        <details class="dl-changes"${build.platform !== 'server' ? ' open' : ''}>
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
