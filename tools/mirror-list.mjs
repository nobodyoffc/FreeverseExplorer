// Prints the mirror list for tools/mirror.sh: every GitHub release file the
// download and 学堂 pages link to, as "<owner> <repo> <tag> <name> <sha256>".
//   node tools/mirror-list.mjs > mirror.txt
import { GITHUB_OWNER, RELEASE_FAMILIES, OTHER_DOWNLOADS } from '../modules/download-data.js';
import { SCHOOL } from '../modules/school-data.js';

const GITHUB_RELEASE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/([^/]+)$/;

const lines = [];
const missing = [];

function add(owner, repo, tag, name, sha256) {
    if (!/^[0-9a-f]{64}$/.test(sha256 || '')) {
        missing.push(`${repo}/${tag}/${name}`);
        return;
    }
    lines.push([owner, repo, tag, name, sha256].join(' '));
}

function addAsset(asset, build) {
    if (asset.href) {
        const m = asset.href.match(GITHUB_RELEASE);
        if (m) add(m[1], m[2], decodeURIComponent(m[3]), decodeURIComponent(m[4]), asset.sha256);
    } else if (build && build.tag) {
        add(GITHUB_OWNER, build.repo, build.tag, asset.name, asset.sha256);
    }
}

for (const family of RELEASE_FAMILIES) {
    for (const build of family.builds) {
        for (const asset of build.assets) addAsset(asset, build);
    }
}
for (const group of OTHER_DOWNLOADS) {
    for (const file of group.files) addAsset(file, null);
}

// 学堂: the videos, their covers and the signed lists of one FreerSchool release.
for (const file of SCHOOL.lists) add(GITHUB_OWNER, SCHOOL.repo, SCHOOL.tag, file.name, file.sha256);
for (const series of SCHOOL.series) {
    for (const ep of series.episodes) {
        add(GITHUB_OWNER, SCHOOL.repo, SCHOOL.tag, ep.video.name, ep.video.sha256);
        add(GITHUB_OWNER, SCHOOL.repo, SCHOOL.tag, ep.cover.name, ep.cover.sha256);
    }
}

if (missing.length) {
    console.error(`No SHA-256, not mirrored: ${missing.join(', ')}`);
    process.exit(1);
}
console.log(lines.join('\n'));
