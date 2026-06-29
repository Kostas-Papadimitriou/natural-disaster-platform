import React from "react";
import { Card, Button, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAdminUser } from "../../utils/authHelpers";

function QuickActionsCard() {
  const authUser = useSelector((state) => state.auth?.user);
  const isAdmin = isAdminUser(authUser);

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white fw-bold">⚡ Γρήγορες Ενέργειες</Card.Header>
      <Card.Body>
        <Stack gap={2}>
          <Button as={Link} to="/dashboard" variant="primary">
            Προβολή Dashboard
          </Button>

          <Button as={Link} to="/new-incident" variant="success">
            Νέα Αναφορά
          </Button>

          <Button as={Link} to="/alerts" variant="warning">
            Αποστολή Ειδοποίησης
          </Button>

          {isAdmin && (
            <Button as={Link} to="/users" variant="dark">
              Διαχείριση Χρηστών
            </Button>
          )}

          <Button as={Link} to="/map" variant="info">
            Χάρτης Συμβάντων
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
}

export default QuickActionsCard;