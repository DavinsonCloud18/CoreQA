# PHASE P2 & P3 - DASHBOARD & ANALYTICS (ANALYSIS)

## 1. TUJUAN ANALITIK VISUAL
Fase ini bertugas menyajikan abstraksi data berdimensi tinggi kepada tingkat manajerial (*Leader*). Fokus utamanya adalah ekstraksi metrik esensial (seperti persentase kelulusan komprehensif, dan identifikasi modul penyumbang tingkat kegagalan tertinggi) untuk mempercepat siklus pengambilan keputusan.

## 2. OPTIMASI KOMPUTASI BACKEND (MEMORY MANAGEMENT)
- **Bottleneck Node.js:** Salah satu *anti-pattern* utama dalam Node.js adalah memuat seluruh baris tabel (puluhan ribu data eksekusi) ke *heap memory* hanya untuk melakukan kalkulasi statistik matematis (*reduce/map*).
- **Pendekatan Raw SQL & Database Level Computation:** Seluruh komputasi persentase (*failed rate*) dan pengurutan (*sorting*) wajib di-delegasikan (*offloaded*) ke *engine database* PostgreSQL. 
- Analitik menggunakan konstruksi *Raw SQL Queries* (seperti `SUM`, `CASE WHEN`, dan operasi pengelompokan `GROUP BY` pada relasi multi-tabel) untuk menjamin metrik kalkulasi beroperasi mendekati kecepatan konstan (*O(1) memory overhead* di server aplikasi).

## 3. PENDEKATAN FRONTEND (REACT SERVER COMPONENTS)
- **Data Fetching:** Komponen dashboard harus didesain memanfaatkan kemampuan *Server Components* (RSC). Metrik statis-kompleks (*Analytics Summary*) diambil di sisi server (*Server-side fetching*) untuk memotong rantai beban komputasi di sisi *client/browser*.
- **Estetika Presentasi:** Penyajian UI harus lepas dari nuansa kaku. Penggunaan *progress bar* parametrik, tata letak visual berbasis *cards*, dan kombinasi pewarnaan kontras (untuk metrik peringatan/kegagalan) diinstruksikan agar membentuk bahasa visual yang premium dan intuitif.