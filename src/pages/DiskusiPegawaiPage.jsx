import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import API from "@/utils/api";

export default function DiskusiPegawaiPage() {
  const { id_barang } = useParams();
  const [namaBarang, setNamaBarang] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const token = localStorage.getItem("token");

  // Ambil nama barang sekali
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(
          `/api/barang/${id_barang}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const nama = res.data.nama_barang || res.data.penitipan?.nama_barang;
        setNamaBarang(nama ?? "Barang Tidak Diketahui");
      } catch (err) {
        console.error("Gagal mengambil barang:", err);
        setNamaBarang("Barang Tidak Ditemukan");
      }
    };
    fetchBarang();
  }, [id_barang]);

  // Polling pesan setiap 3 detik
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(
          `/api/diskusi/${id_barang}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formatted = res.data.map((msg) => ({
          text: msg.pesan_diskusi,
          from: msg.id_pegawai ? "pegawai" : "pembeli",
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Gagal memuat pesan:", err);
      }
    };

    fetchMessages(); // load awal
    const interval = setInterval(fetchMessages, 3000); // polling tiap 3 detik

    return () => clearInterval(interval); // cleanup saat unmount
  }, [id_barang, token]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    try {
      await API.post(
        "/api/diskusi/kirim",
        {
          id_barang: parseInt(id_barang),
          pesan_diskusi: input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: "pegawai",
          },
        }
      );

      setInput(""); // Kosongkan input, data akan auto-refresh via polling
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
  };

  return (
    <Container className="pt-5 mt-3">
      <h4 className="fw-bold mb-4">
        Diskusi Pegawai untuk Barang: <strong>{namaBarang}</strong>
      </h4>

      <Card
        className="p-3 mb-4"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${
              msg.from === "pegawai"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 rounded ${
                msg.from === "pegawai"
                  ? "bg-warning text-dark"
                  : "bg-light border"
              }`}
              style={{ maxWidth: "70%" }}
            >
              <div className="fw-semibold mb-1">
                {msg.from === "pegawai" ? "Anda (CS)" : "Pembeli"}
              </div>
              {msg.text}
            </div>
          </div>
        ))}
      </Card>

      <div className="d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Ketik balasan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Kirim</Button>
      </div>
    </Container>
  );
}
