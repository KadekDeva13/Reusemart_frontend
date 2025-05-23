import React, { useState } from 'react';
import {
    FaTachometerAlt, FaBoxOpen, FaHistory,
    FaUser, FaSignOutAlt, FaTruck
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const GudangSidebar = () => {
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
                <h2 className="text-center font-bold text-xl py-4 border-b border-gray-700">Reusemart Gudang</h2>

                <div
                    className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'gudang' ? 'bg-[#798248] text-white' : ''
                        }`}
                    onClick={() => navigate("/user/gudang")}
                >
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </div>

                <div
                    className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'manajemen-barang' ? 'bg-[#798248] text-white' : ''
                        }`}
                    onClick={() => navigate("/user/gudang/manajemen-barang")}
                >
                    <FaBoxOpen className="mr-3" />
                    Manajemen Barang
                </div>

                <div
                    className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'history-penitipan' ? 'bg-[#798248] text-white' : ''
                        }`}
                    onClick={() => navigate("/user/gudang/history-penitipan")}
                >
                    <FaHistory className="mr-3" />
                    Riwayat Penitipan
                </div>

                <div
                    className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'pengiriman' ? 'bg-[#798248] text-white' : ''
                        }`}
                    onClick={() => navigate("/user/gudang/pengiriman")}
                >
                    <FaTruck className="mr-3" />
                    Atur Pengiriman & Pengambilan
                </div>
            </div>

            <div className="relative mt-auto">
                <div
                    className="flex items-center px-4 py-3 border-t border-blue-600 cursor-pointer"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                    <FaUser />
                    <span className="font-semibold ml-3">Pegawai Gudang</span>
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

export default GudangSidebar;
