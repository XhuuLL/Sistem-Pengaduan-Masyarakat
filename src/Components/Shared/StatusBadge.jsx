import React from 'react';
import { Clock, CheckCircle2, Loader2, XCircle } from 'lucide-react';

const statusConfig = {
    pending: {
        label: 'Menunggu',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: Clock
    },
    verified: {
        label: 'Terverifikasi',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: CheckCircle2
    },
    in_progress: {
        label: 'Diproses',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Loader2
    },
    completed: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle2
    },
    rejected: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle
    }
};

export default function StatusBadge({ status }) {
    // Default ke pending jika status tidak dikenal
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
        </span>
    );
}