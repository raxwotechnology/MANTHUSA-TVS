const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const mainPath = path.join(distDir, 'main.js');
const srcMainPath = path.join(distDir, 'src', 'main.js');

if (fs.existsSync(srcMainPath) && !fs.existsSync(mainPath)) {
  fs.writeFileSync(mainPath, "require('./src/main');\n", 'utf8');
  console.log('Created bridge dist/main.js -> ./src/main');
}
