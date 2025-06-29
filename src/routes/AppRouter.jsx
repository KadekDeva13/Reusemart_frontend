import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Protected
import ProtectedRoutes from "./ProtectedRoutes";

//Non-Login
import HomeNonLoginPage from "../pages/HomeNonLoginPage";
import KategoriBarangNonLoginPage from "../pages/KatagoriBarangNonLoginPage";
import SearchBarangPage from "../pages/SearchBarangPage";
import DetailBarangNonLogin from "../pages/DetailBarangNonLogin";


// Layouts
import PembeliLayout from "../layouts/PembeliLayout";
import PenitipLayout from "../layouts/PenitipLayout";
import PegawaiCSLayout from "../layouts/PegawaiCSLayout";
import RequestDonasiLayout from "../layouts/RequestDonasiLayout";
import ResetEmailSentPage from "../pages/Auth/ResetPasswordSent";
import OwnerLayout from "../layouts/OwnerLayout";
import PegawaiGudangLayout from "../layouts/PegawaiGudangLayout";
import PublicLayout from "../layouts/PublicLayout";

// Auth Pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import RegisterOrganisasiPage from "../pages/Auth/OrganisasiPageRegister";
import ForgotPasswordPage from "../pages/Auth/LupaPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

// Pembeli Pages
import HomePagePembeli from "../pages/HomePagePembeli";
import ProfilePagePembeli from "../pages/ProfilePagePembeli";
import PembelianPage from "../pages/PembelianPage";
import AlamatPage from "../pages/AlamatPage";
import KategoriBarangPage from "../pages/KategoriBarangPage";
import DetailBarangPage from "../pages/DetailBarangPage";
import DiskusiPage from "../pages/DiskusiPage";
import KeranjangPagePembeli from "../pages/KeranjangPagePembeli";
import KlaimMerchandisePage from "../pages/KlaimMerchandisePage";

// Pegawai Pages
import PenitipPageCS from "../pages/PagePenitipCS";
import RequestDonasiPage from "../pages/RequestDonasiPage";
import BarangPegawaiPage from "../pages/BarangPegawaiPage";
import DiskusiPegawaiPage from "../pages/DiskusiPegawaiPage";

// Penitip Pages
import ProfilePagePenitip from "../pages/ProfilePagePenitip";
import HomePagePenitip from "../pages/HomePagePenitip";
import PengajuanPenarikanSaldoPage from "../pages/PengajuanPenarikanSaldoPage";

// Admin Pages
import AdminPages from "../pages/AdminPage";
import AdminLayout from "../layouts/AdminLayout";
import DaftarPegawaiPage from '../pages/DaftarPegawaiPage';
import TambahPegawaiPage from '../pages/TambahPegawaiPage';
import DaftarOrganisasiPage from '../pages/DaftarOrganisasiPage';
import DaftarOrganisasiBelum from '../pages/organisasiBelum';
import TambahMerchandisePage from "../pages/TambahMerchandisePage";
import DaftarMerchandisePage from "../pages/DaftarMerchandise";
import DaftarKomisiHunterPage from "../pages/DaftarKomisiHunter";

//Penitipan
import KategoriBarangPenitipanPage from "../pages/KategoriBarangPenitipanPage";
import DetailBarangPenitipanPage from "../pages/DetailBarangPenitipanPage";

// Owner Pages
import OwnerPages from "../pages/OwnerPage";
import OwnerRequestDonasiPage from "../pages/OwnerRequestDonasiPage";
import HistoryDonasiPage from "../pages/HistoryDonasiPage";
import LaporanKategoriPage from "../pages/Laporan/LaporanPenjualanPerkategoriPage";
import LaporanBarangHabis from "../pages/Laporan/LaporanMasaPenitipanHabis";
import LaporanPenjualanBulananPage from "../pages/Laporan/LaporanPenjualanBulananPage";
import LaporanKomisiPage from "../pages/Laporan/LaporanKomisiPage";
import LaporanStokGudangPage from "../pages/Laporan/LaporanStokGudangPage";
import LaporanPenjualanBulananPDFPage from "../pages/Laporan/LaporanPenjualanBulananPDFPage";

//Pegawai Gudang Pages
import DaftarPenitipanPage from "../pages/DaftarPenitipanPage";
import DetailPenitipanPage from "../pages/DetailPenitipanPage";
import TambahPenitipanPage from "../pages/TambahPenitipanPage";
import ManajemenBarangPage from "../pages/ManajemenBarangPage";
import HistoryPenitipanPage from "../pages/HistoryPenitipanPage";
import PenitipanBarangPage from "../pages/PenitipanBarangPage";
import DaftarTransaksiGudangPage from "../pages/DaftarTransaksiGudangPage";
import PengirimanPengambilanPage from "../pages/PengirimanPengambilanPage";
import KonfirmasiBarangDiterimaPage from "../pages/KonfirmasiBarangDiterima";
import NotaPenjualanKurirPage from "../pages/NotaPenjualanKurirPage";
import NotaPenjualanPembeliPage from "../pages/NotaPenjualanPembeliPage";
import KonfirmasiPengambilanPage from "../pages/KonfirmasiPengambilanPage";
import DisiapkanTransaksiPage from "../pages/PembatalanTransaksiValid";


import VerifikasiTransaksiPage from "../pages/VerifikasiTransaksiPage";
import LaporanDonasiDownloadButton from "../pages/Laporan/LaporanDonasiDownloadButton";
import LaporanRequestDonasiPage from "../pages/Laporan/LaporanReqDonasiPage";
import LaporanTransaksiPenitipPage from "../pages/Laporan/LaporanTransaksiPenitipPage";
import FilterKurirPage from "../pages/Laporan/filterKurir";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/register-organisasi",
    element: <RegisterOrganisasiPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/reset-email-sent",
    element: <ResetEmailSentPage />,
  },
  {
    path: "/user/profile/pembeli",
    element: <Navigate to="/user/pembeli/profile" replace />,
  },

  {
    path: "/user/profile/pembeli/alamat",
    element: <Navigate to="/user/pembeli/alamat" replace />,
  },
  
  
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <PublicLayout />,
    children: [
      {
        path: "",
        element: <HomeNonLoginPage />,
      },
      {
        path: "barang/:id",
        element: <DetailBarangPage />,
      },
      {
        path: "kategori/:kategori",
        element: <KategoriBarangPage />,
      },
      {
        path: "search",
        element: <SearchBarangPage />,
      },
    ],
  },



  {
    path: "/kategori/:kategori",
    element: <KategoriBarangNonLoginPage />,
  },

  {
    path: "barang/:id",
    element: <DetailBarangPage />,
  },

  {
    path: "/user/pembeli",
    element: (
      <ProtectedRoutes role="pembeli">
        <PembeliLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "", element: <HomePagePembeli /> },
      { path: "profile", element: <ProfilePagePembeli /> },
      { path: "pembelian", element: <PembelianPage /> },
      { path: "alamat", element: <AlamatPage /> },
      { path: "kategori/:kategori", element: <KategoriBarangPage /> },
      { path: "barang/:id", element: <DetailBarangPage /> },
      { path: "diskusi/:id_barang", element: <DiskusiPage /> },
      { path: "keranjang", element: <KeranjangPagePembeli /> },
      { path: "klaim-merchandise", element: <KlaimMerchandisePage /> },

      {
        path: "search",
        element: <SearchBarangPage />,
      },
      { path: "transaksi-disiapkan", element: <DisiapkanTransaksiPage /> },

    ],
  },

  // Penitip Routes
  {
    path: "/user/penitip",
    element: (
      <ProtectedRoutes role="penitip">
        <PenitipLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "", element: <HomePagePenitip /> },
      { path: "profile", element: <ProfilePagePenitip /> },
      { path: "kategori/:kategori", element: <KategoriBarangPenitipanPage /> },
      { path: "penitipan/show/:id", element: <DetailBarangPenitipanPage /> },
      { path: "penarikan-saldo", element: <PengajuanPenarikanSaldoPage /> },
    ],
  },

  // Pegawai CS Routes
  {
    path: "/user/pegawai",
    element: (
      <ProtectedRoutes role="pegawai">
        <PegawaiCSLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "barang", element: <BarangPegawaiPage /> },
      { path: "diskusi/:id_barang", element: <DiskusiPegawaiPage /> },
      { path: "penitip", element: <PenitipPageCS /> },
      { path: "/user/pegawai/verifikasi-transaksi", element: <VerifikasiTransaksiPage /> }

    ],
  },

  // Organisasi Routes
  {
    path: "/user/organisasi",
    element: (
      <ProtectedRoutes role="organisasi">
        <RequestDonasiLayout />
      </ProtectedRoutes>
    ),
    children: [{ path: "", element: <RequestDonasiPage /> }],
  },

  // Admin Routes
  {
    path: "/user/admin",
    element: (
      <ProtectedRoutes role="admin">
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "", element: <AdminPages /> },
      { path: "daftar-pegawai", element: <DaftarPegawaiPage /> },
      { path: "tambah-pegawai", element: <TambahPegawaiPage /> },
      { path: "daftar-organisasi", element: <DaftarOrganisasiPage /> },
      { path: "daftar-belum", element: <DaftarOrganisasiBelum /> },
      { path: "merchandise-tambah", element: <TambahMerchandisePage /> },
      { path: "merchandise-daftar", element: <DaftarMerchandisePage /> },
      { path: "komisi-daftar", element: <DaftarKomisiHunterPage /> },
    ],
  },

  //Owner Routes
  {
    path: "/user/owner",
    element: (
      <ProtectedRoutes role="owner">
        <OwnerLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "", element: <h2 className="p-3">Selamat Datang di Dashboard</h2> },
      { path: "request-donasi", element: <OwnerRequestDonasiPage /> },
      { path: "history-donasi", element: <HistoryDonasiPage /> },
      { path: "laporan/laporan-penjualan-kategori", element: <LaporanKategoriPage /> },
      { path: "laporan/laporan-masa-penitipan-habis", element: <LaporanBarangHabis /> },
      { path: "laporan/laporan-penjualan-bulanan", element: <LaporanPenjualanBulananPDFPage /> },
      { path: "laporan/laporan-komisi", element: <LaporanKomisiPage /> },
      { path: "laporan/laporan-stok-gudang", element: <LaporanStokGudangPage /> },
      { path: "laporan/laporan-donasi-barang", element: <LaporanDonasiDownloadButton/>},
      { path: "laporan/laporan-request-donasi", element: <LaporanRequestDonasiPage/>},
      { path: "laporan/laporan-transaksi-penitip", element: <LaporanTransaksiPenitipPage/>},
      { path: "filter-kurir", element: <FilterKurirPage/>},
    ],
  },

  //Pegawai Gudang Routes
  {
    path: "/user/gudang",
    element: (
      <ProtectedRoutes role="gudang">
        <PegawaiGudangLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "", element: <h2 className="p-3">Selamat Datang di Dashboard</h2> },
      { path: "penitipan-daftar", element: <DaftarPenitipanPage /> },
      { path: "penitipan-detail/:id", element: <DetailPenitipanPage /> },
      { path: "penitipan-tambah", element: <TambahPenitipanPage /> },
      { path: "manajemen-barang", element: <ManajemenBarangPage /> },
      { path: "tambah-barang", element: <PenitipanBarangPage /> },
      { path: "history-penitipan", element: <HistoryPenitipanPage /> },
      { path: "edit-barang/:id_barang", element: <PenitipanBarangPage /> },
      { path: "pengiriman", element: <HistoryPenitipanPage /> },
      { path: "daftar-transaksi-dikirim-diambil", element: <DaftarTransaksiGudangPage /> },
      { path: "pengiriman-pengambilan", element: <PengirimanPengambilanPage /> },
      { path: "nota-penjualan-kurir", element: <NotaPenjualanKurirPage /> },
      { path: "nota-penjualan-pembeli", element: <NotaPenjualanPembeliPage /> },
      { path: "konfirmasi-barang-diterima", element: <KonfirmasiBarangDiterimaPage /> },
      { path: "pengambilan-barang-pemilik", element: <KonfirmasiPengambilanPage /> },
    ],
  },

  // 404 Fallback
  {
    path: "*",
    element: (
      <div className="container mt-5 text-center">
        <h1>Page Not Found!</h1>
      </div>
    ),
  },
]);

const AppRouter = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
