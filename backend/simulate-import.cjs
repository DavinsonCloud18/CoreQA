const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');

const prisma = new PrismaClient();

async function simulateImport() {
  const fileBuffer = require('fs').readFileSync('../Template Testcase (1).xlsx');
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: '' }); // ensure empty cells are ''

  const groupedData = [];
  let currentTC = null;
  const errors = [];

  let rowNum = 2; // header is row 1
  for (const row of data) {
    const hasMainInfo = row['Modul ID'] || row['Modul ID '] || row['Title'] || row['Nama test case'];

    if (hasMainInfo) {
       if (currentTC) groupedData.push(currentTC);

       currentTC = {
          rowNum,
          moduleCode: row['Modul ID'] || row['Modul ID '],
          title: row['Title'] || row['Nama test case'] || 'Untitled Testcase',
          desc: row['Description'] || row['Deskripsi'] || '',
          severity: row['Severity'] ? `\n[Severity: ${row['Severity']}]` : '',
          priority: row['Priority'] || row['Prioritas'] || 'Medium',
          expectedResult: row['Expected Result'] || '',
          tcIdFromExcel: row['TC ID'] || row['ID'],
          steps: []
       };

       if (currentTC.tcIdFromExcel) {
         const existing = await prisma.masterTestcase.findFirst({
           where: { testcaseId: String(currentTC.tcIdFromExcel) }
         });
         if (existing) {
           errors.push({ row: rowNum, message: `TC ID '${currentTC.tcIdFromExcel}' duplikat / sudah ada di database.` });
         }
       }
    }

    if (currentTC) {
       const action = String(row['Action'] || '').trim();
       const stepExpected = String(row['Step Expected Result'] || '').trim();
       if (action || stepExpected) {
          currentTC.steps.push({
             sequence: currentTC.steps.length + 1,
             action: action,
             expectedResult: stepExpected
          });
       }
    } else {
       if (row['Action'] || row['Step Expected Result']) {
          errors.push({ row: rowNum, message: "Ditemukan step tanpa informasi Testcase induk (Modul ID/Title kosong). Pastikan Action/Expected result tidak tercampur." });
       }
    }
    rowNum++;
  }
  if (currentTC) groupedData.push(currentTC);

  for (const tcData of groupedData) {
    if (!tcData.moduleCode) {
      errors.push({ row: tcData.rowNum, message: "Modul ID tidak boleh kosong." });
      continue;
    }

    const module = await prisma.module.findFirst({
      where: { OR: [{ id: String(tcData.moduleCode) }, { code: String(tcData.moduleCode) }] }
    });

    if (!module) {
      errors.push({ row: tcData.rowNum, message: `Modul '${tcData.moduleCode}' tidak Exist, silahkan tambahkan modul terlebih dahulu.` });
      continue;
    }

    tcData.moduleId = module.id;
  }

  console.log('Validation Errors:', JSON.stringify(errors, null, 2));
}

simulateImport().catch(console.error).finally(() => prisma.$disconnect());
