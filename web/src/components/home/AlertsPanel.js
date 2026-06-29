import React from "react";
import { Alert, Card } from "react-bootstrap";

function AlertsPanel({ alerts = [] }) {
  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white fw-bold">🚨 Προειδοποιήσεις</Card.Header>
      <Card.Body>
        {alerts.length > 0 ? (
          alerts.map((alertItem, index) => (
            <Alert key={index} variant={alertItem.variant || "warning"} className="mb-2">
              {alertItem.text}
            </Alert>
          ))
        ) : (
          <Alert variant="success" className="mb-0">
            Δεν υπάρχουν ενεργές προειδοποιήσεις.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default AlertsPanel;