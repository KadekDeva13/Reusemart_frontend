import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import API from "@/utils/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUser = async (token) => {
    try {
      const res = await API.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = res.data;
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
      const res = await API.post("/api/login", { email, password });

      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("isAuthenticated", "true");

      toast.success("Login berhasil!");

      switch (role) {
        case "admin":
          navigate("/user/admin/daftar-pegawai");
          break;
        case "owner":
          navigate("/user/owner/request-donasi");
          break;
        case "pegawai":
          navigate("/user/pegawai/penitip");
          break;
        case "penitip":
          navigate("/user/penitip");
          break;
        case "pembeli":
          navigate("/user/pembeli");
          break;
        case "organisasi":
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
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      if (error.response?.status === 403) {
        const errData = error.response.data;
        setError(errData.message || "Akun belum memiliki role atau role tidak valid");
        toast.error("Role tidak valid!");
      } else {
        setError("Gagal masuk. Periksa email dan password Anda.");
        toast.error("Login gagal!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Login Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-0 m-0 bg-white">
        <div className="login-box shadow">
          <div className="login-form-container">
            <h1 className="text-center login-title">Login</h1>

            {error && (
              <div className="flex items-center bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="form-control login-input"
                />
              </div>

              <div className="mb-4 relative">
                <div className="flex justify-between items-center mb-1">
                  <label>Password</label>
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="form-control login-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none bg-transparent"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="signin-button flex items-center justify-center gap-2"
              >
                {isLoading ? "Processing..." : "SIGN IN"}
                <ArrowRight size={18} />
              </button>

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
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#626f47] items-center justify-center p-10 relative">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Selamat Datang & Selamat Berbelanja di{" "}
            <span className="text-gray-50 font-bold">Reusemart</span>
          </h1>
          <img
            src="/images/person.png"
            alt="Login Illustration"
            className="w-80 mx-auto mb-6"
          />
        </div>
      </div>
    </div>
  );
}
