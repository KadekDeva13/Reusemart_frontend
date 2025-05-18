import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token || !email) {
      setError("Link tidak valid atau sudah kadaluarsa.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/password/reset", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(res.data.message || "Password berhasil direset.");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Reset password gagal. Coba lagi."
      );
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-4">Reset Password</h3>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Password Baru</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password baru"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Konfirmasi Password</Form.Label>
          <Form.Control
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Ulangi password baru"
          />
        </Form.Group>

        <Button type="submit" className="w-100" variant="primary">
          Reset Password
        </Button>
      </Form>
    </Container>
  );
}
