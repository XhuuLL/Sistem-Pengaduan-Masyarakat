import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({ 
    title, 
    value, 
    icon: Icon, // Kita rename jadi Icon (Huruf Besar) biar dianggap komponen
    color = 'emerald',
    trend,
    trendValue,
    subtitle 
}) {
    
    // Mapping warna sederhana
    const colorMap = {
        emerald: 'text-emerald-600 bg-emerald-100',
        blue: 'text-blue-600 bg-blue-100',
        purple: 'text-purple-600 bg-purple-100',
        orange: 'text-orange-600 bg-orange-100',
        red: 'text-red-600 bg-red-100',
        green: 'text-green-600 bg-green-100',
    };

    // Pilih warna, default ke emerald kalau tidak ketemu
    const activeColorClass = colorMap[color] || colorMap.emerald;

    return (
        // Ganti <Card> dengan <div> biasa biar tidak perlu install library tambahan
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6">
            
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                    
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                    
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? (
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 mr-1" />
                            )}
                            <span className="font-medium">{trendValue}</span>
                        </div>
                    )}
                </div>
                
                {/* Bagian Icon */}
                <div className={`p-3 rounded-xl ${activeColorClass}`}>
                    {/* Kita render Icon di sini */}
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
            </div>
            
        </div>
    );
}