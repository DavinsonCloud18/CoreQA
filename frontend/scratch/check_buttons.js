const fs = require('fs');
const path = require('path');

const files = [
  'CompleteSessionButton.tsx',
  'EditSessionButton.tsx',
  'CloneSessionButton.tsx',
  'DeleteSessionButton.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, '../src/components/dashboard/', f);
  if (fs.existsSync(filePath)) {
    console.log(`--- ${f} ---`);
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/className="([^"]+)"/g);
    if (matches) {
      matches.forEach(m => console.log(m));
    }
  }
});
