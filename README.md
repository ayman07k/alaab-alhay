# ألعاب الحي · Neighborhood Games

24 Moroccan childhood games in a 3D derb (three.js r128), packaged for Android with Capacitor 8 and AdMob.

- `www/index.html` — the whole game (single file); `www/lib/three.min.js` is copied from npm at build time.
- `admob.config.json` — AdMob App ID; the ad unit IDs are inside `www/index.html` (`ADS_CFG.live`).
- Every push to `main` builds a signed AAB + APK with GitHub Actions (needs the `KEYSTORE_PASSWORD` secret) and saves them to the `builds` branch.
