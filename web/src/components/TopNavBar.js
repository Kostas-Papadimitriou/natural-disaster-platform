// src/components/TopNavBar.js
import React from "react";
import { Navbar, Nav, NavDropdown, Container, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import keycloak from "../keycloak";
import { isAdminUser } from "../utils/authHelpers";


function TopNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useSelector((state) => state.auth?.user);
  const unreadCount = useSelector((state) => state.realtime.unreadCount);
  const isAdmin = isAdminUser(authUser);

  const username =
    authUser?.preferred_username ||
    authUser?.name ||
    authUser?.given_name ||
    "Χρήστης";

  const roles = authUser?.realm_access?.roles || [];
  const mainRole = roles.length > 0 ? roles[0] : "user";

  const handleLogout = () => {
    keycloak.logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="primary" expand="lg" variant="dark" sticky="top" className="shadow-sm">
      <Container fluid="lg">
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", fontWeight: "600" }}
        >
          🌍 Natural Disasters
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link active={isActive("/")} onClick={() => navigate("/")}>
              Αρχική
            </Nav.Link>

            <Nav.Link
              active={isActive("/dashboard")}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              active={isActive("/new-incident")}
              onClick={() => navigate("/new-incident")}
            >
              Νέα Αναφορά
            </Nav.Link>

            <Nav.Link
              active={isActive("/map")}
              onClick={() => navigate("/map")}
            >
              Χάρτης
            </Nav.Link>

            <Nav.Link
              active={isActive("/alerts")}
              onClick={() => navigate("/alerts")}
            >
              Ειδοποιήσεις
            </Nav.Link>

          {isAdmin && (
  <Nav.Link
    active={isActive("/users")}
    onClick={() => navigate("/users")}
  >
    Χρήστες
  </Nav.Link>
)}
          </Nav>
<Nav.Link
  active={isActive("/dashboard")}
  onClick={() => navigate("/dashboard")}
  className="position-relative d-flex align-items-center justify-content-center"
  style={{ width: "48px", height: "40px" }}
  title="Dashboard"
>
  <i
    className="bi bi-exclamation-triangle-fill"
    style={{ fontSize: "1.3rem", color: "white" }}
  ></i>

  {unreadCount > 0 && (
    <Badge
      bg="danger"
      pill
      className="position-absolute top-0 start-100 translate-middle"
      style={{ fontSize: "0.65rem" }}
    >
      {unreadCount}
    </Badge>
  )}
</Nav.Link>
          <Nav className="align-items-center">
            <div className="text-white me-3 d-none d-lg-block">
              <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{username}</div>
              <div style={{ fontSize: "0.75rem" }}>
                <Badge bg="light" text="dark">
                  {mainRole}
                </Badge>
              </div>
            </div>

            <NavDropdown
              title="👤 Προφίλ"
              id="profile-nav-dropdown"
              align="end"
              menuVariant="light"
            >
              <NavDropdown.Item onClick={() => navigate("/profile")}>
                Προβολή Προφίλ
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavBar;