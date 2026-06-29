import React from "react";
import { Container, Card, ListGroup, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

function AlertsPage() {
  const notifications = useSelector((state) => state.realtime.notifications);

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h2 className="mb-3">🔔 Ειδοποιήσεις</h2>

          {notifications.length === 0 ? (
            <Alert variant="success">Δεν υπάρχουν νέες ειδοποιήσεις.</Alert>
          ) : (
            <ListGroup>
              {notifications.map((item) => (
                <ListGroup.Item key={item.id}>
                  <strong>{item.title}</strong>
                  <br />
                  <small>{new Date(item.createdAt).toLocaleString("el-GR")}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AlertsPage;