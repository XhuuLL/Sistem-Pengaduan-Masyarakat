import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Bell, CheckCircle2, Loader2, Trash2, 
    Eye, FileText, AlertCircle 
} from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            const dummyData = [
                {
                    id: 1,
                    type: 'complaint_created',
                    title: 'Laporan Berhasil Dibuat',
                    message: 'Laporan "Jalan Rusak" dengan tiket CPLM-001 berhasil dibuat dan menunggu verifikasi.',
                    is_read: false,
                    created_at: new Date().toISOString(), // Hari ini
                    complaint_id: 1
                },
                {
                    id: 2,
                    type: 'status_changed',
                    title: 'Status Berubah',
                    message: 'Status pengaduan "Sampah Menumpuk" berubah menjadi: Dalam Proses.',
                    is_read: false,
                    created_at: new Date(Date.now() - 86400000).toISOString(), // Kemarin
                    complaint_id: 2
                },
                {
                    id: 3,
                    type: 'response_added',
                    title: 'Tanggapan Baru',
                    message: 'Petugas Desa telah menanggapi laporan Anda mengenai "Lampu PJU".',
                    is_read: true,
                    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 hari lalu
                    complaint_id: 3
                }
            ];
            setNotifications(dummyData);
            setLoading(false);
        }, 800);
    }, []);
    const markAsRead = (id) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, is_read: true }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => 
            prev.filter(n => n.id !== id)
        );
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'complaint_created': return <FileText className="w-5 h-5 text-blue-600" />;
            case 'status_changed': return <Bell className="w-5 h-5 text-purple-600" />;
            case 'response_added': return <AlertCircle className="w-5 h-5 text-emerald-600" />;
            default: return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
        });
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
                    <p className="text-gray-600 mt-1">
                        {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Tandai Semua Dibaca
                    </button>
                )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed p-12 text-center">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada notifikasi</h3>
                    <p className="text-gray-600">Anda belum memiliki notifikasi baru.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div 
                            key={notification.id}
                            className={`relative bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
                                !notification.is_read ? 'border-l-4 border-l-emerald-500 bg-emerald-50/30' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 mt-1 p-2 bg-white rounded-full border shadow-sm">
                                    {getNotificationIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900 flex items-center">
                                            {notification.title}
                                            {!notification.is_read && (
                                                <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Baru</span>
                                            )}
                                        </h4>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {formatDate(notification.created_at)}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-3">
                                        {notification.message}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {notification.complaint_id && (
                                            <Link to={`#`} onClick={() => markAsRead(notification.id)}> 
                                                <button className="flex items-center px-3 py-1.5 bg-white border rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    Lihat Detail
                                                </button>
                                            </Link>
                                        )}
                                        
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="flex items-center px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-md"
                                            >
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Baca
                                            </button>
                                        )}
                                        
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md ml-auto"
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}