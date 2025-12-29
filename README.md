# 🏛️ SIGAP - Sistem Informasi Gangguan & Anggaran Perbaikan

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Tailwind%20%7C%20Supabase-blue)

## 📖 Tentang Aplikasi
Sistem Informasi Gangguan & Anggaran Perbaikan (SSIGAP) adalah aplikasi berbasis web yang dikembangkan sebagai produk luaran **Tugas Akhir Uas**. Aplikasi ini bertujuan untuk menjembatani komunikasi antara warga dengan perangkat desa dalam hal pelaporan masalah infrastruktur, pelayanan, keamanan, dan administrasi.

Dibuat dengan teknologi modern (**React.js + Supabase**), aplikasi ini memungkinkan pelaporan secara **Real-time**, transparan, dan responsif di berbagai perangkat (Mobile/Desktop).

---

## 🚀 Fitur Unggulan

### 👥 Untuk Warga (Public)
* **Pelaporan Tanpa Login:** Warga dapat melapor dengan cepat tanpa perlu mendaftar akun.
* **Upload Bukti Foto:** Mendukung lampiran foto kejadian secara real-time.
* **Mode Anonim:** Opsi untuk menyembunyikan identitas pelapor demi privasi.
* **Cek Riwayat (Opsional):** Memantau status laporan yang pernah dikirim.

### 🛡️ Untuk Admin & Petugas (Private)
* **Dashboard Statistik:** Grafik dan angka ringkasan laporan (Masuk, Proses, Selesai) secara real-time.
* **Manajemen Laporan:** Verifikasi laporan, ubah status (Pending -> Proses -> Selesai), dan berikan tanggapan.
* **Kelola Kategori:** Tambah/Edit/Hapus jenis kategori pengaduan (Misal: Jalan Rusak, Bansos, dll).
* **Manajemen User:** Kelola akun petugas dan admin desa.

### 🎨 Fitur Umum
* **Dark Mode Support:** Tampilan nyaman di mata dengan mode gelap/terang otomatis.
* **Responsive Design:** Tampilan optimal di HP, Tablet, dan Laptop.
* **Real-time Database:** Data tersimpan aman dan sinkron menggunakan Supabase (PostgreSQL).

---

## 🛠️ Teknologi yang Digunakan

* **Frontend:** [React.js](https://reactjs.org/) (Vite)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Database & Storage:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Routing:** React Router DOM

---

## 💻 Cara Menjalankan Project (Localhost)

Ikuti langkah ini untuk menjalankan aplikasi di komputer Anda:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/XhuuLL/Sistem-Pengaduan-Masyarakat.git
    cd Sistem-Pengaduan-Masyarakat
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Konfigurasi Database (Supabase)**
    * Pastikan file `src/supabaseClient.js` sudah terisi dengan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` project Anda.

4.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```
    Buka browser dan akses: `http://localhost:5173`

---

## 🔐 Akun Demo (Untuk Pengujian)

Gunakan akun berikut untuk masuk ke halaman Admin/Dashboard:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `fatkhul@gmail.com` | `admin123` |
| **Petugas** | `petugas@gmail.com` | `petugas123` |
| **Bendahara** | `bendahara@gmail.com` | `bendahara123` |

---

## 👤 Pengembang

**Akhmad Fatkhul Arifin**
