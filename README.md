# <img src="icon/icon-192.png" alt="BBQr Maker" width="32" height="32"> BBQr Maker

> Minimal single-page tool to **convert a PSBT into multi-frame BBQr QR codes** for offline signing.

## Features

* Paste or drop a Base64-encoded PSBT
* One click → split to BBQr parts (multi-frame QR)
* Auto-plays the frames in a loop for easy scanning

No PSBT analysis, no broadcasting – just make the QR.

## Quick start

```bash
git clone …/bbqr-maker.git
cd bbqr-maker
npm install     # installs only bbqr + qrious + dev tools
npm run build   # generates dist/bbqr-maker.bundle.js
npx http-server # or any static server, then open http://localhost:8080
```

You can also open `index.html` directly from disk – everything is bundled.

## Development scripts

| command | purpose |
|---------|---------|
| `npm run build` | build once with webpack |
| `npm run dev`   | watch & rebuild on changes |
| `npm run serve` | simple HTTP server for local testing |

## Project structure

```
src/
  bbqr-maker.js   # main logic
index.html        # UI (very small)
webpack.config.js # build config
```

## Why keep package-lock.json?

It locks exact dependency versions to make builds reproducible. Delete it only if you don't care about that guarantee.

## License

ISC