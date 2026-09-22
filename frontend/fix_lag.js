const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('c:\\Davin\\Kuliah\\Semester 5\\STSI4440 - Capstone Project\\CoreQA\\frontend\\src\\app', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace full-screen blur with a solid dark overlay
    content = content.replace(/bg-slate-900\/60 backdrop-blur-\[20px\]/g, 'bg-slate-900/90');
    content = content.replace(/bg-slate-900\/40 backdrop-blur-sm/g, 'bg-slate-900/80');
    
    // Some pages might use backdrop-blur-xl on full width containers or sidebars
    // We'll leave the card blurs (backdrop-blur-xl) because they are smaller and usually okay,
    // but the full screen absolute inset-0 is the main killer.
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated', filePath);
    }
  }
});
