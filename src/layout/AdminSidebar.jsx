import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import {
  FaTachometerAlt,
  FaUserCog,
  FaIdBadge,
  FaUser,
  FaSignOutAlt,
  FaGift,
  FaMoneyCheckAlt,
  FaChevronDown,
} from 'react-icons/fa';

const AdminSidebar = ({ activePage }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [merchandiseMenuOpen, setMerchandiseMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleGenerateTopSeller = async () => {
    const confirm = window.confirm("Apakah kamu yakin ingin generate Top Seller bulan lalu?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/penitip/generate-top-seller",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      toast.success(res.data.message || "Top Seller berhasil digenerate");
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Terjadi kesalahan saat menghubungi server";
      toast.error(errMsg);
    } finally {
      setUserMenuOpen(false);
    }
  };

  return (
    <div className="w-[240px] h-screen fixed top-0 left-0 bg-[#1e1f20] flex flex-col justify-between text-white text-sm">
      <div>
        <h2 className="text-center font-bold text-xl py-4 border-b border-gray-700">Reusemart Admin</h2>

        {/* Dashboard */}
        <div
          className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'dashboard' ? 'bg-[#798248]' : ''}`}
          onClick={() => navigate("/user/admin")}
        >
          <FaTachometerAlt className="mr-3" />
          Dashboard
        </div>

        {/* Manajemen Pegawai */}
        <div
          className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'daftar-pegawai' ? 'bg-[#798248]' : ''}`}
          onClick={() => navigate("/user/admin/daftar-pegawai")}
        >
          <FaUserCog className="mr-3" />
          Manajemen Pegawai
        </div>

        {/* Manajemen Organisasi */}
        <div
          className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'daftar-organisasi' ? 'bg-[#798248]' : ''}`}
          onClick={() => navigate("/user/admin/daftar-organisasi")}
        >
          <FaIdBadge className="mr-3" />
          Manajemen Organisasi
        </div>

        {/* Manajemen Merchandise (Dropdown) */}
        <div
          className={`flex items-center justify-between px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage.includes('/merchandise') ? 'bg-[#798248]' : ''}`}
          onClick={() => setMerchandiseMenuOpen(!merchandiseMenuOpen)}
        >
          <div className="flex items-center">
            <FaGift className="mr-3" />
            Manajemen Merchandise
          </div>
          <FaChevronDown className={`transition-transform ${merchandiseMenuOpen ? '-rotate-90' : ''}`} />
        </div>

        {merchandiseMenuOpen && (
          <>
            <div
              className={`pl-12 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'merchandise-tambah' ? 'bg-[#798248]' : ''}`}
              onClick={() => navigate("/user/admin/merchandise-tambah")}
            >
              Tambah Merchandise
            </div>
            <div
              className={`pl-12 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'merchandise-daftar' ? 'bg-[#798248]' : ''}`}
              onClick={() => navigate("/user/admin/merchandise-daftar")}
            >
              Daftar Merchandise
            </div>
          </>
        )}

        {/* Komisi Hunter */}
        <div
          className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'komisi-hunter' ? 'bg-[#798248]' : ''}`}
          onClick={() => navigate("/user/admin/pegawai/komisi-hunter")}
        >
          <FaMoneyCheckAlt className="mr-3" />
          Komisi Hunter
        </div>
      </div>

      {/* Footer / User Menu */}
      <div className="relative mt-auto">
        <div
          className="flex items-center px-4 py-3 border-t border-blue-600 cursor-pointer"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <FaUser />
          <span className="font-semibold ml-3">Admin Rani</span>
        </div>

        {userMenuOpen && (
          <div className="absolute bottom-full left-0 mb-2 bg-white text-black shadow-lg rounded-md w-48 z-10 py-2">
            <div
              className="flex items-center text-blue-700 hover:bg-blue-100 px-4 py-2 cursor-pointer"
              onClick={handleGenerateTopSeller}
            >
              <FaIdBadge className="mr-2" />
              Generate Top Seller
            </div>
            <div
              className="flex items-center text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 cursor-pointer"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
