import React, { useState } from 'react';
import {
    FaTachometerAlt, FaHandsHelping, FaFileAlt,
    FaChevronDown, FaChevronRight, FaUser, FaSignOutAlt,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const OwnerSidebar = () => {
    const [donasiOpen, setDonasiOpen] = useState(true);
    const [laporanOpen, setLaporanOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const activePage = location.pathname.split('/').pop();
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="w-[240px] h-screen fixed top-0 left-0 bg-[#1e1f20] flex flex-col justify-between text-white text-sm">
            <div>
                <h2 className="text-center font-bold text-xl py-4 border-b border-gray-700">Reusemart</h2>

                <div
                    className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === "owner" ? "bg-[#798248] text-white" : ""}`}
                    onClick={() => navigate("/user/owner")}
                >
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </div>

                {/* Donasi */}
                <div>
                    <div
                        className="flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f]"
                        onClick={() => setDonasiOpen(!donasiOpen)}
                    >
                        {donasiOpen ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                        <FaHandsHelping className="mr-3" />
                        Donasi
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${donasiOpen ? "max-h-40" : "max-h-0"}`}>
                        <div
                            className={`w-full py-2 pl-9 pr-2 cursor-pointer hover:bg-[#2c2d2f] ${activePage === "request-donasi" ? "bg-[#798248] text-white font-semibold" : ""
                                }`}
                            onClick={() => navigate("/user/owner/request-donasi")}
                        >
                            Request Donasi
                        </div>
                        <div
                            className={`w-full py-2 pl-9 pr-2 cursor-pointer hover:bg-[#2c2d2f] ${activePage === "history-donasi" ? "bg-[#798248] text-white font-semibold" : ""
                                }`}
                            onClick={() => navigate("/user/owner/history-donasi")}
                        >
                            History Donasi
                        </div>
                    </div>
                </div>

                {/* Laporan */}
                <div>
                    <div
                        className="flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f]"
                        onClick={() => setLaporanOpen(!laporanOpen)}
                    >
                        {laporanOpen ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                        <FaFileAlt className="mr-3" />
                        Laporan
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${laporanOpen ? "max-h-60" : "max-h-0"}`}>
                        <div
                            className={`w-full py-2 pl-9 pr-2 cursor-pointer hover:bg-[#2c2d2f] ${activePage === "laporan-penjualan-bulanan" ? "bg-[#798248] text-white font-semibold" : ""}`}
                            onClick={() => navigate("/user/owner/laporan/laporan-penjualan-bulanan")}
                        >
                            Penjualan Bulanan
                        </div>
                        <div
                            className={`w-full py-2 pl-9 pr-2 cursor-pointer hover:bg-[#2c2d2f] ${activePage === "laporan-penjualan-kategori" ? "bg-[#798248] text-white font-semibold" : ""}`}
                            onClick={() => navigate("/user/owner/laporan/laporan-penjualan-kategori")}
                        >
                            Penjualan Per Kategori Barang
                        </div>
                        <div
                            className={`w-full py-2 pl-9 pr-2 cursor-pointer hover:bg-[#2c2d2f] ${activePage === "laporan-masa-penitipan-habis" ? "bg-[#798248] text-white font-semibold" : ""}`}
                            onClick={() => navigate("/user/owner/laporan/laporan-masa-penitipan-habis")}
                        >
                            Masa Penitipan Habis
                        </div>
                        <div
                            className={`w-full py-2 pl-9 pr-2 cursor-pointer hover:bg-[#2c2d2f] ${activePage === "laporan-komisi" ? "bg-[#798248] text-white font-semibold" : ""}`}
                            onClick={() => navigate("/user/owner/laporan/laporan-komisi")}
                        >
                            Komisi Bulanan
                        </div>
                        <div
                            className={`w-full py-2 pl-9 pr-2 cursor-pointer hover:bg-[#2c2d2f] ${activePage === "laporan-stok-gudang" ? "bg-[#798248] text-white font-semibold" : ""
                                }`}
                            onClick={() => navigate("/user/owner/laporan/laporan-stok-gudang")}
                        >
                            Stok Gudang
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="relative mt-auto">
                <div
                    className="flex items-center px-4 py-3 border-t border-blue-600 cursor-pointer"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                    <FaUser />
                    <span className="font-semibold ml-3">Raka Pratama</span>
                </div>

                {userMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white text-black shadow-lg rounded-md w-40 z-10 py-2">
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

export default OwnerSidebar;