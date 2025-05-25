// File: OwnerLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import OwnerSidebar from "../layout/OwnerSidebar";

const OwnerLayout = () => {
  const location = useLocation();
  const activePage = location.pathname.split("/").pop(); // untuk highlight sidebar

  return (
    <div className="owner-layout">
      <OwnerSidebar activePage={activePage} />
      <main className="ml-[230px] py-3 min-h-screen overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
