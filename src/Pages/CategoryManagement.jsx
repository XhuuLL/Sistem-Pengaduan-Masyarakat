import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, FolderTree, Save, Tag, Edit3, X, Palette } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // State Form
    const [formData, setFormData] = useState({ name: '', color: 'bg-emerald-500' });
    const [editingId, setEditingId] = useState(null); // ID kategori yang lagi diedit

    // Pilihan Warna
    const colorOptions = [
        { name: 'Hijau', value: 'bg-emerald-500' },
        { name: 'Biru', value: 'bg-blue-500' },
        { name: 'Ungu', value: 'bg-purple-500' },
        { name: 'Merah', value: 'bg-red-500' },
        { name: 'Kuning', value: 'bg-yellow-500' },
        { name: 'Abu', value: 'bg-gray-500' },
    ];

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase.from('categories').select('*').order('id');
            if (error) throw error;
            if (data) setCategories(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fungsi Mengisi Form saat tombol Edit diklik
    const handleEditClick = (category) => {
        setEditingId(category.id);
        setFormData({ name: category.name, color: category.color || 'bg-emerald-500' });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas
    };

    // Fungsi Batal Edit
    const handleCancel = () => {
        setEditingId(null);
        setFormData({ name: '', color: 'bg-emerald-500' });
    };

    // Fungsi Simpan (Bisa Tambah Baru / Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        
        setSubmitting(true);
        const slug = formData.name.toLowerCase().replace(/ /g, '-');

        try {
            if (editingId) {
                // --- MODE EDIT (UPDATE) ---
                const { error } = await supabase
                    .from('categories')
                    .update({ name: formData.name, slug: slug, color: formData.color })
                    .eq('id', editingId);

                if (error) throw error;

                // Update State Lokal
                setCategories(categories.map(cat => 
                    cat.id === editingId ? { ...cat, ...formData, slug } : cat
                ));
            } else {
                // --- MODE TAMBAH (INSERT) ---
                const { data, error } = await supabase
                    .from('categories')
                    .insert([{ name: formData.name, slug: slug, color: formData.color }])
                    .select();

                if (error) throw error;
                if (data) setCategories([...categories, data[0]]);
            }

            // Reset Form
            handleCancel();

        } catch (error) {
            alert("Gagal menyimpan: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus kategori ini?")) return;
        
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            alert("Gagal hapus: " + error.message);
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600"/></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Kategori</h1>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">Tambah atau edit jenis laporan.</p>
                </div>
            </div>

            {/* Form Input (Bisa Mode Tambah / Mode Edit) */}
            <div className={`p-6 rounded-xl border shadow-sm transition-all ${editingId ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800' : 'bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                <h3 className={`font-semibold mb-4 flex items-center ${editingId ? 'text-yellow-700 dark:text-yellow-500' : 'text-gray-900 dark:text-white'}`}>
                    {editingId ? <><Edit3 className="w-5 h-5 mr-2"/> Edit Kategori</> : <><Plus className="w-5 h-5 mr-2"/> Tambah Kategori Baru</>}
                </h3>
                
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
                    
                    {/* Input Nama */}
                    <div className="relative flex-1 w-full">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                        <input 
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Nama Kategori (misal: Lampu Jalan)"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    {/* Pilih Warna */}
                    <div className="relative w-full md:w-48">
                        <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                        <select 
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                            value={formData.color}
                            onChange={e => setFormData({...formData, color: e.target.value})}
                        >
                            {colorOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tombol Action */}
                    <div className="flex gap-2 w-full md:w-auto">
                        {editingId && (
                            <button 
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2.5 text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium flex items-center justify-center w-full md:w-auto"
                            >
                                <X className="w-5 h-5 mr-1"/> Batal
                            </button>
                        )}
                        
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center justify-center shadow-lg shadow-emerald-500/20 disabled:opacity-70 w-full md:w-auto"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5 mr-2"/>}
                            {editingId ? 'Update' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Kategori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 flex justify-between items-center hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3">
                            {/* Icon Warna Warni sesuai database */}
                            <div className={`p-2.5 rounded-lg text-white ${cat.color || 'bg-gray-500'}`}>
                                <FolderTree className="w-5 h-5"/>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">{cat.name}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400 font-mono">/{cat.slug}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleEditClick(cat)}
                                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"
                                title="Edit Kategori"
                            >
                                <Edit3 className="w-5 h-5"/>
                            </button>
                            <button 
                                onClick={() => handleDelete(cat.id)}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                title="Hapus Kategori"
                            >
                                <Trash2 className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ))}
                
                {categories.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500 dark:text-slate-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                        Belum ada kategori. Silakan tambah di atas.
                    </div>
                )}
            </div>
        </div>
    );
}