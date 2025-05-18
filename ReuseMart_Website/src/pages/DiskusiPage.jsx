import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";

export default function DiskusiPage() {
  const { id_barang } = useParams();
  const [namaBarang, setNamaBarang] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Ambil role user dari localStorage
  const role = localStorage.getItem("role") || "pembeli";

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/barang/${id_barang}`);
        setNamaBarang(res.data.nama_barang || "Barang Tidak Diketahui");
      } catch (error) {
        console.error("Gagal mengambil nama barang:", error);
        setNamaBarang("Barang Tidak Ditemukan");
      }
    };

    fetchBarang();
  }, [id_barang]);

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessage = { from: role, text: input, replies: [] };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  const handleReply = (index, replyText) => {
    if (replyText.trim() === "") return;

    const updated = [...messages];
    updated[index].replies.push({ from: role, text: replyText });
    setMessages(updated);
  };

  return (
    <Container className="pt-5 mt-3">
      <h4 className="fw-bold mb-4">Diskusi Barang: <strong>{namaBarang}</strong></h4>

      <div className="d-flex flex-column gap-3">
        {messages.map((msg, idx) => (
          <Card key={idx} className="p-3">
            {/* Pesan Utama */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="rounded-circle bg-secondary" style={{ width: 30, height: 30 }} />
              <span className="fw-semibold">
                {msg.from === role ? "Anda (Pembeli)" : "Pegawai"}
              </span>
            </div>
            <div className="ps-5">{msg.text}</div>

            {/* Balasan */}
            {msg.replies.map((reply, rIdx) => (
              <div key={rIdx} className="ps-5 mt-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div className={`rounded-circle ${reply.from === "pembeli" ? "bg-secondary" : "bg-warning"}`} style={{ width: 28, height: 28 }} />
                  <span className="fw-semibold">{reply.from === role ? "Anda (Pembeli)" : "Pegawai"}</span>
                </div>
                <div className="ps-4">{reply.text}</div>
              </div>
            ))}

            {/* Input Balas */}
            <div className="ps-5 mt-3 d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Balas pesan ini..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleReply(idx, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Input Utama Kirim */}
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
