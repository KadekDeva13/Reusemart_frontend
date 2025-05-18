import React from "react";
import { Container } from "react-bootstrap";

export default function TopNavbarPegawai() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ backgroundColor: "#a9bf6b", padding: "10px 0", position: "relative" }}>
      <Container fluid className="d-flex justify-content-between align-items-center px-4">
        <img src="/images/Logo.png" alt="Logo" style={{ width: 40 }} />

        {/* Teks tengah di-absolute agar selalu berada di tengah */}
        <h5
          className="text-white m-0 position-absolute top-50 start-50 translate-middle"
          style={{ zIndex: 1 }}
        >
          Dashboard Pegawai CS
        </h5>

        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
          Logout
        </button>
      </Container>
    </div>
  );
}
