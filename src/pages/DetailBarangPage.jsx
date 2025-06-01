import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TopNavbarNonLogin from "../component/TopNavBarNonLogin";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function DetailBarangPage() {
  const { id } = useParams();
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/barang/${id}`);
        setBarang(res.data);
      } catch (error) {
        console.error("Gagal memuat detail barang:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarang();
  }, [id]);

  const handleChatClick = () => {
    navigate(`/user/pembeli/diskusi/${barang.id_barang}`);
  };

  if (loading) return <div className="text-center mt-5">Memuat...</div>;
  if (!barang)
    return <div className="text-center mt-5">Barang tidak ditemukan.</div>;

  const handleTambahKeranjang = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login") }
    else {
      setAdding(true);
      try {
        await axios.post(
          "http://localhost:8000/api/keranjang/tambah",
          { id_barang: barang.id_barang },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  return (
    <div>
      <div className="position-sticky top-0 z-50 bg-white">
        <TopNavbarNonLogin handleLogoClick={() => navigate("/")} />
      </div>

      <Container className="mt-5 mb-4">
        <Row className="g-4">
          {/* Kolom Kiri: Gambar */}
          <Col md={6} className="relative">
            {/* Wrapper Swiper + Panah */}
            <div className="relative bg-black rounded max-h-[480px] overflow-hidden">
              {barang.foto_barang.length > 1 && (
                <>
                  {/* Panah kiri */}
                  <button
                    onClick={() => swiperRef.current.slidePrev()}
                    className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-black/0 rounded-full px-2 py-1 border-0"
                  >
                    <FaChevronLeft className="text-white w-6 h-6" />
                  </button>

                  {/* Panah kanan */}
                  <button
                    onClick={() => swiperRef.current.slideNext()}
                    className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-black/0 rounded-full px-2 py-1 border-0"
                  >
                    <FaChevronRight className="text-white w-6 h-6" />
                  </button>
                </>
              )}

              {/* Swiper */}
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

            {/* Indikator Posisi */}
            <div className="text-center text-muted mt-2 mb-3">
              {selectedImage + 1} / {barang.foto_barang.length}
            </div>

            {/* Thumbnail */}
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
          </Col>

          {/* Kolom Kanan: Detail dan Aksi */}
          <Col md={6}>
            <h4>{barang.nama_barang}</h4>
            <h3 className="text-danger mb-4">
              Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
            </h3>

            {/* Card Aksi Pembelian */}
            <div className="border rounded p-3 shadow-sm mb-4">
              <div className="fw-semibold mb-2">Atur jumlah dan catatan</div>

              <div className="d-flex align-items-center mb-3">
                <span className="fw-semibold">
                  Stok Total: Sisa {barang.stock}
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
            </div>

            {/* Detail Tambahan */}
            <h6>Detail Barang</h6>
            <p>
              <strong>Kategori:</strong> {barang.kategori_barang}
            </p>
            {barang.tanggal_garansi && (
              <p>
                <strong>Garansi:</strong> {barang.tanggal_garansi}
              </p>
            )}
            <p>{barang.deskripsi}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
