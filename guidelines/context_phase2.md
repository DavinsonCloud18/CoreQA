# PHASE P0 - FOUNDATION & DATABASE DESIGN (ANALYSIS)

## 1. STRATEGI NORMALISASI & MASTER DATA
Pondasi sistem CoreQA menuntut fleksibilitas tinggi. Master data seperti Role, Environment, dan Status harus didesain sebagai entitas mandiri di dalam database, bukan sebagai struktur statis di kode (Enum). Hal ini memastikan bahwa perubahan konfigurasi bisnis di masa depan dapat dilakukan tanpa intervensi rekayasa perangkat lunak (tanpa migrasi database).

## 2. DESAIN RELASIONAL
- **Isolasi Hierarki (Module & Testcase):** Setiap `Module` bertindak sebagai payung besar yang mewadahi banyak `MasterTestcase`. Relasi dijaga dengan *Cascading Deletion* agar kebersihan data terjamin.
- **Fleksibilitas Sesi (Many-to-Many):** Sebuah `Session` pengujian tidak terikat pada satu konfigurasi statis. Sesi memiliki relasi *Many-to-Many* terhadap `Module` (via tabel pivot `SessionModule`), memungkinkan satu sesi untuk memuat komposisi modul yang berbeda-beda sesuai kebutuhan fase *testing*.

## 3. ARSITEKTUR EKSEKUSI (STATE MANAGEMENT)
Pusat rotasi data berada pada tabel `SessionExecution`. Tabel ini merupakan titik temu (pivot) antara `Session`, `MasterTestcase`, `Status`, dan eksekutor (`User`).
- **Uniqueness Constraint:** Sistem harus memberlakukan constraint unik gabungan pada `sessionId` dan `testcaseId`. Aturan ini menjamin bahwa satu testcase di dalam satu sesi hanya memiliki satu *state* status terkini, mendukung *inline editing* tanpa anomali duplikasi baris.

## 4. AUDIT & TRACEABILITY (CLAIM HISTORY)
Tabel `ClaimHistory` dirancang khusus untuk memetakan kepemilikan.
- Ia menyimpan riwayat perpindahan tangan (*takeover*) atas sebuah Modul dalam suatu Sesi.
- Diperlukan mekanisme penanda (seperti atribut `isActive`) untuk secara deterministik melacak siapa pemegang otoritas terakhir atas modul tersebut tanpa perlu kalkulasi temporal yang kompleks.

## 5. PERFORMA KONEKSI
Seluruh *foreign key* dan *constraint* pencarian frekuensi tinggi (seperti `sessionId`, `moduleId`, dan kepemilikan klaim aktif) wajib memiliki indeks di tingkat database. Hal ini mengeliminasi risiko *table scan* linier seiring bertumbuhnya data eksekusi dari waktu ke waktu.

## 6. ENVIRONMENT & DATABASE CONFIGURATION
Untuk mewujudkan fondasi database ini di lingkungan pengembangan (*development*), sistem bergantung pada instrumen variabel lingkungan (file `.env`). Hal ini mutlak untuk mengabstraksi kredensial dan menstandarisasi koneksi.
- **Database Engine:** PostgreSQL.
- **Local Credentials (Dev):** Diarahkan ke `localhost:5432` dengan *username* `postgres` dan *password* `root`. 
- Kredensial ini akan menjadi titik jangkar (*anchor*) bagi Prisma ORM (via `DATABASE_URL` di `.env`) untuk mengeksekusi sinkronisasi skema dan operasi baca/tulis data.