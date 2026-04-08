# GitHub PR Checks Auto Cloud Build

A small Chrome extension that automatically follows Google Cloud Build links from GitHub PR checks pages when the URL contains `check_run_id`.

## Install

1. Open `chrome://extensions` in Chrome.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this folder.
5. Refresh any open GitHub page after loading the extension.

## What it does

- Runs on `https://github.com/*`
- Only acts when the path matches `/pull/<number>/checks`
- Requires `check_run_id` in the query string
- Finds the first link with `href` starting with `https://console.cloud.google.com/cloud-build/builds/`
- Redirects the current tab to that link automatically

## Notes

- The extension watches GitHub’s internal navigation, so it works even if GitHub changes pages without a full reload.
- If you already have the page open, refresh it after loading the extension.
