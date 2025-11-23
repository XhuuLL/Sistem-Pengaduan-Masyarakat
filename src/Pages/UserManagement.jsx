import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Shield, User, Loader2, Mail, Calendar, Phone, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '', role: 'warga', nik: '', no_hp: '' });

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase.from('users').select('*').order('id');
            if (!error) setUsers(data);
        } catch (error) {
            console.error("Gagal ambil user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('users').insert([newUser]);
        if (!error) {
            fetchUsers();
            setIsAdding(false);
            setNewUser({ full_name: '', email: '', password: '', role: 'warga', nik: '', no_hp: '' });
        } else {
            alert('Gagal tambah user: ' + error.message);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Hapus user ini?")) return;
        const { error } = await supabase.from('users').delete().eq('id', id);
        if(!error) fetchUsers();
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowerTerm = searchTerm.toLowerCase();
        return users.filter(u => u.full_name?.toLowerCase().includes(lowerTerm) || u.email?.toLowerCase().includes(lowerTerm) || u.nik?.includes(lowerTerm));
    }, [users, searchTerm]);

    const adminCount = users.filter(u => u.role === 'admin').length;
    const wargaCount = users.filter(u => u.role === 'warga').length;

    const getRoleBadge = (role) => {
        const colors = {
            admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
            petugas: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
            warga: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900"
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[role]}`}>{role}</span>;
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600"/></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Pengguna</h1>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">Total {users.length} pengguna terdaftar</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                    <Plus className="w-4 h-4" /> Tambah User
                </button>
            </div>

            {/* Form Tambah */}
            {isAdding && (
                <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 animate-in slide-in-from-top-2 shadow-sm">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Tambah User Baru</h3>
                    <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Nama Lengkap" className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" required onChange={e => setNewUser({...newUser, full_name: e.target.value})} />
                        <input placeholder="Email" type="email" className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" required onChange={e => setNewUser({...newUser, email: e.target.value})} />
                        <input placeholder="Password" type="password" className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" required onChange={e => setNewUser({...newUser, password: e.target.value})} />
                        <select className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setNewUser({...newUser, role: e.target.value})}>
                            <option value="warga">Warga</option>
                            <option value="petugas">Petugas</option>
                            <option value="admin">Admin</option>
                        </select>
                        <input placeholder="NIK (Opsional)" className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setNewUser({...newUser, nik: e.target.value})} />
                        <input placeholder="No HP (Opsional)" className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setNewUser({...newUser, no_hp: e.target.value})} />
                        
                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Simpan</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full"><Users className="w-6 h-6 text-gray-600 dark:text-slate-300" /></div>
                    <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p><p className="text-sm text-gray-500 dark:text-slate-400">Total User</p></div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full"><Shield className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
                    <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{adminCount}</p><p className="text-sm text-gray-500 dark:text-slate-400">Admin</p></div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full"><User className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
                    <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{wargaCount}</p><p className="text-sm text-gray-500 dark:text-slate-400">Warga</p></div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                    </div>
                    <input 
                        placeholder="Search" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" 
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="grid gap-4">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-emerald-700 dark:text-emerald-400 text-xl">
                            {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {user.full_name} {getRoleBadge(user.role)}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
                                </div>
                                <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600 dark:text-slate-400 border-t border-gray-100 dark:border-slate-700 pt-3">
                                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400"/> NIK: {user.nik || '-'}</span>
                                <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> HP: {user.no_hp || '-'}</span>
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400"/> Join: {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}