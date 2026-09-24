const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/testcases/testcases.service.ts';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `  async importExcel(userId: string, fileBuffer: Buffer) {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    const groupedData = [];
    let currentTC: any = null;
    const errors: { row: number, message: string }[] = [];

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
            severity: row['Severity'] || 'Minor',
            priority: row['Priority'] || row['Prioritas'] || 'Sedang',
            expectedResult: row['Expected Result'] || '',
            tcIdFromExcel: row['TC ID'] || row['ID'],
            steps: []
         };

         if (currentTC.tcIdFromExcel) {
           const existing = await this.prisma.masterTestcase.findFirst({
             where: { testcaseId: String(currentTC.tcIdFromExcel) }
           });
           if (existing) {
             errors.push({ row: rowNum, message: \`TC ID '\${currentTC.tcIdFromExcel}' duplikat / sudah ada di database.\` });
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

    // Validate modules
    for (const tcData of groupedData) {
      if (!tcData.moduleCode) {
        errors.push({ row: tcData.rowNum, message: "Modul ID tidak boleh kosong." });
        continue;
      }

      const module = await this.prisma.module.findFirst({
        where: { OR: [{ id: String(tcData.moduleCode) }, { code: String(tcData.moduleCode) }] }
      });

      if (!module) {
        errors.push({ row: tcData.rowNum, message: \`Modul '\${tcData.moduleCode}' tidak ada pada sistem, tolong perbaiki atau tambah modul '\${tcData.moduleCode}' pada Menu Modules.\` });
        continue;
      }

      tcData.moduleId = module.id;
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation Failed', errors });
    }`;

const newLogic = `  async importExcel(userId: string, fileBuffer: Buffer) {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    const groupedData = [];
    let currentTC: any = null;
    const errors: { row: number, message: string }[] = [];

    let rowNum = 2; // header is row 1
    for (const row of data) {
      const tcIdRaw = row['TC ID'] || row['ID'];
      const moduleCodeRaw = row['Modul ID'] || row['Modul ID '];
      const titleRaw = row['Title'] || row['Nama test case'];
      const expectedResultRaw = row['Expected Result'];
      
      const hasMainInfo = tcIdRaw || moduleCodeRaw || titleRaw || expectedResultRaw;

      if (hasMainInfo) {
         if (currentTC) groupedData.push(currentTC);

         currentTC = {
            rowNum,
            moduleCode: moduleCodeRaw,
            title: titleRaw,
            desc: row['Description'] || row['Deskripsi'] || '',
            severity: row['Severity'] || 'Minor',
            priority: row['Priority'] || row['Prioritas'] || 'Sedang',
            expectedResult: expectedResultRaw,
            tcIdFromExcel: tcIdRaw,
            steps: []
         };

         if (!currentTC.tcIdFromExcel) errors.push({ row: rowNum, message: "TC ID wajib diisi." });
         if (!currentTC.moduleCode) errors.push({ row: rowNum, message: "Modul ID wajib diisi." });
         if (!currentTC.title) errors.push({ row: rowNum, message: "Title wajib diisi." });
         if (!currentTC.expectedResult) errors.push({ row: rowNum, message: "Expected Result wajib diisi." });

         if (currentTC.tcIdFromExcel) {
           const existing = await this.prisma.masterTestcase.findFirst({
             where: { testcaseId: String(currentTC.tcIdFromExcel) }
           });
           if (existing) {
             errors.push({ row: rowNum, message: \`TC ID '\${currentTC.tcIdFromExcel}' duplikat / sudah ada di database.\` });
           }
         }
      }

      if (currentTC) {
         const action = String(row['Action'] || '').trim();
         const stepExpected = String(row['Step Expected Result'] || '').trim();
         
         if (action || stepExpected) {
            if (!action) errors.push({ row: rowNum, message: "Action wajib diisi pada step." });
            if (!stepExpected) errors.push({ row: rowNum, message: "Step Expected Result wajib diisi pada step." });
            
            if (action && stepExpected) {
              currentTC.steps.push({
                 sequence: currentTC.steps.length + 1,
                 action: action,
                 expectedResult: stepExpected
              });
            }
         }
      } else {
         if (row['Action'] || row['Step Expected Result']) {
            errors.push({ row: rowNum, message: "Ditemukan step tanpa informasi Testcase induk. Pastikan TC ID/Modul ID diisi." });
         }
      }
      rowNum++;
    }
    if (currentTC) groupedData.push(currentTC);

    // Validate modules and steps length
    for (const tcData of groupedData) {
      if (tcData.steps.length === 0) {
        errors.push({ row: tcData.rowNum, message: \`Testcase '\${tcData.title || tcData.tcIdFromExcel}' tidak memiliki step satupun. Action dan Step Expected Result wajib diisi.\` });
      }

      if (tcData.moduleCode) {
        const module = await this.prisma.module.findFirst({
          where: { OR: [{ id: String(tcData.moduleCode) }, { code: String(tcData.moduleCode) }] }
        });

        if (!module) {
          errors.push({ row: tcData.rowNum, message: \`Modul '\${tcData.moduleCode}' tidak ada pada sistem, tolong perbaiki atau tambah modul '\${tcData.moduleCode}' pada Menu Modules.\` });
        } else {
          tcData.moduleId = module.id;
        }
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation Failed', errors });
    }`;

if (content.includes(oldLogic)) {
    content = content.replace(oldLogic, newLogic);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Update successful');
} else {
    console.log('Could not match old logic');
}
