const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', '..', 'client', 'build');
const dest = path.join(__dirname, '..', 'public');

if (!fs.existsSync(src)) {
  console.error('❌ Brak folderu client/build. Najpierw zrób: cd client && npm run build');
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

fs.cpSync(src, dest, { recursive: true });

console.log(`✅ Skopiowano React build: ${src} -> ${dest}`);
