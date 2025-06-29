import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { AlertCircle, Eye, EyeOff, Upload } from "lucide-react";
import API from "@/utils/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    birthDate: "",
    password: "",
  });
  const [userImage, setUserImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.gender ||
      !formData.birthDate ||
      !formData.password
    ) {
      setError("Semua field harus diisi");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Format nomor telepon tidak valid");
      return;
    }

    if (!userImage) {
      setError("Silakan unggah foto profil");
      return;
    }

    setIsLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("nama_lengkap", formData.fullName);
      formPayload.append("email", formData.email);
      formPayload.append("no_telepon", formData.phoneNumber);
      formPayload.append(
        "gender",
        formData.gender === "L" ? "Laki-laki" : "Perempuan"
      );
      formPayload.append("tanggal_lahir", formData.birthDate);
      formPayload.append("password", formData.password);
      formPayload.append("image_user", userImage);

      const res = await API.post("/api/register", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registrasi berhasil! Silahkan login.");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.errors?.[
          Object.keys(err.response.data.errors || {})[0]
        ]?.[0] ||
        err.response?.data?.message ||
        "Registrasi gagal";

      setError(message);
      toast.error("Registrasi gagal!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 custom-bg py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Daftar</h2>
                </div>

                {error && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <AlertCircle size={16} className="me-2" />
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-3 text-center">
                      <div className="position-relative d-inline-block">
                        <div
                          className="rounded-circle overflow-hidden mb-2 border"
                          style={{
                            width: "120px",
                            height: "120px",
                            backgroundColor: "#f8f9fa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Upload size={40} className="text-muted" />
                          )}
                        </div>
                        <Form.Group controlId="userImage">
                          <Form.Label
                            className="btn btn-sm btn-outline-secondary mt-1"
                            htmlFor="userImageInput"
                          >
                            {imagePreview ? "Ganti Foto" : "Unggah Foto"}
                          </Form.Label>
                          <Form.Control
                            id="userImageInput"
                            type="file"
                            name="image_user"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Nama Lengkap</Form.Label>
                        <Form.Control
                          name="fullName"
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          value={formData.fullName}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Nomor Telepon</Form.Label>
                        <Form.Control
                          name="phoneNumber"
                          type="text"
                          placeholder="Masukkan nomor telepon"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          type="email"
                          placeholder="Masukkan email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="bg-light text-dark"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Jenis Kelamin</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            type="radio"
                            label="Laki-laki"
                            name="gender"
                            id="male"
                            value="L"
                            checked={formData.gender === "L"}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="Perempuan"
                            name="gender"
                            id="female"
                            value="P"
                            checked={formData.gender === "P"}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Tanggal Lahir</Form.Label>
                        <Form.Control
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group className="position-relative">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 mt-3 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Daftar"}
                  </Button>

                  <div className="text-center mt-3">
                    <span className="text-muted">Sudah punya akun? </span>
                    <a
                      href="/"
                      className="text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/");
                      }}
                    >
                      Masuk
                    </a>
                    <br />
                    <span className="text-muted">Ingin daftar sebagai </span>
                    <a
                      href="/register-organisasi"
                      className="text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/register-organisasi");
                      }}
                    >
                      Organisasi?
                    </a>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
