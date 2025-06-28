import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { FaChevronLeft, FaChevronRight, FaStar, FaRegStar } from "react-icons/fa";
import TopNavbar from "../component/TopNavbar";
import TopNavbarNonLogin from "../component/TopNavBarNonLogin";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import API from "@/utils/api";

export default function DetailBarangPage() {
  const { id } = useParams();
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Fetch barang
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await API.get(`/api/barang/${id}`);
        setBarang(res.data);
      } catch (error) {
        console.error("Gagal memuat detail barang:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarang();
  }, [id]);

  // Listen storage event (untuk logout otomatis)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  // Tambah keranjang
  const handleTambahKeranjang = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setAdding(true);
      try {
        await API.post(
          "/api/keranjang/tambah",
          { id_barang: barang.id_barang },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        localStorage.setItem("cart_updated", Date.now());
        window.dispatchEvent(new Event("storage"));
        alert("Barang berhasil ditambahkan ke keranjang!");
      } catch (err) {
        console.error("Gagal menambahkan ke keranjang:", err);
        alert("Gagal menambahkan barang.");
      } finally {
        setAdding(false);
      }
    }
  };

  const handleChatClick = () => {
    navigate(`/user/pembeli/diskusi/${barang.id_barang}`);
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    const d = String(tgl.getDate()).padStart(2, "0");
    const m = String(tgl.getMonth() + 1).padStart(2, "0");
    const y = tgl.getFullYear();
    return `${d}-${m}-${y}`;
  };

  if (loading) return <div className="text-center mt-5">Memuat...</div>;
  if (!barang) return <div className="text-center mt-5">Barang tidak ditemukan.</div>;

  return (
    <div>
      {/* Navbar dinamis */}
      <div className="position-sticky top-0 z-50 bg-white">
        {isLoggedIn ? (
          <TopNavbar handleLogoClick={() => navigate("/")} onLogout={handleLogout} />
        ) : (
          <TopNavbarNonLogin handleLogoClick={() => navigate("/")} />
        )}
      </div>

      {/* Konten Utama */}
      <Container className="mt-5 mb-4 ">
        <Row className="g-4 mt-8">
          <Col md={6} className="relative">
            <div className="relative bg-black rounded max-h-[480px] overflow-hidden">
              {barang.foto_barang.length > 1 && (
                <>
                  <button
                    onClick={() => swiperRef.current.slidePrev()}
                    className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-black/0 rounded-full px-2 py-1 border-0"
                  >
                    <FaChevronLeft className="text-white w-6 h-6" />
                  </button>
                  <button
                    onClick={() => swiperRef.current.slideNext()}
                    className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-black/0 rounded-full px-2 py-1 border-0"
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
                        src={`${API.defaults.baseURL}/storage/${foto.foto_barang}`}
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
                  src={`${API.defaults.baseURL}/storage/${foto.foto_barang}`}
                  alt={`Thumb ${i + 1}`}
                  onClick={() => swiperRef.current.slideToLoop(i)}
                  className={`w-[70px] h-[70px] object-cover cursor-pointer rounded border ${i === selectedImage ? "border-blue-600 border-2" : "border-gray-300"
                    }`}
                />
              ))}
            </div>
          </Col>

          <Col md={6}>
            <h4>{barang.nama_barang}</h4>
            <h3 className="text-danger mb-4">
              Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
            </h3>

            <div className="border rounded p-3 shadow-sm mb-4">
              <div className="d-flex align-items-center mb-3">
                <span className="fw-semibold">
                  {barang.stock > 0 ? (
                    <span className="text-success">Barang tersedia</span>
                  ) : (
                    <span className="text-danger">Barang habis</span>
                  )}
                </span>
              </div>


              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold fs-5 text-dark">
                  Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
                </span>
              </div>

              <Button
                className="w-100 mb-2"
                variant="success"
                onClick={handleTambahKeranjang}
                disabled={adding}
              >
                {adding ? "Menambahkan..." : "+ Keranjang"}
              </Button>

              <div className="d-flex justify-content-between px-3 text-muted fs-6">
                <div
                  className="d-flex align-items-center gap-1"
                  style={{ cursor: "pointer" }}
                  onClick={handleChatClick}
                >
                  <MessageCircle size={16} /> Chat
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Heart size={16} /> Wishlist
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Share2 size={16} /> Share
                </div>
              </div>

              <div className="mt-4 p-3 rounded bg-transparent">
                <h6 className="mb-3">Penitip</h6>
                <div className="flex items-center gap-4">

                  <img
                    src={
                      barang?.detailpenitipan?.penitipan?.penitip?.image_user
                        ? `${API.defaults.baseURL}/storage/foto_penitip/${barang.detailpenitipan.penitipan.penitip.image_user}`
                        : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="Foto Penitip"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold mb-1">
                      {barang?.detailpenitipan?.penitipan?.penitip?.nama_lengkap || "Nama tidak tersedia"}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500 text-xl">
                      {[1, 2, 3, 4, 5].map((star) =>
                        star <= Math.round(barang?.detailpenitipan?.penitipan?.penitip?.rating_penitip) ? (
                          <FaStar key={star} />
                        ) : (
                          <FaRegStar key={star} />
                        )
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <p><strong>Kategori:</strong> {barang.kategori_barang}</p>
            {barang.tanggal_garansi !== '-' ? (
              <p><strong className="text-red-500">Barang Tidak Memiliki Garansi</strong></p>
            ) : (

              <p><strong>Tanggal Kadaluarsa Garansi: </strong>{formatTanggal(barang.tanggal_garansi)}</p>
            )}

            <p>{barang.deskripsi}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
