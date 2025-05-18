import React, { useState } from 'react';
import OwnerSidebar from '../layout/OwnerSidebar';
import OwnerRequestDonasiPage from './OwnerRequestDonasiPage';
import './OwnerPage.css';

import HistoryDonasiPage from './HistoryDonasiPage';

const OwnerPage = () => {
    const [activePage, setActivePage] = useState("dashboard");

    const renderMainContent = () => {
        switch (activePage) {
            case "request-donasi":
                return (
                    <OwnerRequestDonasiPage />
                );
            case "history-donasi":
                return (
                    <HistoryDonasiPage />
                )
            default:
                return <h2 className="p-3">Selamat Datang di Dashboard</h2>;
        }
    };

    return (
        <div className="owner-page">
            <OwnerSidebar setActivePage={setActivePage} activePage={activePage} />
            <main className="ml-[230px] py-3 min-h-screen overflow-y-auto">
                {renderMainContent()}
            </main>
        </div>
    );
};

export default OwnerPage;
