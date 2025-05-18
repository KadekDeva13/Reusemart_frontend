import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../layout/AdminSidebar';
import '../pages/AdminPage.css';

const AdminLayout = () => {
  const location = useLocation();
  const activePage = location.pathname.split('/').pop();

  return (
    <div className="admin-page">
      <AdminSidebar activePage={activePage} />
      <main className="ml-[230px] py-3 min-h-screen overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
