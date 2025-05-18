// RegisterOrganisasiPage.js
import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterOrganisasiPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_organisasi: "",
    nama_penerima: "",
    no_telepon: "",
    alamat: "", 
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/register-organisasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        const message =
          result.errors?.[Object.keys(result.errors)[0]]?.[0] || result.message;
        throw new Error(message);
      }

      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
      toast.error("Registrasi gagal!");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5"
      style={{ minHeight: "100vh", backgroundColor: "#626f47" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="p-4 shadow-sm">
              <h3 className="text-center mb-4">Daftar Organisasi</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Organisasi</Form.Label>
                  <Form.Control
                    type="text"
                    name="nama_organisasi"
                    value={formData.nama_organisasi}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Penerima</Form.Label>
                  <Form.Control
                    type="text"
                    name="nama_penerima"
                    value={formData.nama_penerima}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>No Telepon</Form.Label>
                  <Form.Control
                    type="text"
                    name="no_telepon"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="w-100"
                  style={{ backgroundColor: "#626f47", borderColor: "#626f47" }}
                >
                  Daftar
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
