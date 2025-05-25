import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUser = async (token) => {
    try {
      const res = await fetch("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal ambil data user");

      const userData = await res.json();
      console.log("User yang login:", userData);
    } catch (err) {
      console.error("Gagal fetch user:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 403) {
        const errData = await res.json();
        setError(
          errData.message || "Akun belum memiliki role atau role tidak valid"
        );
        toast.error("Role tidak valid!");
        return;
      }

      if (!res.ok) throw new Error("Gagal login");

      const data = await res.json();
      const { token, role } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("isAuthenticated", "true");

      toast.success("Login berhasil!");

      // Routing berdasarkan role
      switch (role) {
        case "admin":
          navigate("/user/admin/daftar-pegawai");
          break;
        case "owner":
          navigate("/user/owner/request-donasi");
          break;
        case "pegawai":
          console.log("Redirecting to: /user/pegawai/penitip");
          navigate("/user/pegawai/penitip");
          break;
        case "penitip":
          console.log("Redirecting to: /user/penitip");
          navigate("/user/penitip");
          break;
        case "pembeli":
          console.log("Redirecting to: /user/pembeli");
          navigate("/user/pembeli");
          break;
        case "organisasi":
          console.log("Redirecting to: /user/organisasi");
          navigate("/user/organisasi");
          break;
        case "gudang":
          console.log("Redirecting to: /user/pegawai gudang");
          navigate("/user/gudang");
          break;
        default:
          navigate("/");
      }

      fetchUser(token);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Gagal masuk. Periksa email dan password Anda.");
      toast.error("Login gagal!");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      fluid
      className="login-container"
      style={{ padding: "0px", margin: "0px" }}
    >
      <div className="login-left">
        <div className="login-box shadow">
          <div className="login-form-container">
            <h1 className="text-center login-title">Login</h1>

            {error && (
              <Alert variant="danger" className="d-flex align-items-center">
                <AlertCircle size={16} className="me-2" />
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="login-input"
                />
              </Form.Group>

              <Form.Group className="mb-4 position-relative">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label>Password</Form.Label>
                  <a
                    href="/forgot-password"
                    className="forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/forgot-password");
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="login-input"
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0 text-muted border-0 bg-transparent"
                    style={{ height: "100%", paddingRight: "10px" }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="signin-button"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "SIGN IN"}
                <ArrowRight size={18} className="ms-2" />
              </Button>

              <div className="text-center mt-4 signup-text">
                <span>I don't have an account? </span>
                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                >
                  Register
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-image-container">
          <img src="images/person.png" alt="Login" className="login-image" />
        </div>
      </div>
    </Container>
  );
}
