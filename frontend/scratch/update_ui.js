const fs = require('fs');
const path = require('path');

const fileSidebar = path.join(__dirname, '../src/components/dashboard/Sidebar.tsx');
let sidebar = fs.readFileSync(fileSidebar, 'utf8');
sidebar = sidebar.replace(
  "const isActive = path === '/dashboard' ? pathname === path : pathname?.startsWith(path);",
  "let isActive = path === '/dashboard' ? pathname === path : pathname?.startsWith(path);\n    if (path === '/dashboard/sessions' && pathname?.startsWith('/dashboard/execution')) {\n      isActive = true;\n    }"
);
fs.writeFileSync(fileSidebar, sidebar, 'utf8');
console.log("Updated Sidebar.tsx");

const fileDash = path.join(__dirname, '../src/app/dashboard/page.tsx');
let dash = fs.readFileSync(fileDash, 'utf8');

dash = dash.replace(
  '<LogoutButton />\r\n            </div>\r\n          </header>\r\n\r\n          \r\n          <div className="flex justify-between items-center mb-1 pr-2 mt-4">\r\n            <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>\r\n            <SessionSelector currentSession={resolvedParams.session} />',
  '<SessionSelector currentSession={resolvedParams.session} />\r\n               <LogoutButton />\r\n            </div>\r\n          </header>\r\n\r\n          \r\n          <div className="flex justify-between items-center mb-1 pr-2 mt-4">\r\n            <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>'
);

dash = dash.replace(
  '<LogoutButton />\n            </div>\n          </header>\n\n          \n          <div className="flex justify-between items-center mb-1 pr-2 mt-4">\n            <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>\n            <SessionSelector currentSession={resolvedParams.session} />',
  '<SessionSelector currentSession={resolvedParams.session} />\n               <LogoutButton />\n            </div>\n          </header>\n\n          \n          <div className="flex justify-between items-center mb-1 pr-2 mt-4">\n            <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>'
);

fs.writeFileSync(fileDash, dash, 'utf8');
console.log("Updated page.tsx header");
