import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Navbar, Container, Form } from "react-bootstrap";
import { Bell, ShoppingCart, Mail } from "lucide-react";
import axios from "axios";
import SearchBar from "./SearchBar";

const TopNavbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );
  const dropdownRef = useRef();

  const [cartCount, setCartCount] = useState(0);


  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProfileImage = () => {
      if (token) {
        axios
          .get("http://localhost:8000/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const data = res.data;
            const image = data.image_user;
            if (image) {
              const isFullUrl = image.startsWith("http");
              const url = isFullUrl
                ? image
                : `http://localhost:8000/storage/foto_pembeli/${image}`;
              setAvatarUrl(url);
            } else {
              setAvatarUrl(
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              );
            }
          })
          .catch((err) => {
            console.error("Gagal memuat avatar:", err);
          });
      }
    };

    fetchProfileImage();
    fetchCartCount();

    const handleStorageChange = (e) => {
      if (e.key === "avatar_updated") {
        fetchProfileImage();
      }
      if (e.key === "cart_updated") {
        fetchCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  const fetchCartCount = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/keranjang/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCartCount(res.data.count || 0);
      })
      .catch((err) => {
        console.error("Gagal mengambil jumlah keranjang:", err);
      });
  };

  return (
    <Navbar
      fixed="top"
      className="navbar-custom shadow-sm border-bottom py-2"
      style={{ backgroundColor: "#a9bf6b" }}
    >
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <img
          src="/images/Logo.png"
          alt="Logo"
          style={{ width: "40px", height: "40px", objectFit: "contain", cursor: "pointer" }}
          onClick={() => navigate("/user/pembeli")}
        />

        <div className="mx-auto w-100 px-3" style={{ maxWidth: "600px", position: "relative" }}>
          <SearchBar />
        </div>

        <div className="d-flex align-items-center gap-4">
          <Bell size={20} style={{ color: "#fff", cursor: "pointer" }} />
          <Mail size={20} style={{ color: "#fff", cursor: "pointer" }} />
          <div
            className="position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/user/pembeli/keranjang")}
          >
            <ShoppingCart size={20} style={{ color: "#fff" }} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {cartCount}
              </span>
            )}
          </div>

          <div className="position-relative" ref={dropdownRef}>
            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={avatarUrl}
                alt="avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                }}
                className="rounded-circle"
                style={{ width: "32px", height: "32px", objectFit: "cover" }}
              />
            </div>

            {showDropdown && (
              <div
                className="dropdown-menu show"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  backgroundColor: "#fff",
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  zIndex: 999,
                  borderRadius: "8px",
                  padding: "0.5rem",
                  minWidth: "180px",
                }}
              >
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/user/profile/pembeli")
                  }}
                >
                  Akun Saya

                </button>
                <button
                  className="dropdown-item text-danger"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
