import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaUserCog,
    FaIdBadge,
    FaUser,
    FaSignOutAlt,
} from 'react-icons/fa';

const AdminSidebar = ({ activePage }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="w-[240px] h-screen fixed top-0 left-0 bg-[#1e1f20] flex flex-col justify-between text-white text-sm">
            <div>
                <h2 className="text-center font-bold text-xl py-4 border-b border-gray-700">Reusemart Admin</h2>

                <div
                    className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'dashboard' ? 'bg-[#798248] text-white' : ''}`}
                    onClick={() => navigate("/user/admin")}
                >
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </div>

                <div
                    className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'daftar-pegawai' ? 'bg-[#798248] text-white' : ''}`}
                    onClick={() => navigate("/user/admin/daftar-pegawai")}
                >
                    <FaUserCog className="mr-3" />
                    Manajemen Pegawai
                </div>

                <div
                    className={`flex items-center px-4 py-2 cursor-pointer font-semibold hover:bg-[#2c2d2f] ${activePage === 'daftar-organisasi' ? 'bg-[#798248] text-white' : ''}`}
                    onClick={() => navigate("/user/admin/daftar-organisasi")}
                >
                    <FaIdBadge className="mr-3" />
                    Manajemen Organisasi
                </div>
            </div>

            {/* Footer */}
            <div className="relative mt-auto">
                <div
                    className="flex items-center px-4 py-3 border-t border-blue-600 cursor-pointer"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                    <FaUser />
                    <span className="font-semibold ml-3">Admin Rani</span>
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

export default AdminSidebar;
