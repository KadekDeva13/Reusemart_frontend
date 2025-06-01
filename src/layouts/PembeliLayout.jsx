import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import TopNavbar from "../component/TopNavbar";

const PembeliLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      {/* Top Navbar */}
      <TopNavbar onLogout={handleLogout} />

      {/* Main content */}
      <Container fluid className="pt-4" style={{ paddingTop: "56px" }}>
        <Outlet />
      </Container>
    </>
  );
};

export default PembeliLayout;
