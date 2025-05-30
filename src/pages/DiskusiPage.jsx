import React, { useState, useEffect, useRef } from "react";
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

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/barang/${id_barang}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNamaBarang(res.data.nama_barang || "Barang Tidak Diketahui");
      } catch (error) {
        setNamaBarang("Barang Tidak Ditemukan");
      }
    };
    fetchBarang();
  }, [id_barang, token]);

  useEffect(() => {
    const fetchDiskusi = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/diskusi/${id_barang}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const formatted = res.data.map((msg) => ({
          text: msg.pesan_diskusi,
          from: msg.id_pembeli ? "pembeli" : "pegawai",
          waktu: msg.created_at,
        }));
        setMessages(formatted);
        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      } catch (error) {
        console.error("Gagal memuat diskusi:", error);
      }
    };

    fetchDiskusi();
    const interval = setInterval(fetchDiskusi, 3000);
    return () => clearInterval(interval);
  }, [id_barang, token]);

  const handleSend = async () => {
    if (input.trim() === "") return;
    try {
      await axios.post(
        "http://localhost:8000/api/diskusi/kirim",
        {
          id_barang: parseInt(id_barang),
          pesan_diskusi: input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        }
      );
      setInput("");
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  const formatWaktu = (waktuStr) => {
    const tanggal = new Date(waktuStr);
    return tanggal.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Container className="pt-4 pb-2">
        <h5 className="fw-bold mb-3">
          Diskusi Barang: <strong>{namaBarang}</strong>
        </h5>
      </Container>

      {/* Chat area */}
      <div
        className="flex-grow-1 overflow-auto px-3"
        style={{ marginBottom: "80px" }}
      >
        <div className="d-flex flex-column gap-3">
          {messages.map((msg, idx) => (
            <Card key={idx} className="p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div
                  className={`rounded-circle ${
                    msg.from === "pembeli" ? "bg-secondary" : "bg-warning"
                  }`}
                  style={{ width: 30, height: 30 }}
                />
                <span className="fw-semibold">
                  {msg.from === role ? "Anda (Pembeli)" : "Pegawai"}
                </span>
              </div>
              <div className="ps-5">{msg.text}</div>
              <div className="text-end text-muted small mt-2">
                {formatWaktu(msg.waktu)}
              </div>
            </Card>
          ))}
          <div ref={scrollRef}></div>
        </div>
      </div>

      {/* Input tetap di bawah */}
      <div className="position-fixed bottom-0 start-0 end-0 bg-white border-top p-3">
        <Container className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Tulis pesan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Kirim</Button>
        </Container>
      </div>
    </div>
  );
}
