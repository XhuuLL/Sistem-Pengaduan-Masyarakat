import React, { useState, useEffect } from 'react';
import { 
    Plus, Trash2, Edit3, Search, Loader2, X, 
    ArrowUpCircle, ArrowDownCircle, Square, CheckSquare, ChevronLeft, ChevronRight, ChevronRight as BreadcrumbIcon
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

export default function FinanceCategory() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'edit'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [formData, setFormData] = useState({ id: null, name: '', type: 'income' });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('finance_categories')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const handleSubmit = async (e, createAnother = false) => {
    e.preventDefault();

    if (!formData.name) {
        toast.error("Nama kategori wajib diisi!");
        return;
    }

    try {
        setSubmitting(true);
        let actionText = "";

        if (isEditing) {
            const { error } = await supabase
                .from('finance_categories')
                .update({ name: formData.name, type: formData.type })
                .eq('id', formData.id);

            if (error) throw error;
            actionText = "diperbarui";
        } else {
            const { error } = await supabase
                .from('finance_categories')
                .insert([{ name: formData.name, type: formData.type }]);

            if (error) throw error;
            actionText = "ditambahkan";
        }

        toast.success(`Kategori berhasil ${actionText}!`);
        fetchCategories();

        if (createAnother && !isEditing) {
            setFormData({ id: null, name: '', type: 'income' });
        } else {
            backToList();
        }

    } catch (error) {
        toast.error("Gagal: " + error.message);
    } finally {
        setSubmitting(false);
    }
};

    const handleDelete = async (id) => {
    const confirmed = await new Promise((resolve) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span className="font-medium">Hapus kategori ini?</span>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(false);
                        }}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(true);
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        ), { duration: 10000 });
    });

    if (!confirmed) return;

    try {
        const { error } = await supabase
            .from('finance_categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        fetchCategories();
        toast.success("Kategori berhasil dihapus!");
    } catch (error) {
        console.error(error);
        toast.error("Gagal menghapus kategori!");
    }
};

    const openCreate = () => {
        setFormData({ id: null, name: '', type: 'income' });
        setIsEditing(false);
        setViewMode('create');
    };

    const openEdit = (category) => {
        setFormData(category);
        setIsEditing(true);
        setViewMode('edit');
    };

    const backToList = () => {
        setViewMode('list');
        setFormData({ id: null, name: '', type: 'income' });
        setIsEditing(false);
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalItems = filteredCategories.length;

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === currentItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currentItems.map(item => item.id));
        }
    };

    if (loading && viewMode === 'list') return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-emerald-600"/></div>;
    if (viewMode === 'create' || viewMode === 'edit') {
        return (
            <div className="space-y-6 pb-20 animate-in fade-in duration-200">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                    <button onClick={backToList} className="hover:text-blue-500">Daftar Kategori</button>
                    <BreadcrumbIcon className="w-4 h-4 mx-2" />
                    <span className="font-medium text-gray-900 dark:text-white">{isEditing ? 'Edit' : 'Create'}</span>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Edit Kategori' : 'Create Kategori'}
                    </h1>
                </div>
                
                <form className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Nama Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Nama Kategori <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Masukkan nama kategori"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                autoFocus
                            />
                        </div>

                        {/* Tipe Kategori (Dropdown) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Tipe <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '.75em' }}
                            >
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4">
                        <button 
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={submitting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center disabled:opacity-70"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin"/> : (isEditing ? "Update" : "Create")}
                        </button>
                        
                        {!isEditing && (
                            <button 
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={submitting}
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-lg transition-all flex items-center justify-center disabled:opacity-70"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Create & create another"}
                            </button>
                        )}

                        <button 
                            type="button"
                            onClick={backToList}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-bold rounded-lg transition-all border border-gray-300 dark:border-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar Kategori</h1>
                    <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Kelola data kategori pemasukan dan pengeluaran.</p>
                </div>
                <button 
                    onClick={openCreate} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center shadow-lg shadow-blue-500/20 transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" /> New Kategori
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                    <div className="relative max-w-sm ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="p-4 w-10 text-center">
                                    <button onClick={toggleSelectAll}>
                                        {selectedIds.length === currentItems.length && currentItems.length > 0 ? (
                                            <CheckSquare className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Square className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </th>
                                <th className="p-4">Nama Kategori</th>
                                <th className="p-4">Tipe</th>
                                <th className="p-4">Dibuat Pada</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {currentItems.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="p-4 text-center">
                                        <button onClick={() => toggleSelection(cat.id)}>
                                            {selectedIds.includes(cat.id) ? (
                                                <CheckSquare className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <Square className="w-4 h-4 text-gray-500 dark:text-slate-600" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900 dark:text-white text-base">
                                        {cat.name}
                                    </td>
                                    <td className="p-4">
                                        {cat.type === 'income' ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                Pemasukan
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                                                Pengeluaran
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-500 dark:text-slate-400 font-medium">
                                        {formatDate(cat.created_at)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <button 
                                                onClick={() => openEdit(cat)}
                                                className="flex items-center text-blue-500 hover:text-blue-400 font-bold transition-colors text-xs uppercase tracking-wide"
                                            >
                                                <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat.id)}
                                                className="flex items-center text-red-500 hover:text-red-400 font-bold transition-colors text-xs uppercase tracking-wide"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {currentItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-slate-400 italic">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                        Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} results
                    </span>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-transparent border border-gray-300 dark:border-slate-600 rounded-lg px-2 py-1">
                            <span className="text-sm text-gray-500 dark:text-slate-400 mr-2">Per page</span>
                            <select 
                                className="bg-transparent text-sm font-bold text-gray-700 dark:text-white outline-none cursor-pointer p-1"
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                <option className="dark:bg-slate-800" value={5}>5</option>
                                <option className="dark:bg-slate-800" value={10}>10</option>
                                <option className="dark:bg-slate-800" value={20}>20</option>
                                <option className="dark:bg-slate-800" value={50}>50</option>
                            </select>
                        </div>

                        <div className="flex gap-1">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-600 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => (indexOfLastItem < totalItems ? prev + 1 : prev))}
                                disabled={indexOfLastItem >= totalItems}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-600 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}