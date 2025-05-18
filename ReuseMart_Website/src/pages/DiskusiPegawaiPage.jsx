import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import axios from "axios";

export default function DiskusiPegawaiPage() {
  const { id_barang } = useParams();
  const [namaBarang, setNamaBarang] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Ambil nama barang dari API
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/barang/${id_barang}`);
        setNamaBarang(res.data.nama_barang);
      } catch (err) {
        console.error("Gagal mengambil barang:", err);
        setNamaBarang("Barang Tidak Ditemukan");
      }
    };

    fetchBarang();
  }, [id_barang]);

  // Dummy pesan awal (bisa diganti dari API nanti)
  useEffect(() => {
    setMessages([
      { from: "pembeli", text: "Halo, apakah barang ini masih tersedia?" },
      { from: "pegawai", text: "Iya, masih tersedia kak." },
    ]);
  }, []);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { from: "pegawai", text: input }]);
    setInput("");
  };

  return (
    <Container className="pt-5 mt-3">
      <h4 className="fw-bold mb-4">Diskusi Pegawai untuk Barang: <strong>{namaBarang}</strong></h4>

      <Card className="p-3 mb-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${msg.from === "pegawai" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-2 rounded ${msg.from === "pegawai" ? "bg-warning text-dark" : "bg-light border"}`}
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
