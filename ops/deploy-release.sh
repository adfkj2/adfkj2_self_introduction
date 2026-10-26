#!/usr/bin/env bash
# Runs as the unprivileged deploy user on Ubuntu. Nginx keeps serving current/.
set -Eeuo pipefail
umask 022

release="${1:?Usage: deploy-release.sh RELEASE COMMIT_SHA}"
commit="${2:?Missing commit SHA}"
[[ "$commit" =~ ^[a-f0-9]{40}$ ]]
[[ "$release" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ && "$release" == "$commit-"* ]]

# The override is used by isolated filesystem tests, not by the workflow.
root="$(realpath -e "${DEPLOY_ROOT:-/var/www/personal-site}")"
incoming="$root/incoming/$release"
candidate="$root/releases/$release"
current="$root/current"
temporary_link="$root/.current-$release"
archive="$incoming/site.tar.gz"

# This also excludes overlapping manual deployments.
exec 9> "$root/.deploy.lock"
flock -w 60 9

if [[ ! -L "$current" || ! -d "$current" ]]; then
  echo 'current must be a symlink to the existing, working website.' >&2
  exit 1
fi
previous="$(readlink -f "$current")"
if [[ "$previous" != "$root/releases/"* ]]; then
  echo 'current must point to a directory inside releases/.' >&2
  exit 1
fi
if [[ -e "$candidate" || -L "$candidate" ]]; then
  echo 'This release already exists; rerun the workflow to get a new attempt ID.' >&2
  exit 1
fi
test -f "$archive"

activated=false
finished=false
cleanup() {
  status=$?
  trap - EXIT
  if [[ "$activated" == true && "$finished" == false ]]; then
    echo 'Deployment failed; restoring the previous release.' >&2
    if ln -sfnT -- "$previous" "$temporary_link" && mv -Tf -- "$temporary_link" "$current"; then
      echo "Restored $previous" >&2
    else
      echo 'Automatic rollback failed; inspect current immediately.' >&2
    fi
    status=1
  fi
  rm -f -- "$temporary_link" "$archive" "$incoming/deploy-release.sh"
  rmdir -- "$incoming" 2>/dev/null || true
  exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP

mkdir -m 755 -- "$candidate"
tar -xzf "$archive" -C "$candidate" --no-same-owner --no-same-permissions
test -s "$candidate/index.html"
test "$(cat "$candidate/deploy-version.txt")" = "$commit"
find "$candidate" -type d -exec chmod 755 {} +
find "$candidate" -type f -exec chmod 644 {} +

ln -s -- "$candidate" "$temporary_link"
# Mark before the rename so interruption immediately after it also rolls back.
activated=true
mv -Tf -- "$temporary_link" "$current"

# Loopback tests the actual Nginx document root and validates the real TLS cert.
# A version marker prevents an unrelated/default virtual host from passing.
healthy=false
for attempt in 1 2 3; do
  if version="$(curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
    --resolve adfkj2.cloud:443:127.0.0.1 \
    --header 'Cache-Control: no-cache' \
    "https://adfkj2.cloud/deploy-version.txt?release=$release")" \
    && [[ "$version" == "$commit" ]] \
    && curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
      --resolve adfkj2.cloud:443:127.0.0.1 \
      'https://adfkj2.cloud/' > /dev/null; then
    healthy=true
    break
  fi
  if [[ "$attempt" != 3 ]]; then sleep 2; fi
done
if [[ "$healthy" != true ]]; then
  echo 'The HTTPS homepage or version marker failed its health check.' >&2
  exit 1
fi

finished=true
echo "Deployed $release successfully. Previous release retained at $previous"
