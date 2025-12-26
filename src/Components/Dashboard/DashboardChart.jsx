// File: src/Components/Dashboard/DashboardChart.jsx
import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

// --- 1. Custom Tooltip Component (Agar tampilan hover lebih bagus) ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-3 border border-gray-100 dark:border-slate-700 rounded-lg shadow-lg">
                <p className="text-sm font-bold text-gray-700 dark:text-slate-200 mb-1">{label}</p>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {payload[0].value} Pengaduan
                </p>
            </div>
        );
    }
    return null;
};

const DashboardChart = ({ chartData }) => {
    // --- 2. Logika Warna Batang (Semakin tinggi semakin merah) ---
    // Kita buat warnanya lebih "soft" tapi tetap tegas
    const getBarColor = (count) => {
        if (count === 0) return '#e5e7eb'; // Abu-abu (Kosong)
        if (count <= 2) return '#34d399';  // Emerald Soft (Rendah)
        if (count <= 5) return '#fbbf24';  // Amber/Kuning (Sedang)
        return '#f87171';                  // Merah Soft (Tinggi)
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 h-full">
            <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Statistik Bulanan
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Jumlah pengaduan masuk tahun ini</p>
            </div>
            {/* Container agar grafik responsif */}
            <div className="h-[300px] w-full font-sans">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                        {/* Garis grid dibuat lebih halus */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                        {/* Sumbu X (Bulan) */}
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 12 }} // Warna text abu-abu
                            dy={10}
                        />
                        {/* Sumbu Y (Angka) */}
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 12 }} 
                            allowDecimals={false}
                        />
                        {/* Tooltip Kustom */}
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }}/>
                        {/* Batang Grafik */}
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50} animationDuration={1000}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardChart;