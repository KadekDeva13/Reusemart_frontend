// File: OwnerLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import GudangSidebar from "../layout/PegawaiGudangSidebar";

const PegawaiGudangLayout = () => {
  const location = useLocation();
  const activePage = location.pathname.split("/").pop(); // untuk highlight sidebar

  return (
    <div className="owner-page">
      <GudangSidebar activePage={activePage} />
      <main className="ml-[230px] py-3 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PegawaiGudangLayout;
