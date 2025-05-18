import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { MailIcon } from "lucide-react";

export default function ResetEmailSentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div style={{ maxWidth: "420px" }} className="text-center">
        <div
          className="mx-auto mb-4"
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
          <MailIcon size={28} />
        </div>

        <h4 className="fw-bold">Check your email</h4>
        <p className="text-muted">
          We sent a password reset link to <br />
          <strong>{email || "your email address"}</strong>
        </p>

        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={() => window.open("https://mail.google.com", "_blank")}
        >
          Open email app
        </Button>

        <p className="text-muted">
          Didn't receive the email?{" "}
          <span
            onClick={() => navigate("/forgot-password")}
            style={{ cursor: "pointer", color: "#6f42c1" }}
          >
            Click to resend
          </span>
        </p>

        <Button
          variant="link"
          onClick={() => navigate("/")}
          className="text-muted mt-2"
        >
          ← Back to log in
        </Button>
      </div>
    </div>
  );
}
