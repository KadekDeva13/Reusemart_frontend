// File: PegawaiGudangLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import GudangSidebar from "../layout/PegawaiGudangSidebar";
import axios from "axios";
import API from "@/utils/api";

const PegawaiGudangLayout = () => {
  const location = useLocation();
  const activePage = location.pathname.split("/").pop();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      API.post("/api/transaksi/hanguskan-otomatis", {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          console.log("✅ Hangus otomatis berhasil dijalankan");
        })
        .catch((err) => {
          console.error("❌ Gagal hanguskan otomatis:", err?.response?.data?.message || err.message);
        });
    }, 30 * 60 * 1000); // setiap 10 menit
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
