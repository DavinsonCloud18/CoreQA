const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.utils.book_new();

const headers = [
  'TC ID',
  'Modul ID',
  'Title',
  'Description',
  'Precondition',
  'Expected Result',
  'Priority',
  'Severity',
  'Action',
  'Step Expected Result'
];

const mockData = [
  {
    'TC ID': 'TC-001',
    'Modul ID': 'MDL-01',
    'Title': 'Login Berhasil',
    'Description': 'Menguji login dengan kredensial valid',
    'Precondition': 'User telah terdaftar dan berada di halaman login',
    'Expected Result': 'Berhasil masuk ke dashboard utama',
    'Priority': 'High',
    'Severity': 'Critical',
    'Action': 'Buka aplikasi dan masukkan email',
    'Step Expected Result': 'Halaman login terbuka dan email terisi'
  },
  {
    'TC ID': '',
    'Modul ID': '',
    'Title': '',
    'Description': '',
    'Precondition': '',
    'Expected Result': '',
    'Priority': '',
    'Severity': '',
    'Action': 'Masukkan password dan klik submit',
    'Step Expected Result': 'Password terisi dan loading selesai'
  }
];

const ws = xlsx.utils.json_to_sheet(mockData, { header: headers });

// Set column widths
ws['!cols'] = [
  { wch: 10 }, // TC ID
  { wch: 10 }, // Modul ID
  { wch: 20 }, // Title
  { wch: 30 }, // Description
  { wch: 30 }, // Precondition
  { wch: 30 }, // Expected Result
  { wch: 10 }, // Priority
  { wch: 10 }, // Severity
  { wch: 40 }, // Action
  { wch: 40 }, // Step Expected Result
];

xlsx.utils.book_append_sheet(wb, ws, 'Template');

xlsx.writeFile(wb, '../frontend/public/Template Testcase.xlsx');
console.log('Template generated successfully!');
