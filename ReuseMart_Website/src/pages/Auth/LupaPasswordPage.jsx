import { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { AlertCircle } from "lucide-react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) return setError("Email tidak boleh kosong.");

    try {
      const res = await axios.post("http://localhost:8000/api/password/email", {
        email,
      });

      setMessage(res.data.message || "Link reset telah dikirim ke email.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengirim email reset password."
      );
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-4">Lupa Password</h3>

      {message && <Alert variant="success">{message}</Alert>}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          <AlertCircle size={16} className="me-2" />
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Masukkan Email Anda</Form.Label>
          <Form.Control
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">
          Kirim Link Reset Password
        </Button>
      </Form>
    </Container>
  );
}
