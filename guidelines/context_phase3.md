# PHASE P1 - EXECUTION & CONCURRENCY LAYER (ANALYSIS)

## 1. PENDEKATAN LAYER EKSEKUSI
Fase ini berfokus pada pembangunan *business logic* inti untuk sistem eksekusi regresi. Backend dituntut tidak hanya untuk melayani request RESTful biasa, melainkan juga menangani inkonsistensi *state* dalam skenario *high-concurrency*.

## 2. MANAJEMEN PENGAMBILAN DATA (READ OPERATIONS)
- **Pagination & Filtering:** Endpoint pengembalian daftar eksekusi testcase tidak boleh mengembalikan *payload* masif dalam satu waktu. Harus ada implementasi *Offset Pagination* (skip/take) yang stabil, yang dikombinasikan dengan kapabilitas penyaringan (*filtering*) multidimensi berdasarkan `moduleId` atau `statusId`.

## 3. CONCURRENCY HANDLING (CLAIM & TAKEOVER)
- **Race Condition Mitigation:** Saat dua QA (atau lebih) berusaha mengambil alih (*takeover*) modul yang sama secara bersamaan, sistem rawan mengalami kondisi *race condition*.
- **Solusi Arsitektur:** Logika "Claim Module" wajib dibungkus sepenuhnya ke dalam *Interactive/Atomic Transaction* di database. Proses pembatalan klaim aktif (*revocation*) dan pembuatan record klaim baru harus berjalan dalam satu kesatuan waktu tertutup. Jika terjadi *failure* pada satu tahapan, seluruh proses di-*rollback*.

## 4. VALIDASI STATUS & INTEGRITAS DATA (WRITE OPERATIONS)
- **Pengecekan State Sesi:** Sistem harus secara mutlak menolak segala modifikasi data (baik eksekusi maupun klaim) apabila sebuah Sesi telah ditandai tertutup (`isOpen: false`).
- **Strict Conditional Validation:** Proses pembaruan status eksekusi memerlukan injeksi *middleware* logika validasi ketat. Ketika sebuah eksekusi ditandai dengan status kritis (misal: "PASSED WITH NOTES"), keberadaan *payload* catatan (`notes`) berubah menjadi *mandatory* (wajib). Validasi ini harus terjadi di lapisan layanan (*service layer*) sebelum koneksi tulis ke database dibuka.