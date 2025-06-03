import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Navbar, Container, Form, Button } from "react-bootstrap";
import SearchBar from "./SearchBar";

const TopNavbarNonLogin = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <Navbar fixed="top" className="navbar-custom shadow-sm border-bottom py-2" style={{ backgroundColor: "#a9bf6b" }}>
      <Container fluid className="d-flex justify-content-between align-items-center">
        {/* Logo on the left */}
        <img
          src="/images/Logo.png"
          alt="Logo"
          style={{ width: "40px", height: "40px", objectFit: "contain", cursor: "pointer" }}
          onClick={handleLogoClick}
        />

        {/* Search bar in the middle */}
        <div className="mx-auto w-100 px-3" style={{ maxWidth: "600px", position: "relative" }}>
          <SearchBar />
        </div>

        {/* Sign In button on the right */}
        <Button
          variant="outline-light"
          onClick={() => navigate("/login")}
          className="rounded-pill"
        >
          Sign In
        </Button>
      </Container>
    </Navbar>
  );
};

export default TopNavbarNonLogin;
