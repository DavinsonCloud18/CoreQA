# CoreQA - QA Orchestration & Analytics Platform

**CoreQA** adalah platform manajemen eksekusi pengujian (*Quality Assurance*) tingkat enterprise yang dirancang khusus untuk memenuhi kebutuhan proyek *Capstone* (STSI4440). Sistem ini mengedepankan analitik *real-time*, keamanan, dan keandalan data (*concurrency handling*) dengan antarmuka yang sangat modern dan premium.

## 🚀 Fitur Utama
- **Concurrency & Race Condition Proof:** Sistem *Takeover/Claim* modul eksekusi menggunakan metode Atomic Database Transaction (`prisma.$transaction`).
- **High-Performance Analytics:** Agregasi persentase kelulusan dan deteksi modul penyumbang gagal terbanyak diproses langsung di *Database Layer* menggunakan raw SQL (`$queryRaw`) untuk performa maksimal.
- **JWT Secure Authentication:** Seluruh *endpoint* API dan Halaman Dasbor diproteksi menggunakan standar industri: JWT (JSON Web Token), Cookie Storage, *Bcrypt Password Hashing*, dan intersepsi *Next.js Middleware*.
- **Premium Glassmorphism UI:** Desain antarmuka login dan dasbor yang dirancang sedemikian estetis meniru pantulan cahaya pada kaca transparan (Glassmorphism), menjadikannya terlihat sangat profesional.

## 💻 Tech Stack
Proyek ini mengusung pola arsitektur layaknya *Monorepo* yang terbagi rapi menjadi dua ekosistem besar:

**Backend (API & Database):**
- [NestJS 11](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- JWT & Passport Auth
- TypeScript & Class Validator

**Frontend (Client & UI):**
- [Next.js 15](https://nextjs.org/) (App Router & Server Components)
- [Tailwind CSS 3](https://tailwindcss.com/)
- TypeScript

## 📁 Struktur Direktori
```text
CoreQA/
├── backend/            # Sistem API (Controller, Service, Guard, DB Schema)
├── frontend/           # Aplikasi Web (Pages, Middleware, Glassmorphism UI)
├── guidelines/         # Panduan instalasi dan rancangan konseptual proyek
└── README.md
```

## 🛠 Panduan Instalasi (Local Development)

### Persiapan Lingkungan (Prerequisites)
Sebelum mengunduh dan menjalankan proyek ini, pastikan mesin Anda telah terinstal teknologi berikut:
1. **Node.js** (Minimal versi v20.x LTS) - [Unduh di sini](https://nodejs.org/)
2. **Git** (Untuk version control) - [Unduh di sini](https://git-scm.com/)
3. **PostgreSQL** (Database) - Anda bisa menginstalnya langsung melalui [Situs Resmi PostgreSQL](https://www.postgresql.org/download/) atau menggunakan Docker:
   ```bash
   docker run --name coreqa-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgres
   ```

Setelah semua persyaratan di atas terpenuhi, ikuti instruksi singkat berikut:

### 1. Kloning Repositori & Setup Database
Pertama, buka terminal Anda dan *clone* repositori ini:
```bash
git clone <URL_GITHUB_ANDA>
cd CoreQA
```

Pastikan server **PostgreSQL** Anda sudah menyala. Konfigurasi `.env` bawaan (di dalam folder `backend`) sudah diatur menunjuk ke kredensial lokal berikut:
> `postgresql://postgres:root@localhost:5432/coreqa_db?schema=public`

*(Jika Anda menggunakan username/password database yang berbeda, Anda wajib membuat file `.env` di dalam folder `backend/` dan menyesuaikan variabel `DATABASE_URL`)*.

### 2. Setup & Jalankan Backend
Buka jendela terminal pertama Anda:
```bash
cd backend
npm install
npx prisma db push
npx ts-node prisma/seed.ts  # (Penting) Untuk mengisi ratusan dummy data
npm run start:dev
```
*(Backend akan menyala dan melayani request di port `http://localhost:4000`)*

### 3. Setup & Jalankan Frontend
Buka jendela terminal kedua Anda:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend akan dikompilasi dan menyala di port `http://localhost:3000`)*

### 4. Mari Coba!
Buka *browser* pilihan Anda dan kunjungi halaman Login Dasbor di:
👉 **http://localhost:3000/login**

Gunakan akun *default* hasil dari *seeding script*:
- **Email:** `qa1@coreqa.com`
- **Password:** `password123`

---
*Dikembangkan untuk Tugas STSI4440 - Capstone Project*
