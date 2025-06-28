import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { AlertCircle } from "lucide-react";
import API from "@/utils/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Email tidak boleh kosong.");

    try {
      const res = await API.post("/api/password/email", {
        email,
      });

      // Redirect ke halaman konfirmasi
      navigate(`/reset-email-sent?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengirim email reset password."
      );
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container style={{ maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <div
            className="mx-auto mb-3"
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#eee",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🔑
          </div>
          <h4 className="fw-bold">Forgot password?</h4>
          <p className="text-muted">No worries, we’ll send you reset instructions.</p>
        </div>

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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Reset password
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-muted"
          >
            ← Back to log in
          </Button>
        </div>
      </Container>
    </div>
  );
}
