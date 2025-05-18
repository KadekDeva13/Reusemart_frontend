import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbarRequestDonasi from "../component/TopNavBarRequestDonasi";

const RequestDonasiLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbarRequestDonasi onLogout={handleLogout} />
      <main style={{ paddingTop: "70px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RequestDonasiLayout;
