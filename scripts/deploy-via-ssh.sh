#!/usr/bin/env bash
# Runs on the GitHub runner. Only dist/ and the release installer reach the server.
set -Eeuo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST}"
: "${DEPLOY_USER:?Set DEPLOY_USER}"
: "${DEPLOY_PORT:?Set DEPLOY_PORT}"
: "${SSH_PRIVATE_KEY:?Add the SSH_PRIVATE_KEY repository secret}"
: "${SSH_KNOWN_HOSTS:?Add the SSH_KNOWN_HOSTS repository secret}"
: "${GITHUB_SHA:?Missing GITHUB_SHA}"
: "${GITHUB_RUN_ID:?Missing GITHUB_RUN_ID}"
: "${GITHUB_RUN_ATTEMPT:?Missing GITHUB_RUN_ATTEMPT}"
: "${RUNNER_TEMP:?Missing RUNNER_TEMP}"

[[ "$DEPLOY_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]]
[[ "$DEPLOY_USER" =~ ^[a-z_][a-z0-9_-]*$ ]]
[[ "$DEPLOY_PORT" =~ ^[0-9]{1,5}$ ]] && ((10#$DEPLOY_PORT >= 1 && 10#$DEPLOY_PORT <= 65535))
[[ "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ ]]
[[ "$GITHUB_RUN_ID" =~ ^[0-9]+$ && "$GITHUB_RUN_ATTEMPT" =~ ^[0-9]+$ ]]
test -f dist/index.html

release="${GITHUB_SHA}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
remote_dir="/var/www/personal-site/incoming/$release"
ssh_dir="$(mktemp -d "$RUNNER_TEMP/personal-site-ssh.XXXXXX")"
archive="$ssh_dir/site.tar.gz"
trap 'rm -rf -- "$ssh_dir"' EXIT
chmod 700 "$ssh_dir"
printf '%s\n' "$SSH_PRIVATE_KEY" | tr -d '\r' > "$ssh_dir/key"
printf '%s\n' "$SSH_KNOWN_HOSTS" | tr -d '\r' > "$ssh_dir/known_hosts"
chmod 600 "$ssh_dir/key" "$ssh_dir/known_hosts"
unset SSH_PRIVATE_KEY SSH_KNOWN_HOSTS

# Fail locally if the key is encrypted/invalid or the expected host is absent.
ssh-keygen -y -P '' -f "$ssh_dir/key" > /dev/null
known_host="$DEPLOY_HOST"
if [[ "$DEPLOY_PORT" != 22 ]]; then
  known_host="[$DEPLOY_HOST]:$DEPLOY_PORT"
fi
ssh-keygen -F "$known_host" -f "$ssh_dir/known_hosts" > /dev/null

ssh_options=(
  -i "$ssh_dir/key"
  -o IdentitiesOnly=yes
  -o BatchMode=yes
  -o StrictHostKeyChecking=yes
  -o "UserKnownHostsFile=$ssh_dir/known_hosts"
  -o ConnectTimeout=15
  -o ServerAliveInterval=15
  -o ServerAliveCountMax=4
)
target="$DEPLOY_USER@$DEPLOY_HOST"

printf '%s\n' "$GITHUB_SHA" > dist/deploy-version.txt
tar -czf "$archive" -C dist .
ssh "${ssh_options[@]}" -p "$DEPLOY_PORT" "$target" "mkdir -m 700 -- '$remote_dir'"
scp "${ssh_options[@]}" -P "$DEPLOY_PORT" \
  "$archive" ops/deploy-release.sh "$target:$remote_dir/"
ssh "${ssh_options[@]}" -p "$DEPLOY_PORT" "$target" \
  "bash '$remote_dir/deploy-release.sh' '$release' '$GITHUB_SHA'"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  printf 'Deployed `%s` to https://adfkj2.cloud\n' "$GITHUB_SHA" >> "$GITHUB_STEP_SUMMARY"
fi
