// Copies three.js r128 from node_modules into www/lib so the game works offline.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = path.join(root, 'node_modules', 'three', 'build', 'three.min.js');
if (!fs.existsSync(src)) { console.error('Missing three.min.js - run "npm install" first.'); process.exit(1); }
fs.mkdirSync(path.join(root, 'www', 'lib'), { recursive: true });
fs.copyFileSync(src, path.join(root, 'www', 'lib', 'three.min.js'));
console.log('copied three.min.js');
