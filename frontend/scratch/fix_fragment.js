const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/ModuleManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file might already have "import { useState, useEffect } from 'react';"
// Or it might have been replaced in my previous script which tried to do it but failed.
// Let's just blindly check and replace.
if (content.includes("import { useState, useEffect } from 'react';")) {
  content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect, Fragment } from 'react';");
}

fs.writeFileSync(file, content, 'utf8');
console.log('Import fixed');
