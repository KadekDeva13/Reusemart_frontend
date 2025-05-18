import React, { useState } from 'react';
import AdminSidebar from '../layout/AdminSidebar';
import './AdminPage.css';
import DaftarPegawaiPage from './DaftarPegawaiPage';
import TambahPegawaiPage from './TambahPegawaiPage';

const AdminPage = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  const dummyPegawai = [
    {
      id: 1,
      nama_lengkap: 'Andi Pratama',
      email: 'andi@example.com',
      jabatan: 'Hunter',
      no_telepon: '081234567890',
      alamat: 'Jl. Merdeka No. 1',
      gender: 'Laki-laki',
      tanggal_lahir: '1990-01-15',
      komisi_hunter: '10%',
      KTP: '1234567890123456',
      image_user: '',
    },
    {
      id: 2,
      nama_lengkap: 'Siti Nurhaliza',
      email: 'siti@example.com',
      jabatan: 'Admin Produk',
      no_telepon: '082345678901',
      alamat: 'Jl. Mawar No. 2',
      gender: 'Perempuan',
      tanggal_lahir: '1992-06-22',
      komisi_hunter: '',
      KTP: '6543210987654321',
      image_user: '',
    },
    
  ];

  const handleEdit = (pegawai) => {
    alert(`Edit data pegawai: ${pegawai.nama_lengkap}`);
  };

  const handleDelete = (id) => {
    alert(`Hapus pegawai dengan ID: ${id}`);
  };

  const renderMainContent = () => {
    switch (activePage) {
      case 'daftar-pegawai':
        return (
          <DaftarPegawaiPage
            data={dummyPegawai}
            onEdit={handleEdit}
            onDelete={handleDelete}
            setActivePage={setActivePage}
          />
        );
        case 'tambah-pegawai':
          return <TambahPegawaiPage setActivePage={setActivePage} />;
        case 'profil':
          return <h2 className="p-3">Profil Admin</h2>;
      default:
        return <h2 className="p-3">Selamat Datang di Dashboard Admin</h2>;
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar setActivePage={setActivePage} activePage={activePage} />
      <main className="ml-[230px] py-3 min-h-screen overflow-y-auto w-full">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default AdminPage;
