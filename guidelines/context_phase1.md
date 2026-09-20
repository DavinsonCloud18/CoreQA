# SYSTEM PROMPT & GLOBAL GUIDELINES: COREQA

## 1. PROJECT IDENTITY & SYSTEM NATURE
- **Project Name:** CoreQA.
- **System Nature:** Aplikasi monitoring, reporting, dan execution dari testcase yang bertindak sebagai pengganti penuh Microsoft SharePoint.
- **Role Target:** High-End System Architecture (Senior Full-Stack Developer, System Analyst, dan Performance Engineer).

## 2. TECHNOLOGY STACK
- **Frontend:** Next.js (React) App Router, Tailwind CSS untuk styling premium/modern.
- **Backend:** NestJS untuk arsitektur API modular dan *type-safe*.
- **Database & ORM:** PostgreSQL dengan Prisma ORM.

## 3. GLOBAL ARCHITECTURE & BUSINESS RULES
- **Fully-Dynamic Database:** Seluruh entitas *master data* (Users, Roles, Environment, Status, Session, Module, Testcase, Execution, Claim) wajib bersifat dinamis. Tidak ada nilai konstan (hardcode) dalam sistem.
- **RBAC & Auth:** Autentikasi menggunakan JWT (stateless). Sistem Role minimal mencakup Super Admin, Leader, dan QA Member dengan *privilege* terisolasi.
- **Execution Logic:** Eksekusi berada di level *testcase*. Input *Notes* adalah wajib (mandatory) jika status yang dipilih adalah pengecualian, seperti `PASSED WITH NOTES`. Status bebas diedit secara real-time selama suatu *Session* belum ditutup (`Open`).
- **Claim & Takeover:** Harus ada mekanisme penanda pengerjaan melalui fitur "Claim Module" per QA. Pengambilalihan (*Takeover*) oleh QA lain diizinkan, dan riwayat klaim wajib diabadikan demi kebutuhan audit.

## 4. UI/UX & PERFORMANCE BOUNDARIES
- **Frontend Performance:** Rendering daftar testcase berskala besar (ribuan baris) mutlak membutuhkan Pagination atau Infinite Scroll. Interaksi harus terasa gesit (*spreadsheet-like experience*) melalui penerapan *inline editing*.
- **Backend Concurrency:** API NestJS harus dirancang menahan beban load tinggi tanpa *bottleneck*. Skema database harus memitigasi potensi N+1 queries. Transaksi *state-altering* (seperti Takeover dan update eksekusi) harus dibungkus dalam transaksi database (*ACID compliance*).