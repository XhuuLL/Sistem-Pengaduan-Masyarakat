import React, { useState, useEffect, useMemo } from 'react';
import { 
    Users, Search, Shield, User, Loader2, Plus, Trash2, Wallet, Briefcase, 
    ChevronRight as BreadcrumbIcon, Save, X, Edit3, Phone, Calendar, Mail 
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'edit'
    const initialForm = { 
        id: null, 
        full_name: '', 
        email: '', 
        password: '', 
        role: 'petugas', 
        nik: '', 
        no_hp: '' 
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => { 
        fetchUsers(); 
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('users').select('*').order('id');
            if (!error) setUsers(data);
        } catch (error) {
            console.error("Gagal ambil user:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e, createAnother = false) => {
    e.preventDefault();

    if (!formData.email || (!formData.password && viewMode === 'create')) {
        toast.error("Email dan Password wajib diisi!");
        return;
    }

    setSubmitting(true);
    try {
        const { id, ...payload } = formData;

        if (viewMode === 'edit' && !payload.password) {
            delete payload.password;
        }

        let actionText = "";

        if (viewMode === 'edit') {
            const { error } = await supabase.from('users').update(payload).eq('id', id);
            if (error) throw error;
            actionText = "diperbarui";
        } else {
            const { error } = await supabase.from('users').insert([payload]);
            if (error) throw error;
            actionText = "ditambahkan";
        }

        toast.success(`User berhasil ${actionText}!`);
        fetchUsers();

        if (createAnother && viewMode === 'create') {
            setFormData(initialForm);
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
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;

        toast.success("User berhasil dihapus");
        fetchUsers();
        } catch (error) {
            toast.error("Gagal hapus: " + error.message);
        }
    };
    const openCreate = () => {
        setFormData(initialForm);
        setViewMode('create');
    };

    const openEdit = (user) => {
        setFormData({ ...user, password: '' });
        setViewMode('edit');
    };

    const backToList = () => {
        setViewMode('list');
        setFormData(initialForm);
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowerTerm = searchTerm.toLowerCase();
        return users.filter(u => u.full_name?.toLowerCase().includes(lowerTerm) || u.email?.toLowerCase().includes(lowerTerm) || u.nik?.includes(lowerTerm));
    }, [users, searchTerm]);

    const adminCount = users.filter(u => u.role === 'admin').length;
    const bendaharaCount = users.filter(u => u.role === 'bendahara').length;
    const petugasCount = users.filter(u => u.role === 'petugas').length;

    const getRoleBadge = (role) => {
        const colors = {
            admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
            petugas: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
            bendahara: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-900",
            warga: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900"
        };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${colors[role] || colors['warga']}`}>{role}</span>;
    };

    if (loading && viewMode === 'list') return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600"/></div>;

    if (viewMode === 'create' || viewMode === 'edit') {
        return (
            <div className="space-y-6 pb-20 animate-in fade-in duration-300">
                <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-6">
                    <button onClick={backToList} className="text-sm text-gray-500 hover:text-emerald-500 mb-2 flex items-center transition-colors">
                        <BreadcrumbIcon className="w-4 h-4 mr-1 rotate-180" /> Kembali ke List
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {viewMode === 'create' ? 'Create User Baru' : 'Edit Data User'}
                    </h1>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold mb-2 dark:text-white">Nama Lengkap</label>
                                <input className="w-full px-4 py-3 border rounded-lg dark:bg-[#1a1f2c] dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 dark:text-white">Email</label>
                                <input type="email" className="w-full px-4 py-3 border rounded-lg dark:bg-[#1a1f2c] dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 dark:text-white">Password</label>
                                <input type="password" placeholder={viewMode === 'edit' ? "(Biarkan kosong jika tidak ubah)" : ""} className="w-full px-4 py-3 border rounded-lg dark:bg-[#1a1f2c] dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 dark:text-white">Role</label>
                                <select 
                                className="w-full px-4 py-3 border rounded-lg dark:bg-[#1a1f2c] dark:border-slate-600 dark:text-white" 
                                value={formData.role} 
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >

                                <option value="petugas">Petugas</option>
                                <option value="bendahara">Bendahara</option>
                                <option value="admin">Admin Sistem</option>
                            </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 dark:text-white">NIK</label>
                                <input className="w-full px-4 py-3 border rounded-lg dark:bg-[#1a1f2c] dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 dark:text-white">No HP</label>
                                <input className="w-full px-4 py-3 border rounded-lg dark:bg-[#1a1f2c] dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" value={formData.no_hp} onChange={e => setFormData({...formData, no_hp: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t dark:border-slate-700">
                            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-500/20">{submitting ? 'Menyimpan...' : (viewMode === 'create' ? 'Create User' : 'Update User')}</button>
                            <button type="button" onClick={backToList} className="px-6 py-2.5 border rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Pengguna</h1>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">Manajemen akses akun Admin, Petugas, dan Bendahara Desa.</p>
                </div>
                <button 
                    onClick={openCreate} 
                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-medium transition-all"
                >
                    <Plus className="w-5 h-5" /> Tambah User
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                        <Briefcase className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{petugasCount}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Petugas</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                        <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{adminCount}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Administrator</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <Wallet className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{bendaharaCount}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Bendahara</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                    </div>
                    <input 
                        placeholder="Search..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" 
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all group">
                        
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-emerald-700 dark:text-emerald-400 text-2xl border-2 border-emerald-50 dark:border-emerald-800">
                            {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                                    {user.full_name} 
                                    {getRoleBadge(user.role)}
                                </h3>
                                <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(user)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors" title="Edit User">
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors" title="Hapus User">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-sm text-gray-500 dark:text-slate-400">
                                <span className="flex items-center gap-2"><Mail className="w-4 h-4"/> {user.email}</span>
                                <span className="hidden md:inline">|</span>
                                <span className="flex items-center gap-2"><Phone className="w-4 h-4"/> {user.no_hp || '-'}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-gray-500 dark:text-slate-500 border-t border-gray-100 dark:border-slate-700 pt-3">
                                <span className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 dark:bg-slate-900/50 py-1 px-2 rounded">
                                    <Shield className="w-3 h-3"/> NIK: {user.nik || '-'}
                                </span>
                                <span className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 dark:bg-slate-900/50 py-1 px-2 rounded">
                                    <User className="w-3 h-3"/> Join: {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:hidden">
                            <button onClick={() => openEdit(user)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2">
                                <Edit3 className="w-4 h-4" /> Edit
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" /> Hapus
                            </button>
                        </div>
                    </div>
                ))}
                
                {filteredUsers.length === 0 && (
                    <div className="text-center py-10 text-gray-500 dark:text-slate-500 italic bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                        Tidak ada pengguna ditemukan.
                    </div>
                )}
            </div>
        </div>
    );
}