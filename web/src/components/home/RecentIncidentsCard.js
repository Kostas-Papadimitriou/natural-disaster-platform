import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function RecentIncidentsCard({ incidents = [] }) {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white fw-bold">
        🕘 Πρόσφατα Περιστατικά
      </Card.Header>
      <ListGroup variant="flush">
        {incidents.length > 0 ? (
          incidents.map((item) => (
            <ListGroup.Item key={item.id}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-semibold">
                    <Link
                      to={`/incident/${item.id}`}
                      className="text-decoration-none"
                    >
                      {item.title || "Χωρίς τίτλο"}
                    </Link>
                  </div>
                  <div className="text-muted small">
                    {item.description || "—"}
                  </div>
                  <div className="small mt-1">
                    <Badge bg="secondary" className="me-2">
                      {item.incident_type || "Άλλο"}
                    </Badge>
                    <span className="text-muted">{item.area || "Άγνωστη περιοχή"}</span>
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Δεν υπάρχουν πρόσφατα περιστατικά.</ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
}

export default RecentIncidentsCard;