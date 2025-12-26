import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import ComplaintForm from './Pages/ComplaintForm';
import ComplaintManagement from './Pages/ComplaintManagement';
import CategoryManagement from './Pages/CategoryManagement';
import UserManagement from './Pages/UserManagement';
import FinancialManagement from './Pages/FinancialManagement';
import FinanceCategory from './Pages/FinanceCategory';
import Profile from './Pages/Profile';
import ComplaintDetail from './Pages/ComplaintDetail';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user_session'));
    } catch {
        return <Navigate to="/login" replace />;
    }

    if (!user) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default function App() {
    return (
        <Router>
            <Toaster position="top-right" />

            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/lapor" element={<ComplaintForm />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<Layout />}>
                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin','petugas','bendahara']}>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/laporan/:id" element={
                        <ProtectedRoute allowedRoles={['admin','petugas','bendahara']}>
                            <ComplaintDetail />
                        </ProtectedRoute>
                    } />

                    <Route path="/profil" element={
                        <ProtectedRoute allowedRoles={['admin','petugas','bendahara']}>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/kelola" element={
                        <ProtectedRoute allowedRoles={['admin','petugas']}>
                            <ComplaintManagement />
                        </ProtectedRoute>
                    } />

                    <Route path="/kategori" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <CategoryManagement />
                        </ProtectedRoute>
                    } />

                    <Route path="/keuangan" element={
                        <ProtectedRoute allowedRoles={['admin','bendahara']}>
                            <FinancialManagement />
                        </ProtectedRoute>
                    } />

                    <Route path="/kategori-keuangan" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <FinanceCategory />
                        </ProtectedRoute>
                    } />

                    <Route path="/pengguna" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <UserManagement />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </Router>
    );
}