# PANDUAN MENJALANKAN PROYEK COREQA

Proyek CoreQA mengusung arsitektur *monorepo* sederhana yang memisahkan aplikasi menjadi dua bagian utama: **Backend (NestJS)** dan **Frontend (Next.js)**. Untuk memfungsikan aplikasi secara penuh, Anda wajib menjalankan kedua layanan tersebut secara bersamaan.

## 1. Persiapan Awal (Prasyarat)
Sebelum menjalankan layanan, pastikan:
- **Node.js** terinstal di mesin Anda (versi LTS disarankan).
- Server **PostgreSQL** menyala secara lokal di `localhost:5432` dengan *username* `postgres` dan *password* `root` (sesuai konfigurasi `.env`).

## 2. Menjalankan Backend (NestJS & Prisma)
Backend bertugas menyediakan API untuk analitik dan pengelolaan eksekusi (*Execution Layer*), serta menjadi gerbang utama menuju database.

1. Buka terminal baru (Terminal 1).
2. Pindah ke direktori `backend`:
   ```bash
   cd backend
   ```
3. (Opsional) Jika baru pertama kali membuka repo di perangkat baru, jalankan:
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run start:dev
   ```
5. Tunggu hingga terminal menampilkan indikator sukses. Backend Anda kini menyala dan menanti *request* di `http://localhost:4000`.

## 3. Menjalankan Frontend (Next.js)
Frontend bertugas menampilkan antarmuka dasbor interaktif (*Dashboard UI*) yang menarik data dari Backend.

1. Buka tab/jendela terminal baru (Terminal 2). Pastikan terminal pertama (backend) tetap berjalan.
2. Pindah ke direktori `frontend`:
   ```bash
   cd frontend
   ```
3. (Opsional) Jika baru pertama kali membuka repo di perangkat baru, jalankan:
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Tunggu hingga proses kompilasi selesai. Frontend Anda kini menyala dan dapat diakses di `http://localhost:3000`.

## 4. Simulasi Penggunaan
Buka *browser* pilihan Anda, lalu navigasikan ke tautan dasbor sesi pengujian:

> **`http://localhost:3000/dashboard/sessions/<ID_SESI>`**  
> *(Ganti `<ID_SESI>` dengan ID UUID riil dari tabel `sessions` di database Anda, misalnya `12345`)*

Jika konfigurasi jaringan dan database Anda tersambung dengan benar, Anda akan melihat antarmuka analitik yang menyajikan visualisasi ringkasan kelulusan (*Passed/Failed/Untested*) dan daftar modul dengan tingkat kegagalan tertinggi.
