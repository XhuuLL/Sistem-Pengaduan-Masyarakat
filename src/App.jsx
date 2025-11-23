import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './Pages/Login';
import Register from './Pages/Register'; 
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import ComplaintForm from './Pages/ComplaintForm';
import MyComplaints from './Pages/MyComplaints';
import ComplaintDetail from './Pages/ComplaintDetail';
import ComplaintManagement from './Pages/ComplaintManagement';
import Notifications from './Pages/Notifications';
import CategoryManagement from './Pages/CategoryManagement';
import UserManagement from './Pages/UserManagement';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/" element={<Layout />}>
          
          <Route index element={<Home />} />

          <Route path="lapor" element={<ComplaintForm />} />
          <Route path="riwayat" element={<MyComplaints />} />
          <Route path="aduan/:id" element={<ComplaintDetail />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kelola-aduan" element={<ComplaintManagement />} />
          <Route path="kategori" element={<CategoryManagement />} />
          <Route path="pengguna" element={<UserManagement />} />
          
          <Route path="notifikasi" element={<Notifications />} />
          <Route path="profil" element={<Profile />} />
          <Route path="pengaturan" element={<Settings />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;