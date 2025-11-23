// Ini adalah "Database Palsu" untuk Tanggapan/Komentar
export const complaintResponses = [
    {
        id: 1,
        complaint_id: 1, // ID ini nyambung ke Pengaduan "Jalan Rusak"
        message: "Terima kasih atas laporannya. Tim teknis kami akan segera melakukan survei ke lokasi besok pagi.",
        attachment_url: null,
        is_official: true, // Ini tanggapan resmi petugas
        responder_name: "Pak Budi (Petugas PU)",
        responder_role: "petugas",
        created_at: "2025-11-20T09:00:00Z"
    },
    {
        id: 2,
        complaint_id: 1,
        message: "Siap pak, mohon segera diperbaiki karena sudah banyak korban jatuh.",
        attachment_url: null,
        is_official: false, // Ini balasan warga
        responder_name: "Budi Santoso",
        responder_role: "warga",
        created_at: "2025-11-20T09:30:00Z"
    },
    {
        id: 3,
        complaint_id: 3, // ID ini nyambung ke Pengaduan "Sampah"
        message: "Mohon maaf atas keterlambatan. Armada pengangkut sedang dalam perbaikan. Akan diangkut lusa.",
        attachment_url: null,
        is_official: true,
        responder_name: "Admin Kebersihan",
        responder_role: "admin",
        created_at: "2025-11-21T15:00:00Z"
    }
];