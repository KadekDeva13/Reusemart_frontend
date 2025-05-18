import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";

export default function DiskusiPage() {
  const { id_barang } = useParams();
  const [namaBarang, setNamaBarang] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const role = localStorage.getItem("role") || "pembeli";
  const token = localStorage.getItem("token");

  // Ambil nama barang
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/barang/${id_barang}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNamaBarang(res.data.nama_barang || "Barang Tidak Diketahui");
      } catch (error) {
        console.error("Gagal mengambil nama barang:", error);
        setNamaBarang("Barang Tidak Ditemukan");
      }
    };
    fetchBarang();
  }, [id_barang, token]);

  // Ambil diskusi (polling tiap 3 detik)
  useEffect(() => {
    const fetchDiskusi = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/diskusi/${id_barang}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formatted = res.data.map((msg) => ({
          text: msg.pesan_diskusi,
          from: msg.id_pembeli ? "pembeli" : "pegawai"
        }));

        setMessages(formatted);
      } catch (error) {
        console.error("Gagal memuat diskusi:", error);
      }
    };

    fetchDiskusi(); // ambil pertama kali
    const interval = setInterval(fetchDiskusi, 3000); // polling 3 detik
    return () => clearInterval(interval);
  }, [id_barang, token]);

  // Kirim pesan
  const handleSend = async () => {
    if (input.trim() === "") return;
    try {
      await axios.post(
        "http://localhost:8000/api/diskusi/kirim",
        {
          id_barang: parseInt(id_barang),
          pesan_diskusi: input
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role
          }
        }
      );
      setInput("");
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  return (
    <Container className="pt-5 mt-3">
      <h4 className="fw-bold mb-4">Diskusi Barang: <strong>{namaBarang}</strong></h4>

      <div className="d-flex flex-column gap-3">
        {messages.map((msg, idx) => (
          <Card key={idx} className="p-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className={`rounded-circle ${msg.from === "pembeli" ? "bg-secondary" : "bg-warning"}`}
                style={{ width: 30, height: 30 }}
              />
              <span className="fw-semibold">
                {msg.from === role ? "Anda (Pembeli)" : "Pegawai"}
              </span>
            </div>
            <div className="ps-5">{msg.text}</div>
          </Card>
        ))}
      </div>

      <div className="mt-4 d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Tulis pesan untuk mulai diskusi..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Kirim</Button>
      </div>
    </Container>
  );
}
