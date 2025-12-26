import React, { useState, useEffect } from 'react';
import { 
    Wallet, TrendingUp, TrendingDown, Plus, Minus, Calendar, 
    ArrowUpRight, ArrowDownLeft, FileText, Loader2, Tag, 
    ChevronRight as BreadcrumbIcon, Save, X 
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';



export default function FinancialManagement() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [funds, setFunds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create'
    const [submitting, setSubmitting] = useState(false);
    const initialForm = {
        type: 'expense',
        fund_id: '',
        category_id: '',
        amount: '',
        title: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0] 
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: fundsData } = await supabase.from('funds').select('*');
            setFunds(fundsData || []);

            const { data: catData } = await supabase.from('finance_categories').select('*');
            setCategories(catData || []);

            const { data: logs, error } = await supabase
                .from('finance_logs')
                .select('*, funds(name), finance_categories(name)')
                .order('transaction_date', { ascending: false });

            if (error) throw error;
            setTransactions(logs);

            let inc = 0, exp = 0;
            logs.forEach(item => {
                if (item.type === 'income') inc += item.amount;
                else exp += item.amount;
            });
            setSummary({ income: inc, expense: exp, balance: inc - exp });

        } catch (error) {
            console.error('Error fetching finance:', error);
        } finally {
            setLoading(false);
        }
    };

   const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.fund_id) {
        toast.error("Pilih Sumber Dana!");
        return;
    }

    if (!formData.amount) {
        toast.error("Nominal wajib diisi!");
        return;
    }

    setSubmitting(true);

    try {
        const { error } = await supabase.from('finance_logs').insert([{
            ...formData,
            category_id: formData.category_id || null,
            amount: parseInt(formData.amount)
        }]);

        if (error) throw error;

        toast.success('Transaksi berhasil disimpan!');
        setFormData(initialForm);
        fetchData();
        setViewMode('list');

    } catch (err) {
        toast.error('Gagal menyimpan transaksi!');
        console.error(err);
    } finally {
        setSubmitting(false);
    }
};


    const formatRupiah = (num) => "Rp " + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    const openCreate = () => {
        setFormData(initialForm);
        setViewMode('create');
    };

    const backToList = () => {
        setViewMode('list');
    };

    if (loading && viewMode === 'list') return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600"/></div>;

    if (viewMode === 'create') {
        return (
            <div className="space-y-6 pb-20 animate-in fade-in duration-300">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mb-4">
                    <button onClick={backToList} className="hover:text-emerald-500 transition-colors">Keuangan Desa</button>
                    <BreadcrumbIcon className="w-4 h-4 mx-2 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Catat Transaksi</span>
                </div>

                <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Catat Transaksi Baru</h1>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 dark:bg-slate-900 rounded-xl">
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, type: 'income', category_id: ''})}
                                className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${formData.type === 'income' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-emerald-600 dark:text-slate-400'}`}
                            >
                                <TrendingUp className="w-5 h-5"/> Pemasukan
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, type: 'expense', category_id: ''})}
                                className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${formData.type === 'expense' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-red-600 dark:text-slate-400'}`}
                            >
                                <TrendingDown className="w-5 h-5"/> Pengeluaran
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Tanggal */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Tanggal Transaksi</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="date" required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={formData.transaction_date}
                                        onChange={e => setFormData({...formData, transaction_date: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Nominal */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Nominal (Rp)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                                    <input 
                                        type="number" required placeholder="0"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-lg"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Sumber Dana */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Sumber Dana (Dompet)</label>
                                <div className="relative">
                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select 
                                        required 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer appearance-none"
                                        value={formData.fund_id}
                                        onChange={e => setFormData({...formData, fund_id: e.target.value})}
                                    >
                                        <option value=""> Pilih Sumber Dana</option>
                                        {funds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Kategori (Pos Anggaran)</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select 
                                        required 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer appearance-none"
                                        value={formData.category_id}
                                        onChange={e => setFormData({...formData, category_id: e.target.value})}
                                    >
                                        <option value=""> Pilih Kategori</option>
                                        {categories
                                            .filter(c => c.type === formData.type)
                                            .map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Judul & Deskripsi */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Judul Transaksi</label>
                                <input 
                                    type="text" required placeholder={formData.type === 'income' ? "Contoh: Transfer Dana Desa Tahap 1" : "Masukkan judul transaksi..."}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Keterangan Detail</label>
                                <textarea 
                                    rows={3} placeholder="Jelaskan detail transaksi ini..."
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className={`flex-1 py-3.5 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-70 ${formData.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'}`}
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Save className="w-5 h-5 mr-2"/> Simpan Transaksi</>}
                            </button>
                            <button 
                                type="button" 
                                onClick={backToList}
                                className="px-8 py-3.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                            >
                                Batal
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-300">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Keuangan Desa</h1>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">Transparansi pemasukan dan pengeluaran anggaran.</p>
                </div>
                <button 
                    onClick={openCreate}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium flex items-center shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5 mr-2" /> Catat Transaksi
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4 opacity-80">
                        <Wallet className="w-6 h-6" />
                        <span className="text-sm font-medium uppercase tracking-wider">Sisa Saldo Kas</span>
                    </div>
                    <h2 className="text-4xl font-bold">{formatRupiah(summary.balance)}</h2>
                    <p className="text-blue-200 text-sm mt-2">Total Dana Tersedia</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold uppercase">Total Pemasukan</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatRupiah(summary.income)}</h2>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2 text-red-600 dark:text-red-400">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold uppercase">Total Pengeluaran</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatRupiah(summary.expense)}</h2>
                </div>
            </div>

            {/* Tabel Riwayat */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-emerald-600" /> Riwayat Transaksi
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">Keterangan</th>
                                <th className="px-6 py-4">Sumber Dana</th>
                                <th className="px-6 py-4">Jenis</th>
                                <th className="px-6 py-4 text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {transactions.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400 flex items-center gap-2 font-medium">
                                        <Calendar className="w-4 h-4 text-emerald-600"/> 
                                        {new Date(item.transaction_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 dark:text-white text-base">{item.title}</p>
                                        
                                        {/* Label Kategori */}
                                        <div className="flex items-center gap-2 mt-1">
                                            {item.finance_categories && (
                                                <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded border ${item.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
                                                    <Tag className="w-3 h-3 mr-1"/> {item.finance_categories.name}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400 dark:text-slate-500 truncate max-w-[200px]">{item.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs font-medium border border-gray-200 dark:border-slate-600">
                                            {item.funds?.name || 'Umum'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.type === 'income' ? (
                                            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg text-xs border border-emerald-100 dark:border-emerald-800">
                                                <ArrowDownLeft className="w-3 h-3 mr-1" /> Pemasukan
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg text-xs border border-red-100 dark:border-red-800">
                                                <ArrowUpRight className="w-3 h-3 mr-1" /> Pengeluaran
                                            </span>
                                        )}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold text-base ${item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {item.type === 'income' ? '+' : '-'} {formatRupiah(item.amount)}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic bg-gray-50 dark:bg-slate-900/50">
                                        Belum ada data transaksi yang tercatat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}