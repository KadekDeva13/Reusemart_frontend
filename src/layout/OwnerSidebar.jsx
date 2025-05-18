import React, { useState } from 'react';
import './OwnerSidebar.css';
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
        <div className="sidebar">
            <div>
                <h2 className="sidebar-title">Reusemart</h2>

                <div
                    className={`sidebar-item ${activePage === "owner" ? "sidebar-active" : ""}`}
                    onClick={() => navigate("/user/owner")}
                >
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </div>

                <div>
                    <div className="sidebar-item" onClick={() => setDonasiOpen(!donasiOpen)}>
                        {donasiOpen ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                        <FaHandsHelping className="mr-3" />
                        Donasi
                    </div>
                    <div className={`ml-4 transition-all duration-300 overflow-hidden ${donasiOpen ? 'max-h-40' : 'max-h-0'}`}>
                        <div
                            className={`sidebar-subitem ${activePage === "request-donasi" ? "sidebar-active" : ""}`}
                            onClick={() => navigate("/user/owner/request-donasi")}
                        >
                            Request Donasi
                        </div>
                        <div
                            className={`sidebar-subitem ${activePage === "history-donasi" ? "sidebar-active" : ""}`}
                            onClick={() => navigate("/user/owner/history-donasi")}
                        >
                            History Donasi
                        </div>
                    </div>
                </div>

                <div className="sidebar-item" onClick={() => setLaporanOpen(!laporanOpen)}>
                    {laporanOpen ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                    <FaFileAlt className="mr-3" />
                    Laporan
                </div>
                <div className={`ml-4 transition-all duration-300 overflow-hidden ${laporanOpen ? 'max-h-20' : 'max-h-0'}`}>
                    <div
                        className={`sidebar-subitem ${activePage === "laporan" ? "sidebar-active" : ""}`}
                        onClick={() => navigate("/user/owner/laporan")}
                    >
                        Penjualan Bulan ini
                    </div>
                </div>
            </div>

            <div className="relative mt-auto">
                <div className="sidebar-footer cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    <FaUser />
                    <span className="font-semibold ml-3">Raka Pratama</span>
                </div>

                <div
                    className={`absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-md w-40 z-10 py-2 transition-all duration-300 transform ${userMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
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

export default OwnerSidebar;
