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

// Auth Pages
import LoginPage from "../pages/Auth/loginpage";
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

//Penitipan
import KategoriBarangPenitipanPage from "../pages/KategoriBarangPenitipanPage";
import DetailBarangPenitipanPage from "../pages/DetailBarangPenitipanPage";



const router = createBrowserRouter([
  {
    path: "/",
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
    path: "/home",
    element: <HomeNonLoginPage />,
  },

  {
    path: "/kategori/:kategori",
    element: <KategoriBarangNonLoginPage />,
  },

  {
    path:"non/:id",
    element: <DetailBarangNonLogin />,
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
    children: [
      { path: "", element: <RequestDonasiPage /> },
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