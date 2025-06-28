import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { KeyRound } from "lucide-react";
import API from "@/utils/api";

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
      const res = await API.post("/api/password/reset", {
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
            <KeyRound size={28} />
          </div>
          <h4 className="fw-bold">Set new password</h4>
          <p className="text-muted">
            Your new password must be different to previously used passwords.
          </p>
        </div>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
            <Form.Text className="text-muted">
              Must be at least 8 characters.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="********"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mb-3">
            Reset password
          </Button>
        </Form>

        <div className="text-center">
          <Button variant="link" className="text-muted" onClick={() => navigate("/")}>
            ← Back to log in
          </Button>
        </div>
      </Container>
    </div>
  );
}
