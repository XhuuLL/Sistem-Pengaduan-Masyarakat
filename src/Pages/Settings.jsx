import React from 'react';
import { Settings as SettingsIcon, Bell, Lock, User } from 'lucide-react';

export default function Settings() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
                <p className="text-gray-600 mt-1">Atur preferensi aplikasi Anda</p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5" /> Umum
                    </h3>
                    <p className="text-sm text-gray-500">Pengaturan dasar akun</p>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><User className="w-5 h-5" /></div>
                            <div>
                                <p className="font-medium text-gray-900">Profil Akun</p>
                                <p className="text-sm text-gray-500">Update foto dan biodata</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Edit</button>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Bell className="w-5 h-5" /></div>
                            <div>
                                <p className="font-medium text-gray-900">Notifikasi</p>
                                <p className="text-sm text-gray-500">Atur notifikasi sistem</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Atur</button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600"><Lock className="w-5 h-5" /></div>
                            <div>
                                <p className="font-medium text-gray-900">Keamanan</p>
                                <p className="text-sm text-gray-500">Ubah kata sandi</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Ubah</button>
                    </div>
                </div>
            </div>
        </div>
    );
}