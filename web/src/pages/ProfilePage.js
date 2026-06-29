// src/pages/ProfilePage.js
import React from "react";
import { Container, Card, Button, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import keycloak from "../keycloak";

function ProfilePage() {
  const authUser = useSelector((state) => state.auth?.user);

  const username =
    authUser?.preferred_username ||
    authUser?.name ||
    authUser?.given_name ||
    "Άγνωστος χρήστης";

  const email = authUser?.email || "Δεν υπάρχει email";
  const roles = authUser?.realm_access?.roles || [];

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h2 className="mb-3">👤 Προφίλ Χρήστη</h2>

          <p>
            <strong>Όνομα:</strong> {username}
          </p>

          <p>
            <strong>Email:</strong> {email}
          </p>

          <div className="mb-3">
            <strong>Ρόλοι:</strong>{" "}
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <Badge bg="secondary" className="me-2" key={index}>
                  {role}
                </Badge>
              ))
            ) : (
              <span>Δεν υπάρχουν διαθέσιμοι ρόλοι</span>
            )}
          </div>

          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfilePage;