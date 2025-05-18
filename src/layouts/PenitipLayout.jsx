import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import TopNavbarPenitip from "../component/TopNavbarPenitip";

const PenitipLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <>
      {/* Top Navbar */}
      <TopNavbarPenitip onLogout={handleLogout} />

      {/* Main content */}
      <Container fluid className="pt-4" style={{ paddingTop: "56px" }}>
        <Outlet />
      </Container>
    </>
  );
};

export default PenitipLayout;
