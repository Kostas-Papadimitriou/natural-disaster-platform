// src/pages/MapPage.js
import React, { useEffect, useMemo, useState } from "react";
import { Container, Card, Alert, Spinner, Row, Col, Form } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { getIncidentsApi } from "../api/incidentsApi";

function FitBoundsToMarkers({ incidents }) {
  const map = useMap();

  useEffect(() => {
    if (!incidents.length) return;

    const bounds = L.latLngBounds(
      incidents.map((item) => [Number(item.latitude), Number(item.longitude)])
    );

    map.fitBounds(bounds, { padding: [40, 40] });
  }, [incidents, map]);

  return null;
}

function createIncidentIcon(type) {
  const normalized = (type || "").toLowerCase();

  let color = "#6c757d";
  let label = "•";

  if (normalized.includes("πυρκαγ")) {
    color = "#dc3545";
    label = "🔥";
  } else if (normalized.includes("πλημμ")) {
    color = "#0d6efd";
    label = "💧";
  } else if (normalized.includes("τροχα")) {
    color = "#fd7e14";
    label = "🚗";
  } else if (normalized.includes("διάσω") || normalized.includes("διασω")) {
    color = "#198754";
    label = "🛟";
  } else {
    color = "#6f42c1";
    label = "⚠️";
  }

  return L.divIcon({
    className: "custom-incident-marker-wrapper",
    html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: ${color};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      ">
        ${label}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function MapPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("30");

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError("");

      const incidents = await getIncidentsApi();
      setData(Array.isArray(incidents) ? incidents : []);
    } catch (err) {
      console.error("Σφάλμα φόρτωσης incidents:", err);
      setError("Αδυναμία φόρτωσης δεδομένων χάρτη.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const incidentTypes = useMemo(() => {
    const unique = new Set(
      data
        .map((item) => item.incident_type)
        .filter(Boolean)
    );
    return Array.from(unique);
  }, [data]);

  const filteredIncidents = useMemo(() => {
    const now = new Date();

    return data.filter((item) => {
      if (item.latitude == null || item.longitude == null) return false;

      const lat = Number(item.latitude);
      const lng = Number(item.longitude);

      if (Number.isNaN(lat) || Number.isNaN(lng)) return false;

      if (typeFilter !== "all" && item.incident_type !== typeFilter) {
        return false;
      }

      if (dateFilter !== "all") {
        if (!item.submitted_at) return false;

        const submittedDate = new Date(item.submitted_at);
        if (Number.isNaN(submittedDate.getTime())) return false;

        const days = Number(dateFilter);
        const fromDate = new Date();
        fromDate.setDate(now.getDate() - days);

        if (submittedDate < fromDate || submittedDate > now) {
          return false;
        }
      }

      return true;
    });
  }, [data, typeFilter, dateFilter]);

  const defaultCenter = [38.0, 23.7];

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Φόρτωση χάρτη...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h2 className="mb-3">🗺️ Χάρτης Συμβάντων</h2>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Φίλτρο κατηγορίας</Form.Label>
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Όλα τα είδη</option>
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Ημερομηνιακό φίλτρο</Form.Label>
              <Form.Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="7">Τελευταίες 7 ημέρες</option>
                <option value="30">Τελευταίες 30 ημέρες</option>
                <option value="90">Τελευταίες 90 ημέρες</option>
                <option value="all">Όλα τα διαθέσιμα</option>
              </Form.Select>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          {!error && (
            <Alert variant="info">
              Εμφανίζονται <strong>{filteredIncidents.length}</strong> συμβάντα
              με έγκυρες συντεταγμένες.
            </Alert>
          )}

          <div
            style={{
              height: "600px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <MapContainer
              center={defaultCenter}
              zoom={7}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredIncidents.length > 0 && (
                <FitBoundsToMarkers incidents={filteredIncidents} />
              )}

              <MarkerClusterGroup chunkedLoading>
                {filteredIncidents.map((item) => (
                  <Marker
                    key={item.id}
                    position={[Number(item.latitude), Number(item.longitude)]}
                    icon={createIncidentIcon(item.incident_type)}
                  >
                    <Popup>
                      <div style={{ minWidth: "240px" }}>
                        <strong>{item.title || "Χωρίς τίτλο"}</strong>
                        <br />
                        <small>
                          <strong>Είδος:</strong> {item.incident_type || "—"}
                        </small>
                        <br />
                        <small>
                          <strong>Περιοχή:</strong> {item.area || "—"}
                        </small>
                        <br />
                        <small>
                          <strong>Ημερομηνία:</strong>{" "}
                          {item.submitted_at
                            ? new Date(item.submitted_at).toLocaleString("el-GR")
                            : "—"}
                        </small>
                        <hr />
                        <div>{item.description || "Δεν υπάρχει περιγραφή."}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>

          <div className="mt-3 d-flex flex-wrap gap-3">
            <span><strong>Υπόμνημα:</strong></span>
            <span>🔥 Πυρκαγιά</span>
            <span>💧 Πλημμύρα</span>
            <span>🚗 Τροχαίο</span>
            <span>🛟 Διάσωση</span>
            <span>⚠️ Άλλο</span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MapPage;