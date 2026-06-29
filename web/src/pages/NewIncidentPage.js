// src/pages/NewIncidentPage.js
import React from "react";
import { Container, Card, Button } from "react-bootstrap";

function NewIncidentPage() {
  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h2 className="mb-3">📝 Νέα Αναφορά</h2>
          <p className="text-muted">
            Εδώ μπορείς να προσθέσεις φόρμα για χειροκίνητη καταχώριση νέου περιστατικού
            από το web περιβάλλον.
          </p>

          <Button variant="primary">Προσθήκη Φόρμας Αργότερα</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default NewIncidentPage;