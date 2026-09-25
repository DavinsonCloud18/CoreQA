const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/className="lg:col-span-5/g, 'className="lg:col-span-4');
content = content.replace(/className="lg:col-span-7/g, 'className="lg:col-span-8');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated page.tsx spans successfully.");
