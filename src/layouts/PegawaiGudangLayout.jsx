// File: PegawaiGudangLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import GudangSidebar from "../layout/PegawaiGudangSidebar";
import axios from "axios";

const PegawaiGudangLayout = () => {
  const location = useLocation();
  const activePage = location.pathname.split("/").pop();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      axios.post("http://localhost:8000/api/transaksi/hanguskan-otomatis", {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          console.log("✅ Hangus otomatis berhasil dijalankan");
        })
        .catch((err) => {
          console.error("❌ Gagal hanguskan otomatis:", err?.response?.data?.message || err.message);
        });
    }, 10 * 60 * 1000); // setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gudang-page">
      <GudangSidebar activePage={activePage} />
      <main className="ml-[230px] py-3 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PegawaiGudangLayout;
