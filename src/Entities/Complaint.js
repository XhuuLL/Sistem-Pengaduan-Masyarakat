// Ini adalah "Database Palsu" untuk Pengaduan
export const complaints = [
    {
        id: 1,
        ticket_id: 'CPLM-2025-001',
        title: 'Jalan Berlubang di Depan Masjid',
        description: 'Jalan berlubang cukup dalam, sangat berbahaya saat hujan.',
        category_id: 1, // Infrastruktur
        status: 'pending',
        priority: 'high',
        location: 'Dusun Wage RT 02',
        photo_url: 'https://placehold.co/600x400/png?text=Jalan+Rusak',
        is_anonymous: false,
        reporter_name: 'Budi Santoso',
        created_at: '2025-11-20T08:00:00Z'
    },
    {
        id: 2,
        ticket_id: 'CPLM-2025-002',
        title: 'Pengajuan Surat Keterangan Usaha',
        description: 'Mohon diproses surat pengantar untuk bank.',
        category_id: 2, // Administrasi
        status: 'completed',
        priority: 'medium',
        location: 'Kantor Desa',
        photo_url: null,
        is_anonymous: false,
        reporter_name: 'Siti Aminah',
        created_at: '2025-11-18T10:30:00Z'
    },
    {
        id: 3,
        ticket_id: 'CPLM-2025-003',
        title: 'Sampah Menumpuk',
        description: 'Sudah 3 hari sampah belum diangkut di area pasar.',
        category_id: 3, // Kebersihan
        status: 'in_progress',
        priority: 'medium',
        location: 'Pasar Desa',
        photo_url: null,
        is_anonymous: true,
        reporter_name: 'Anonim',
        created_at: '2025-11-21T14:15:00Z'
    }
];