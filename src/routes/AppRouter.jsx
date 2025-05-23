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
import DetailBarangPage from "../pages/DetaillBarangPage";
import DiskusiPage from "../pages/DiskusiPage";

// Pegawai Pages
import PenitipPageCS from "../pages/PagePenitipCS";
import RequestDonasiPage from "../pages/RequestDonasiPage";
import BarangPegawaiPage from "../pages/BarangPegawaiPage";
import DiskusiPegawaiPage from "../pages/DiskusiPegawaiPage";

// Penitip Pages
import ProfilePagePenitip from "../pages/ProfilePagePenitip";
import HomePagePenitip from "../pages/HomePagePenitip";

// Admin Pages
import AdminPages from "../pages/adminPage";
import AdminLayout from "../layouts/AdminLayout";
import DaftarPegawaiPage from '../pages/DaftarPegawaiPage';
import TambahPegawaiPage from '../pages/TambahPegawaiPage';
import DaftarOrganisasiPage from '../pages/DaftarOrganisasiPage';

//Penitipan
import KategoriBarangPenitipanPage from "../pages/KategoriBarangPenitipanPage";
import DetailBarangPenitipanPage from "../pages/DetailBarangPenitipanPage";

// Owner Pages
import OwnerPages from "../pages/OwnerPage";
import OwnerRequestDonasiPage from "../pages/OwnerRequestDonasiPage";
import HistoryDonasiPage from "../pages/HistoryDonasiPage";

//Pegawai Gudang Pages
import ManajemenBarangPage from "../pages/ManajemenBarangPage";
import HistoryPenitipanPage from "../pages/HistoryPenitipanPage";


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

    ],
  },

  // Penitip Routes
  {
    path: "/user/penitip",  // Parent route
    element: (
      <ProtectedRoutes role="penitip">
        <PenitipLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "", element: <HomePagePenitip /> },
      { path: "profile", element: <ProfilePagePenitip /> },
      { path: "kategori/:kategori", element: <KategoriBarangPenitipanPage /> },
      { path: "penitipan/show/:id", element: <DetailBarangPenitipanPage /> },  // <-- Path relatif
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
      { path: "penitip", element: <PenitipPageCS /> }

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
      { path: "", element: <DaftarPegawaiPage /> },
      { path: "daftar-pegawai", element: <DaftarPegawaiPage /> },
      { path: "tambah-pegawai", element: <TambahPegawaiPage /> },
      { path: "daftar-organisasi", element: <DaftarOrganisasiPage /> },
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
      { path: "manajemen-barang", element: <ManajemenBarangPage /> },
      { path: "history-penitipan", element: <HistoryPenitipanPage /> },
      { path: "pengiriman", element: <HistoryPenitipanPage /> },
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
