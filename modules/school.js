// School page - plays the 飞人学堂 videos listed in school-data.js
import { GITHUB_OWNER } from './download-data.js?v=20261101a';
import { SCHOOL } from './school-data.js?v=20261101a';

const EPISODES = SCHOOL.series.flatMap(s => s.episodes);
let current = fromHash() || EPISODES[0];

document.addEventListener('DOMContentLoaded', () => {
    render();
    window.addEventListener('languageChanged', render);
    window.addEventListener('hashchange', () => {
        const ep = fromHash();
        if (ep && ep !== current) play(ep, false);
    });

    document.addEventListener('click', (e) => {
        const item = e.target.closest('[data-episode]');
        if (item) {
            e.preventDefault();
            play(EPISODES.find(ep => ep.id === item.dataset.episode), true);
            return;
        }
        const copyBtn = e.target.closest('[data-copy]');
        if (copyBtn) copyText(copyBtn.dataset.copy, copyBtn);
    });
});

function fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    return EPISODES.find(ep => ep.id === id);
}

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

function formatSize(bytes) {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
}

function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// Files are served from this site's mirror (tools/mirror.sh), with the GitHub release as a fallback.
function urls(name) {
    const file = encodeURIComponent(name);
    return {
        local: `/download/${SCHOOL.repo}/${SCHOOL.tag}/${file}`,
        github: `https://github.com/${GITHUB_OWNER}/${SCHOOL.repo}/releases/download/${encodeURIComponent(SCHOOL.tag)}/${file}`
    };
}

function play(ep, start) {
    current = ep;
    history.replaceState(null, '', `#${ep.id}`);
    renderStage();
    renderList();
    const video = document.querySelector('.sc-video');
    if (start && video) video.play().catch(() => { /* autoplay refused: the controls are there */ });
    if (start && window.matchMedia('(max-width: 900px)').matches) {
        document.getElementById('sc-stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function render() {
    document.documentElement.lang = lang() === 'zh' ? 'zh-CN' : 'en';
    document.title = `${getString('scPageTitle')} - Freeverse`;
    document.getElementById('page-title').textContent = getString('scPageTitle');
    document.getElementById('page-description').textContent = getString('scPageDescription');
    renderStage();
    renderList();
    renderVerify();
}

function renderStage() {
    const ep = current;
    const video = urls(ep.video.name);
    const series = SCHOOL.series.find(s => s.episodes.includes(ep));
    document.getElementById('sc-stage').innerHTML = `
        <div class="sc-screen">
            <video class="sc-video" controls playsinline preload="metadata" poster="${esc(urls(ep.cover.name).local)}">
                <source src="${esc(video.local)}" type="video/mp4">
                <source src="${esc(video.github)}" type="video/mp4">
            </video>
        </div>
        <div class="sc-now">
            <div class="sc-now-series">${esc(t(series.title))} · ${esc(ep.id)}</div>
            <h3>${esc(ep.title)}</h3>
            <div class="sc-meta">${esc(formatTime(ep.seconds))} · ${esc(formatSize(ep.video.size))}</div>
            <div class="sc-actions">
                <a class="sc-btn" href="${esc(video.local)}" download>${downloadIcon()}${esc(getString('scDownload'))}</a>
                <a class="sc-alt" href="${esc(video.github)}" rel="noopener">${esc(getString('dlFromGithub'))}</a>
            </div>
            <div class="sc-hash">
                <span class="sc-hash-label">DID</span>
                <code title="${esc(ep.video.did)}">${esc(ep.video.did)}</code>
                <button type="button" class="sc-copy" data-copy="${esc(ep.video.did)}" title="${esc(getString('scCopyDid'))}" aria-label="${esc(getString('scCopyDid'))}">${copyIcon()}</button>
            </div>
        </div>`;
}

function renderList() {
    document.getElementById('sc-list').innerHTML = SCHOOL.series.map(series => `
        <section class="sc-series">
            <div class="sc-series-head">
                <h3>${esc(t(series.title))} <span class="sc-count">${series.episodes.length} ${esc(getString('scEpisodes'))}</span></h3>
                <p>${esc(t(series.note))}</p>
            </div>
            <ol>
                ${series.episodes.map(ep => `
                <li>
                    <a href="#${esc(ep.id)}" data-episode="${esc(ep.id)}" class="sc-item${ep === current ? ' current' : ''}"${ep === current ? ' aria-current="true"' : ''}>
                        <span class="sc-item-id">${esc(ep.id)}</span>
                        <span class="sc-item-title">${esc(ep.title)}</span>
                        <span class="sc-item-time">${esc(formatTime(ep.seconds))}</span>
                    </a>
                </li>`).join('')}
            </ol>
        </section>`).join('');
}

function renderVerify() {
    const repo = `https://github.com/${GITHUB_OWNER}/${SCHOOL.repo}`;
    document.getElementById('sc-verify').innerHTML = `
        <h3>${esc(getString('scVerifyTitle'))}</h3>
        <p>${esc(getString('scVerifyIntro'))}${lang() === 'zh' ? '：' : ': '}${esc(SCHOOL.navigator.cid)} <code>${esc(SCHOOL.navigator.fid)}</code></p>
        <div class="sc-files">
            ${SCHOOL.lists.map(file => `
            <a class="sc-file" href="${esc(urls(file.name).local)}" download>${downloadIcon()}<span>${esc(file.name)}</span></a>`).join('')}
        </div>
        <ul>
            <li>${esc(getString('scVerifyFreer'))}</li>
            <li>${esc(getString('scVerifyCli'))}</li>
            <li>${esc(getString('scLicense'))}</li>
        </ul>
        <div class="sc-links">
            <a href="${esc(repo)}/releases/tag/${encodeURIComponent(SCHOOL.tag)}" target="_blank" rel="noopener">GitHub Release</a>
            <span aria-hidden="true">·</span>
            <a href="${esc(repo)}" target="_blank" rel="noopener">${esc(getString('scSource'))}</a>
        </div>`;
}

function downloadIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V4a1 1 0 0 1 1-1zM5 19h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2z"/></svg>';
}

function copyIcon() {
    return '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 5.5h-7A1.5 1.5 0 0 0 5 7v7a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 15 14V7a1.5 1.5 0 0 0-1.5-1.5z M3 10.5h-.5A1.5 1.5 0 0 1 1 9V2A1.5 1.5 0 0 1 2.5.5h7A1.5 1.5 0 0 1 11 2v.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
        button.title = getString('scCopyDid');
    }, 1500);
}
