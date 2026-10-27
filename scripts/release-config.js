// Prepares android/ for a Google Play release:
//  - targetSdk/compileSdk 36 (required by Google Play since 31 Aug 2026), minSdk 24
//  - versionCode (must grow with every upload) and versionName
//  - release signing with the upload key (password comes from the KEYSTORE_PASSWORD secret)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const versionCode = parseInt(process.env.VERSION_CODE || '1', 10);
const versionName = pkg.version;

const vars = path.join(root, 'android', 'variables.gradle');
let v = fs.readFileSync(vars, 'utf8');
v = v.replace(/minSdkVersion\s*=\s*\d+/, 'minSdkVersion = 24')
     .replace(/compileSdkVersion\s*=\s*\d+/, 'compileSdkVersion = 36')
     .replace(/targetSdkVersion\s*=\s*\d+/, 'targetSdkVersion = 36');
fs.writeFileSync(vars, v);

const gradle = path.join(root, 'android', 'app', 'build.gradle');
let g = fs.readFileSync(gradle, 'utf8');
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + versionCode).replace(/versionName\s+"[^"]*"/, 'versionName "' + versionName + '"');
if (!g.includes('medinaRelease')) {
  g += `
// ---- medinaRelease: sign release builds with the upload key ----
android {
    signingConfigs {
        release {
            storeFile file(System.getenv("KS_FILE") ?: "../../keystore/alaabalhay-upload.jks")
            storePassword System.getenv("KS_PASS")
            keyAlias "alaabalhay"
            keyPassword System.getenv("KS_PASS")
        }
    }
    buildTypes { release { signingConfig signingConfigs.release } }
}
`;
}
fs.writeFileSync(gradle, g);
console.log('release config: versionCode ' + versionCode + ', versionName ' + versionName + ', targetSdk 36');
console.log(v.split('\n').filter(l => /Sdk|ads|Ads/.test(l)).join('\n'));
