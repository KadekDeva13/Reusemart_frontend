import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";

export default function DetailBarangPenitipanPage() {
  const { id } = useParams();
  const [penitipan, setPenitipan] = useState(null);
  const [barang, setBarang] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusTransaksi, setStatusTransaksi] = useState("");
  const [statusBarang, setStatusBarang] = useState("");
  const [konfirmasiLoading, setKonfirmasiLoading] = useState(false);
  const [perpanjangLoading, setPerpanjangLoading] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/penitipan/show/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPenitipan(res.data.penitipan);
        setBarang(res.data.barang);
        setStatusTransaksi(res.data.status_transaksi);
        setStatusBarang(res.data.status_barang);
      } catch (error) {
        console.error("Gagal memuat detail penitipan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleKonfirmasiAmbil = async () => {
    if (!window.confirm("Yakin ingin mengambil barang ini?")) return;
    try {
      setKonfirmasiLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:8000/api/transaksi/konfirmasi-ambil/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Barang berhasil dikonfirmasi telah diambil.");
      fetchDetail();
    } catch (error) {
      alert(
        error.response?.data?.message || "Gagal mengonfirmasi pengambilan barang."
      );
    } finally {
      setKonfirmasiLoading(false);
    }
  };

  const handlePerpanjang = async () => {
    if (!window.confirm("Yakin ingin memperpanjang masa penitipan 30 hari?")) return;

    try {
      setPerpanjangLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:8000/api/penitipan/perpanjang/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "Perpanjangan berhasil.");
      fetchDetail();
    } catch (error) {
      alert(
        error.response?.data?.message || "Gagal memperpanjang masa penitipan."
      );
    } finally {
      setPerpanjangLoading(false);
    }
  };

  const renderStatusBarang = () => {
    const text = statusBarang?.toLowerCase();
    if (text === "donasi")
      return <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Donasi</span>;
    if (text === "tersedia")
      return <span className="px-3 py-1 bg-green-500 text-white rounded text-sm">Tersedia</span>;
    if (text === "terjual" || text === "soldout")
      return <span className="px-3 py-1 bg-red-500 text-white rounded text-sm">Terjual</span>;
  };

  const renderStatusTransaksi = () => {
    const text = statusTransaksi?.toLowerCase();
    if (text === "pending" || text === "disiapkan")
      return <span className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">📦 Disiapkan</span>;
    if (text === "dikirim")
      return <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">🚚 Dikirim</span>;
    if (text === "selesai")
      return <span className="px-3 py-1 bg-green-600 text-white rounded text-sm">✅ Selesai</span>;
    if (text === "hangus")
      return <span className="px-3 py-1 bg-red-700 text-white rounded text-sm">🔥 Hangus</span>;
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  if (!penitipan || !barang) {
    return <div className="text-center mt-10 text-gray-500">Data tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Gambar Swiper */}
        <div className="relative">
          <div className="relative bg-black rounded max-h-[480px] overflow-hidden">
            {barang.foto_barang?.length > 1 && (
              <>
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-black/0 px-2 py-1 border-0"
                >
                  <FaChevronLeft className="text-white w-6 h-6" />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-black/0 px-2 py-1 border-0"
                >
                  <FaChevronRight className="text-white w-6 h-6" />
                </button>
              </>
            )}

            <Swiper
              modules={[Pagination]}
              loop={true}
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setSelectedImage(swiper.realIndex)}
              className="rounded"
            >
              {barang.foto_barang.map((foto, i) => (
                <SwiperSlide key={i}>
                  <div className="flex justify-center items-center h-[450px] bg-black-100">
                    <img
                      src={`http://localhost:8000/storage/${foto.foto_barang}`}
                      alt={`Foto ${i + 1}`}
                      className="rounded max-h-full max-w-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="text-center text-muted mt-2 mb-3">
            {selectedImage + 1} / {barang.foto_barang.length}
          </div>

          <div className="flex justify-center flex-wrap gap-2">
            {barang.foto_barang.map((foto, i) => (
              <img
                key={i}
                src={`http://localhost:8000/storage/${foto.foto_barang}`}
                alt={`Thumb ${i + 1}`}
                onClick={() => swiperRef.current.slideToLoop(i)}
                className={`w-[70px] h-[70px] object-cover cursor-pointer rounded border ${i === selectedImage
                  ? "border-blue-600 border-2"
                  : "border-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Detail Barang & Penitipan */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">{barang.nama_barang}</h2>
          <h3 className="text-xl text-green-600 font-bold mb-4">
            Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
          </h3>

          <div className="border p-4 rounded shadow mb-5 bg-white">
            <h4 className="font-semibold mb-3 text-gray-700">Informasi Penitipan</h4>
            <p><strong>Kategori:</strong> {barang.kategori_barang}</p>
            <p><strong>Tanggal Masuk:</strong> {penitipan.tanggal_masuk}</p>
            <p><strong>Tanggal Akhir:</strong> {penitipan.tanggal_akhir}</p>
            <p><strong>Batas Pengambilan:</strong> {penitipan.batas_pengambilan}</p>
            <p><strong>Status Perpanjangan:</strong> {penitipan.status_perpanjangan}</p>

            <div className="mt-4 space-x-2">
              {renderStatusBarang()}
              {renderStatusTransaksi()}
            </div>

            <div className="mt-4 flex gap-3 flex-wrap">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={perpanjangLoading || penitipan.status_perpanjangan.toLowerCase() !== "diperpanjang"}
                onClick={handlePerpanjang}
              >
                {perpanjangLoading ? "Memproses..." : "Perpanjang Penitipan 30 Hari"}
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={konfirmasiLoading || !(statusTransaksi === "pending" || statusTransaksi === "disiapkan")}
                onClick={handleKonfirmasiAmbil}
              >
                {konfirmasiLoading ? "Memproses..." : "Konfirmasi Barang Sudah Diambil"}
              </button>
            </div>
          </div>

          <h4 className="font-semibold">Detail Barang</h4>
          <p className="text-gray-600">{barang.deskripsi || "Tidak ada deskripsi."}</p>
        </div>
      </div>
    </div>
  );
}
