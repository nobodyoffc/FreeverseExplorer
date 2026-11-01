#!/bin/sh
# Copy the GitHub release files the download page links to into Tomcat's
# download webapp, so they are served from this site too.
#   mirror.sh LIST DIR [--dry-run] [--prune]
# LIST: one file per line, "<owner> <repo> <tag> <name> <sha256>" (made by
# tools/mirror-list.mjs). Each file lands in DIR/<repo>/<tag>/<name>, and only
# after its SHA-256 matches. Files already in place are skipped.
# --dry-run  only list what would be fetched or pruned
# --prune    remove DIR/<repo>/<tag> folders of listed repos whose tag is no
#            longer listed (files directly in DIR are never touched)
set -eu

usage() { echo "usage: $0 LIST DIR [--dry-run] [--prune]" >&2; exit 2; }
[ $# -ge 2 ] || usage
LIST=$1
DIR=$2
shift 2
DRY=
PRUNE=
for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY=1 ;;
        --prune) PRUNE=1 ;;
        *) usage ;;
    esac
done
[ -f "$LIST" ] || { echo "no list: $LIST" >&2; exit 1; }
[ -d "$DIR" ] || { echo "no folder: $DIR" >&2; exit 1; }

sha() { sha256sum "$1" | cut -d' ' -f1; }

# A field must be one plain path segment.
safe() {
    case "$1" in
        ''|.|..|*/*) return 1 ;;
    esac
}

fetched=0
kept=0
failed=0
while read -r owner repo tag name hash; do
    [ -z "${owner:-}" ] && continue
    case "$owner" in \#*) continue ;; esac
    if ! safe "$owner" || ! safe "$repo" || ! safe "$tag" || ! safe "$name" || [ ${#hash} -ne 64 ]; then
        echo "BAD LINE: $owner $repo $tag $name $hash" >&2
        failed=$((failed + 1))
        continue
    fi
    dest="$DIR/$repo/$tag/$name"
    if [ -f "$dest" ] && [ "$(sha "$dest")" = "$hash" ]; then
        kept=$((kept + 1))
        continue
    fi
    url="https://github.com/$owner/$repo/releases/download/$tag/$name"
    if [ -n "$DRY" ]; then
        echo "would fetch $repo/$tag/$name"
        fetched=$((fetched + 1))
        continue
    fi
    echo "fetch $repo/$tag/$name"
    mkdir -p "$DIR/$repo/$tag"
    if ! curl -fsSL --retry 3 --connect-timeout 20 -o "$dest.part" "$url"; then
        echo "FAILED to download $url" >&2
        rm -f "$dest.part"
        failed=$((failed + 1))
        continue
    fi
    got=$(sha "$dest.part")
    if [ "$got" != "$hash" ]; then
        echo "FAILED: SHA-256 of $repo/$tag/$name is $got, expected $hash" >&2
        rm -f "$dest.part"
        failed=$((failed + 1))
        continue
    fi
    chmod 644 "$dest.part"
    mv -f "$dest.part" "$dest"
    fetched=$((fetched + 1))
done < "$LIST"

if [ -n "$PRUNE" ]; then
    for repo in $(awk '!/^#/ && NF {print $2}' "$LIST" | sort -u); do
        [ -d "$DIR/$repo" ] || continue
        for tagdir in "$DIR/$repo"/*/; do
            [ -d "$tagdir" ] || continue
            tag=$(basename "$tagdir")
            if ! awk -v r="$repo" -v t="$tag" '$2 == r && $3 == t {found = 1} END {exit !found}' "$LIST"; then
                if [ -n "$DRY" ]; then
                    echo "would prune $repo/$tag"
                else
                    echo "prune $repo/$tag"
                    rm -rf "$DIR/$repo/$tag"
                fi
            fi
        done
    done
fi

echo "mirror: $fetched ${DRY:+to }fetch, $kept already in place, $failed failed"
[ "$failed" -eq 0 ]
