// Run once after "npx cap add android" (and again whenever you change admob.config.json).
// Adds the AdMob App ID and the advertising-ID permission, and locks the game to portrait.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'admob.config.json'), 'utf8'));
const res = path.join(root, 'android', 'app', 'src', 'main');
const manifestPath = path.join(res, 'AndroidManifest.xml');
const stringsPath = path.join(res, 'res', 'values', 'strings.xml');
if (!fs.existsSync(manifestPath)) { console.error('android/ not found - run "npm run android:add" first.'); process.exit(1); }

let strings = fs.readFileSync(stringsPath, 'utf8');
if (strings.includes('name="admob_app_id"')) strings = strings.replace(/<string name="admob_app_id">[^<]*<\/string>/, `<string name="admob_app_id">${cfg.androidAppId}</string>`);
else strings = strings.replace('</resources>', `    <string name="admob_app_id">${cfg.androidAppId}</string>\n</resources>`);
fs.writeFileSync(stringsPath, strings);

let m = fs.readFileSync(manifestPath, 'utf8');
if (!m.includes('com.google.android.gms.ads.APPLICATION_ID')) {
  m = m.replace(/<application([^>]*)>/, `<application$1>\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="@string/admob_app_id" />`);
}
if (!m.includes('com.google.android.gms.permission.AD_ID')) {
  m = m.replace('<application', '<uses-permission android:name="com.google.android.gms.permission.AD_ID" />\n    <application');
}
if (!m.includes('android:screenOrientation')) {
  m = m.replace(/<activity([^>]*?)android:name="\.MainActivity"/, '<activity$1android:name=".MainActivity"\n            android:screenOrientation="portrait"');
}
fs.writeFileSync(manifestPath, m);
console.log('AndroidManifest.xml and strings.xml updated with App ID ' + cfg.androidAppId);

// Launcher name in the phone's language (default English; Arabic, French, Spanish phones get their own)
const NAMES = { '': 'Neighborhood Games', ar: 'ألعاب الحي', fr: 'Jeux du quartier', es: 'Juegos del barrio' };
for (const [q, n] of Object.entries(NAMES)) {
  const dir = path.join(res, 'res', q ? 'values-' + q : 'values');
  if (!q) {
    let s = fs.readFileSync(stringsPath, 'utf8');
    s = s.replace(/<string name="app_name">[^<]*<\/string>/, `<string name="app_name">${n}</string>`).replace(/<string name="title_activity_main">[^<]*<\/string>/, `<string name="title_activity_main">${n}</string>`);
    fs.writeFileSync(stringsPath, s);
  } else {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'strings.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <string name="app_name">${n}</string>\n    <string name="title_activity_main">${n}</string>\n</resources>\n`);
  }
}
console.log('Localized launcher names written');
