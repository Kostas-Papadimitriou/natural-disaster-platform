import React from "react";
import { Card } from "react-bootstrap";

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Subtitle className="text-muted mb-2">{title}</Card.Subtitle>
            <h3 className="mb-1">{value}</h3>
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
          <div style={{ fontSize: "1.8rem" }}>{icon}</div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SummaryCard;