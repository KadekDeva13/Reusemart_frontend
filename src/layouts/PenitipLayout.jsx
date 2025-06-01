import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import TopNavbarPenitip from "../component/TopNavbarPenitip";
import { useState } from "react";

const PenitipLayout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      {/* Top Navbar */}
      <TopNavbarPenitip
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main content */}
      <Container fluid className="pt-4" style={{ paddingTop: "56px" }}>
        <Outlet context={{ searchQuery }} />
      </Container>
    </>
  );
};

export default PenitipLayout;
