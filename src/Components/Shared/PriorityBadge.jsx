import React from 'react';

export default function PriorityBadge({ priority }) {
    const config = {
        low: { label: 'Rendah', color: 'bg-gray-100 text-gray-800 border-gray-200' },
        medium: { label: 'Sedang', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        high: { label: 'Tinggi', color: 'bg-orange-100 text-orange-800 border-orange-200' },
        urgent: { label: 'Mendesak', color: 'bg-red-100 text-red-800 border-red-200' },
    };
    const { label, color } = config[priority] || config.medium;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
            {label}
        </span>
    );
}