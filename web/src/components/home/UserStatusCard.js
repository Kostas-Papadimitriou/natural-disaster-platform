import React from "react";
import { Card, Button } from "react-bootstrap";
import keycloak from "../../keycloak";

function UserStatusCard({ user }) {
  const username =
    user?.preferred_username ||
    user?.name ||
    user?.given_name ||
    "Άγνωστος χρήστης";

  const roles = user?.realm_access?.roles || [];
  const mainRole = roles.length > 0 ? roles[0] : "user";

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white fw-bold">👤 Κατάσταση Χρήστη</Card.Header>
      <Card.Body>
        <p className="mb-2">
          <strong>Όνομα:</strong> {username}
        </p>
        <p className="mb-2">
          <strong>Ρόλος:</strong> {mainRole}
        </p>
        <p className="mb-3">
          <strong>Τελευταία σύνδεση:</strong>{" "}
          {new Date().toLocaleString("el-GR")}
        </p>

        <Button variant="outline-danger" onClick={handleLogout}>
          Αποσύνδεση
        </Button>
      </Card.Body>
    </Card>
  );
}

export default UserStatusCard;