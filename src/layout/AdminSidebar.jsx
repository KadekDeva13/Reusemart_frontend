import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OwnerSidebar.css';
import {
    FaTachometerAlt,
    FaUserCog,
    FaIdBadge,
    FaUser,
    FaSignOutAlt,
} from 'react-icons/fa';

const AdminSidebar = ({ setActivePage, activePage }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="sidebar">
            <div>
                <h2 className="sidebar-title">Reusemart Admin</h2>

                <div
                    className={`sidebar-item ${activePage === 'dashboard' ? 'sidebar-active' : ''}`}
                    onClick={() => navigate("/user/admin")}
                >
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </div>

                <div
                    className={`sidebar-item ${activePage === 'daftar-pegawai' ? 'sidebar-active' : ''}`}
                    onClick={() => navigate("/user/admin/daftar-pegawai")}
                >
                    <FaUserCog className="mr-3" />
                    Manajemen Pegawai
                </div>

                {/* Manajemen Organisasi */}
                <div
                    className={`sidebar-item ${activePage === 'daftar-organisasi' ? 'sidebar-active' : ''}`}
                    onClick={() => navigate("/user/admin/daftar-organisasi")}
                >
                    <FaIdBadge className="mr-3" />
                    Manajemen Organisasi
                </div>
            </div>

            {/* Footer - User Info */}
            <div className="relative mt-auto">
                <div
                    className="sidebar-footer cursor-pointer"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                    <FaUser />
                    <span className="font-semibold ml-3">Admin Rani</span>
                </div>

                <div
                    className={`absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-md w-40 z-10 py-2 transition-all duration-300 transform ${userMenuOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                >
                    <div
                        className="sidebar-subitem flex items-center text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
