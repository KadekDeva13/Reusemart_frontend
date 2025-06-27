import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { Trash2 } from "lucide-react";

const KeranjangPagePembeli = () => {
  const [keranjang, setKeranjang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [metodePengiriman, setMetodePengiriman] = useState("kurir");
  const [alamatList, setAlamatList] = useState([]);
  const [alamatDipilih, setAlamatDipilih] = useState(null);
  const [poinDimiliki, setPoinDimiliki] = useState(0);
  const [poinTukar, setPoinTukar] = useState(0);

  useEffect(() => {
    fetchKeranjang();
    fetchAlamatDanPoin();
  }, []);

  const fetchKeranjang = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/keranjang", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setKeranjang(res.data);
    } catch (error) {
      console.error("Gagal mengambil data keranjang:", error);
    }
    setLoading(false);
  };

  const fetchAlamatDanPoin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8000/api/pembeli/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const alamat = res.data.alamat || [];
      const utama = alamat.find((a) => a.utama === 1 || a.utama === true);

      setPoinDimiliki(res.data.poin_sosial || 0);
      setAlamatList(alamat);
      setAlamatDipilih(utama?.id_alamat || null);
    } catch (err) {
      console.error("Gagal fetch alamat & poin", err);
    }
  };

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleHapus = async (idKeranjang) => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8000/api/keranjang/hapus/${idKeranjang}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("cart_updated", Date.now());
      fetchKeranjang();
    } catch (error) {
      console.error("Gagal menghapus item keranjang:", error);
    }
    setRefreshing(false);
  };

  const selectedKeranjang = keranjang.filter((item) =>
    selectedItems.includes(item.id)
  );

  const subtotal = selectedKeranjang.reduce((sum, item) => {
    const harga = item.barang?.harga_barang || 0;
    return sum + harga * item.jumlah;
  }, 0);

  const ongkir =
    metodePengiriman === "kurir" && subtotal < 1500000 ? 100000 : 0;
  const potongan = Math.min(poinTukar, poinDimiliki) * 100;
  const totalAkhir = subtotal + ongkir - potongan;

  const poinUtama = Math.floor(subtotal / 10000);
  const bonusPoin = subtotal >= 500000 ? Math.floor(poinUtama * 0.2) : 0;
  const totalPoinDidapat = poinUtama + bonusPoin;

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (selectedItems.length === 0) return;

    try {
      await axios.post(
        "http://localhost:8000/api/checkout",
        {
          keranjang_ids: selectedItems,
          metode_pengiriman: metodePengiriman,
          alamat_id: metodePengiriman === "kurir" ? alamatDipilih : null,
          poin_ditukar: poinTukar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Checkout berhasil!");
      setSelectedItems([]);
      fetchKeranjang();
      localStorage.setItem("cart_updated", Date.now());
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Checkout gagal:", error);
      alert("Terjadi kesalahan saat checkout.");
    }
  };

  return (
    <Container className="pt-5 mt-4">
      <h4 className="mb-4">🛒 Keranjang Saya</h4>

      {loading ? (
        <Spinner animation="border" />
      ) : keranjang.length === 0 ? (
        <p>Keranjang kamu kosong.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Pilih</th>
                <th>Barang</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {keranjang.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                    />
                  </td>
                  <td>{item.barang?.nama_barang}</td>
                  <td>Rp{item.barang?.harga_barang?.toLocaleString()}</td>
                  <td>{item.jumlah}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleHapus(item.id)}
                      disabled={refreshing}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="mt-4">
            <h5>Pengiriman</h5>
            <select
              className="form-select mb-2"
              value={metodePengiriman}
              onChange={(e) => setMetodePengiriman(e.target.value)}
            >
              <option value="kurir">Kurir (Yogyakarta saja)</option>
              <option value="ambil">Ambil sendiri (ke gudang)</option>
            </select>

            {metodePengiriman === "kurir" && (
              <select
                className="form-select mb-3"
                value={alamatDipilih || ""}
                onChange={(e) => setAlamatDipilih(e.target.value)}
              >
                <option value="">Pilih alamat</option>
                {alamatList.map((alamat) => (
                  <option key={alamat.id_alamat} value={alamat.id_alamat}>
                    {alamat.detail_alamat}, {alamat.kelurahan},{" "}
                    {alamat.kecamatan}
                    {alamat.utama === 1 && " (Utama)"}
                  </option>
                ))}
              </select>
            )}

            <h5>Poin</h5>
            <div className="mb-2">
              <div>Poin dimiliki: {poinDimiliki}</div>
              <input
                type="number"
                className="form-control"
                placeholder="Masukkan poin yang ingin ditukar"
                value={poinTukar}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val <= poinDimiliki && val >= 0) {
                    setPoinTukar(val);
                  } else if (e.target.value === "") {
                    setPoinTukar(0);
                  }
                }}
              />
            </div>

            <div className="text-end mt-4">
              <p>Subtotal: Rp{subtotal.toLocaleString("id-ID")}</p>
              <p>Ongkir: Rp{ongkir.toLocaleString("id-ID")}</p>
              <p>Potongan dari poin: Rp{potongan.toLocaleString("id-ID")}</p>
              <h5>Total Akhir: Rp{totalAkhir.toLocaleString("id-ID")}</h5>

              <hr />
              <p>Poin didapat: {poinUtama}</p>
              {bonusPoin > 0 && (
                <p className="text-success">
                  Bonus poin: {bonusPoin} (20% dari poin utama)
                </p>
              )}
              <h5>Total Poin Setelah Checkout: {totalPoinDidapat}</h5>

              <Button
                variant="success"
                className="mt-2"
                disabled={
                  selectedItems.length === 0 ||
                  (metodePengiriman === "kurir" && !alamatDipilih)
                }
                onClick={handleCheckout}
              >
                Checkout ({selectedItems.length} item)
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default KeranjangPagePembeli;
