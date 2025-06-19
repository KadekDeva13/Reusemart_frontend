import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleEnter = () => {
    sessionStorage.setItem("hasVisited", "true");
    navigate("/home");
  };

  return (
    <div className="bg-[#626f47] h-screen flex items-center justify-between px-10 md:px-20 relative">
      {/* Kiri - Konten */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-white"
      >
        <h1 className="text-4xl md:text-5xl font-bold leading-snug">
          Selamat Datang & Selamat Berbelanja di{" "}
          <span className="font-extrabold">Reusemart</span>
        </h1>
        <p className="text-xl mt-4">
          Pilihan Pintar untuk Barang Bekas Berkualitas
        </p>

        <button
          onClick={handleEnter}
          className="mt-6 px-8 py-3 bg-white text-[#626f47] text-base font-semibold rounded shadow hover:scale-105 transition"
        >
          Masuk ke Reusemart
        </button>

        {/* Fitur Utama */}
        <div className="mt-10 flex flex-col space-y-4 text-white text-lg">
          <div className="flex items-center gap-3">
            <img src="/images/box.png" alt="quality" className="w-8 h-8" />
            <span>Barang Bekas Berkualitas</span>
          </div>
          <div className="flex items-center gap-3">
            <img src="/images/money-bags.png" alt="affordable" className="w-8 h-8" />
            <span>Harga Terjangkau</span>
          </div>
          <div className="flex items-center gap-3">
            <img src="/images/ecology.png" alt="eco" className="w-8 h-8" />
            <span>Ikut Serta Menjaga Lingkungan</span>
          </div>
        </div>
      </motion.div>

      {/* Kanan - Gambar */}
      <motion.img
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        src="/images/person.png"
        alt="Reusemart Welcome"
        className="w-[380px] md:w-[800px]"
      />

      {/* Footer mini */}
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">
        © 2025 Reusemart. Semua Hak Dilindungi.
      </footer>
    </div>
  );
}
