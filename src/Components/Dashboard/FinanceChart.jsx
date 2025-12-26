import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-3 border border-gray-100 dark:border-slate-700 rounded-lg shadow-lg">
                <p className="text-sm font-bold text-gray-700 dark:text-slate-200 mb-1">{label}</p>
                <p className={`text-sm font-medium ${payload[0].name === 'Pemasukan' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {payload[0].name}: Rp {payload[0].value.toLocaleString('id-ID')}
                </p>
            </div>
        );
    }
    return null;
};

const FinanceChart = ({ data }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            
            {/* GRAFIK PEMASUKAN (HIJAU) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
                <div className="mb-6 flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Grafik Pemasukan</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Arus kas masuk per bulan</p>
                    </div>
                </div>
                <div className="h-[250px] w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} tickFormatter={(value) => `${value/1000000}M`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1 }} />
                            <Area 
                                type="monotone" 
                                dataKey="income" 
                                name="Pemasukan"
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorIncome)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* GRAFIK PENGELUARAN (MERAH) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
                <div className="mb-6 flex items-center gap-2">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Grafik Pengeluaran</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Arus kas keluar per bulan</p>
                    </div>
                </div>
                <div className="h-[250px] w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} tickFormatter={(value) => `${value/1000000}M`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ef4444', strokeWidth: 1 }} />
                            <Area 
                                type="monotone" 
                                dataKey="expense" 
                                name="Pengeluaran"
                                stroke="#ef4444" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorExpense)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FinanceChart;