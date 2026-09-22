const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('c:\\Davin\\Kuliah\\Semester 5\\STSI4440 - Capstone Project\\CoreQA\\frontend\\src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // 1. Remove expensive Unsplash backgrounds and use a solid dark gradient instead
    content = content.replace(/bg-\[url\('https:\/\/images\.unsplash\.com[^']+'\)\] bg-cover bg-center bg-fixed/g, 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950');
    content = content.replace(/bg-\[url\('https:\/\/images\.unsplash\.com[^']+'\)\] bg-cover bg-center/g, 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950');
    
    // 2. Remove all remaining backdrop-blurs which are heavy on GPU
    content = content.replace(/backdrop-blur-\w+/g, '');
    content = content.replace(/backdrop-blur-\[[^\]]+\]/g, '');
    
    // 3. Remove expensive full-screen transparent overlays since we now have a solid gradient background
    content = content.replace(/<div className="absolute inset-0 bg-slate-900\/90"><\/div>/g, '');
    content = content.replace(/<div className="absolute inset-0 bg-slate-900\/80"><\/div>/g, '');
    content = content.replace(/<div className="absolute inset-0 bg-slate-900\/40"><\/div>/g, '');
    content = content.replace(/<div className="absolute inset-0 bg-slate-900\/60"><\/div>/g, '');

    // 4. Simplify animations (reduce transition-all to transition-colors or remove entirely on large containers)
    // We leave basic transitions but remove transition-all on heavy components
    // Actually, transition-all is okay if properties aren't changing constantly, but let's remove hover:scale for heavy elements
    content = content.replace(/hover:scale-\[\d\.\d+\]/g, '');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Optimized:', filePath);
    }
  }
});
