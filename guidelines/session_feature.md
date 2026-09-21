# CoreQA — Session Feature Guidelines

## 1. Apa itu Session?
Session mewakili sebuah siklus testing, misalnya regression testing atau hotfix testing. Setiap session memiliki:
- **Nama session** (contoh: "v2.0 Full Regression")
- **Environment** (SIT, UAT, PROD, dll.)
- **Periode testing** — `startDate` dan `endDate` (deadline)
- **Status** — TO DO / On Progress / Done
- **isOpen** — boolean yang menandakan apakah session masih aktif

## 2. Membuat Session
Saat membuat session baru:
- User memilih environment, mengisi nama, dan memilih periode testing (start date & end date).
- Ditampilkan list modul yang bisa di-search dan di-select all.
- Modul yang dipilih akan menjadi bagian dari session tersebut. Setiap session punya set modul uniknya sendiri.
- Nama modul diambil dari database master. Di dalam setiap modul terdapat list testcase.
- Setelah session dibuat, sistem otomatis membuat `SessionExecution` untuk setiap testcase dari modul yang dipilih, dengan status awal **TO DO**.

## 3. Execution Log (dulu "Session History")
Menu **Execution Log** di sidebar menampilkan semua session (aktif maupun selesai) dalam bentuk tabel dengan kolom:
- **Name** — nama session
- **Environment** — badge environment
- **Timeline** — tanggal mulai dan selesai (atau "Ongoing" jika belum selesai)
- **Status** — badge berwarna (TO DO / On Progress / Done)
- **% Executed** — badge biru indigo, persentase testcase yang sudah dieksekusi (bukan TO DO)
- **% Passed** — badge hijau emerald, persentase testcase yang PASSED + PASSED WITH NOTES dari total
- **Action** — tombol "View Session" menuju halaman detail session

> **Catatan penting:** 100% Executed ≠ 100% Passed. Dua metrik ini sengaja dipisahkan agar tidak menyesatkan.

## 4. Execution Dashboard
Menu **Execution Dashboard** adalah halaman utama setelah login. Default tampilan adalah **active sessions** (semua session dengan `isOpen: true`).

### Mode Multi-Session (default)
Jika ada lebih dari satu session aktif, atau tidak ada session yang dipilih di dropdown:
- Ditampilkan grid card per session aktif (2 kolom).
- Setiap card menampilkan:
  - Nama session
  - Badge status + badge timeline (start – end) + badge **Working Days Left** (hari kerja tersisa, tidak menghitung weekend). Jika melewati deadline, badge berubah merah: **X Working Days Overdue**.
  - **Donut chart** distribusi status eksekusi. Label langsung tampil tanpa hover, format: `9 passed (64%)`. Hanya status yang punya testcase yang ditampilkan (label + connector line).
  - Tombol **Execute Session** untuk masuk ke halaman eksekusi session tersebut.

### Mode Single-Session
Jika hanya ada satu session aktif, atau user memilih satu session dari dropdown **All Sessions**:
- Layout berubah menjadi dua kolom:
  - **Kiri:** Donut chart distribusi status + badge timeline + badge Working Days Left
  - **Kanan:** Daftar user dan modul yang mereka klaim (Team Assignments), format list sederhana tanpa card
- Ada tombol untuk langsung menuju halaman eksekusi session tersebut.

### Session Selector (Dropdown)
Dropdown di header dashboard berlabel **All Sessions** dan memungkinkan user memilih satu session spesifik untuk dilihat secara detail.

## 5. Halaman Eksekusi (per Session)
Setelah masuk ke halaman eksekusi session:
- Ditampilkan **Summary Cards** di bagian atas, berisi:
  - Total testcase
  - % Executed (sudah dieksekusi, tidak termasuk TO DO)
  - % Passed (PASSED + PASSED WITH NOTES dari total)
- Di bawahnya terdapat **Execution Table** berisi list testcase yang bisa:
  - Di-filter berdasarkan modul (dropdown)
  - Di-filter berdasarkan status testcase
  - Di-search berdasarkan nama testcase
  - Di-klik untuk mengubah status testcase secara manual (Passed, Passed with Notes, Failed, Blocked, To Do)
  - Ditambahkan catatan (notes) per testcase

## 6. Klaim Modul (User Assignment)
- User (QA member) dapat mengklaim modul yang akan mereka kerjakan dalam suatu session.
- Data klaim disimpan di `ClaimHistory` dan ditampilkan di dashboard single-session mode sebagai daftar: **Nama User → Modul yang diklaim**.
- Klaim tidak bersifat eksklusif (bisa lebih dari satu user per modul jika diperlukan).

## 7. Navigasi Sidebar
| Menu | Deskripsi |
|------|-----------|
| **Execution Dashboard** | Halaman utama, overview semua active session |
| **Execution Log** | Daftar semua session (aktif & selesai) dengan metrics |
| **Team** | Manajemen user dan role |