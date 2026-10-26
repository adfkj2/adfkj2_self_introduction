#!/usr/bin/env bash
# Exercise real release directories and symlink swaps; mock only HTTPS responses.
set -Eeuo pipefail

project="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
mkdir -p "$project/.qa"
sandbox="$(mktemp -d "$project/.qa/deploy-tests.XXXXXX")"
cleanup() {
  # Never recursively remove a path outside this test's known workspace folder.
  case "$sandbox" in
    "$project"/.qa/deploy-tests.*) rm -rf -- "$sandbox" ;;
    *) echo 'Unexpected test cleanup path.' >&2; exit 1 ;;
  esac
}
trap cleanup EXIT
mkdir "$sandbox/bin"

cat > "$sandbox/bin/curl" <<'MOCK'
#!/usr/bin/env bash
case "${MOCK_CURL_MODE:-ok}" in
  fail) exit 22 ;;
  wrong-version) echo stale-commit; exit 0 ;;
esac
case "$*" in
  *deploy-version.txt*) cat "$DEPLOY_ROOT/current/deploy-version.txt" ;;
  *)
    [[ "${MOCK_CURL_MODE:-ok}" != homepage-fail ]] || exit 22
    cat "$DEPLOY_ROOT/current/index.html"
    ;;
esac
MOCK
cat > "$sandbox/bin/sleep" <<'MOCK'
#!/usr/bin/env bash
exit 0
MOCK
# Git Bash has no flock. Linux CI exercises the real flock command.
if ! command -v flock >/dev/null; then
  printf '#!/usr/bin/env bash\nexit 0\n' > "$sandbox/bin/flock"
fi
chmod +x "$sandbox/bin/"*
export PATH="$sandbox/bin:$PATH"

commit=0123456789abcdef0123456789abcdef01234567
release="$commit-123-1"
installer="$project/ops/deploy-release.sh"
prepare() {
  site="$sandbox/$1/site"
  fixture="$sandbox/$1/fixture"
  mkdir -p "$site/releases/previous" "$site/incoming/$release" "$fixture"
  printf 'old home\n' > "$site/releases/previous/index.html"
  printf 'new home\n' > "$fixture/index.html"
  printf '%s\n' "$commit" > "$fixture/deploy-version.txt"
  ln -s "$site/releases/previous" "$site/current"
}
pack() {
  tar -czf "$site/incoming/$release/site.tar.gz" -C "$fixture" .
}
invoke() {
  DEPLOY_ROOT="$site" MOCK_CURL_MODE="${1:-ok}" bash "$installer" "$release" "$commit"
}
assert_current() {
  [[ "$(readlink -f "$site/current")" == "$(realpath -e "$site/releases/$1")" ]]
}
expect_failure() {
  if invoke "$1" > "$sandbox/expected-failure.log" 2>&1; then
    echo 'Expected deployment to fail.' >&2
    exit 1
  fi
  assert_current previous
  [[ "$(cat "$site/current/index.html")" == 'old home' ]]
}

prepare success
pack
invoke > "$sandbox/success.log" 2>&1
assert_current "$release"
test -f "$site/releases/previous/index.html"
test ! -e "$site/incoming/$release"
echo 'PASS: valid release switches current and retains the previous version.'

prepare missing-home
rm "$fixture/index.html"
pack
expect_failure ok
echo 'PASS: missing homepage leaves the existing site in place.'

prepare bad-marker
printf 'wrong commit\n' > "$fixture/deploy-version.txt"
pack
expect_failure ok
echo 'PASS: wrong archive version is rejected before switching.'

for mode in fail wrong-version homepage-fail; do
  prepare "$mode"
  pack
  expect_failure "$mode"
  test ! -e "$site/.current-$release"
  echo "PASS: $mode triggers rollback."
done

prepare invalid-release
if DEPLOY_ROOT="$site" bash "$installer" '../escape' "$commit" > "$sandbox/invalid.log" 2>&1; then
  echo 'Invalid release ID was accepted.' >&2
  exit 1
fi
assert_current previous
echo 'PASS: release IDs cannot escape the release directory.'

prepare directory-current
rm "$site/current"
mkdir "$site/current"
printf 'existing directory\n' > "$site/current/index.html"
pack
if invoke > "$sandbox/directory.log" 2>&1; then
  echo 'A real current directory must not be replaced.' >&2
  exit 1
fi
[[ "$(cat "$site/current/index.html")" == 'existing directory' ]]
echo 'PASS: a real document-root directory is preserved.'
