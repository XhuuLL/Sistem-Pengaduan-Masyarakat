// Ini adalah "Database Palsu" untuk Notifikasi
export const notifications = [
    {
        id: 1,
        user_email: 'warga@cipelem.desa.id',
        type: 'complaint_created',
        title: 'Laporan Berhasil Dibuat',
        message: 'Laporan "Jalan Rusak" dengan tiket CPLM-001 berhasil dibuat.',
        is_read: false,
        created_at: '2025-11-20T08:05:00Z',
        complaint_id: 1
    },
    {
        id: 2,
        user_email: 'warga@cipelem.desa.id',
        type: 'status_changed',
        title: 'Status Laporan Berubah',
        message: 'Status laporan CPLM-003 berubah menjadi Dalam Proses.',
        is_read: true,
        created_at: '2025-11-22T09:00:00Z',
        complaint_id: 3
    }
];