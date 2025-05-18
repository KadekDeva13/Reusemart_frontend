import React from "react";
import { Outlet } from "react-router-dom";
import PegawaiTopNavbar from "../component/TopNavbarPegawaiCS";

const PegawaiCSLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PegawaiTopNavbar onLogout={handleLogout} />
      <main style={{ paddingTop: "70px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default PegawaiCSLayout;
