const xlsx = require('xlsx');

const fileBuffer = require('fs').readFileSync('../Template Testcase (1).xlsx');
const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

console.log('Parsed rows:', JSON.stringify(data, null, 2));
