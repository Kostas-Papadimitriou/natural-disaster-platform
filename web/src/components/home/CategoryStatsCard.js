import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

function CategoryStatsCard({ stats }) {
  const categories = [
    { key: "Πυρκαγιά", label: "Πυρκαγιά", color: "danger" },
    { key: "Πλημμύρα", label: "Πλημμύρα", color: "primary" },
    { key: "Τροχαίο", label: "Τροχαίο", color: "warning" },
    { key: "Διάσωση", label: "Διάσωση", color: "success" },
    { key: "Άλλο", label: "Άλλο", color: "secondary" },
  ];

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white fw-bold">
        📈 Στατιστικά ανά Κατηγορία
      </Card.Header>
      <ListGroup variant="flush">
        {categories.map((item) => (
          <ListGroup.Item
            key={item.key}
            className="d-flex justify-content-between align-items-center"
          >
            <span>{item.label}</span>
            <Badge bg={item.color}>{stats[item.key] || 0}</Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default CategoryStatsCard;