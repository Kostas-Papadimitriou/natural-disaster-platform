import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Button } from "react-bootstrap";
import { getIncidentsApi, sendIncidentEmailApi } from "../api/incidentsApi";
import { useSelector, useDispatch } from "react-redux";
import { clearUnread } from "../store/realtimeSlice";

function DashboardTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
const refreshKey = useSelector((state) => state.realtime.refreshKey);
const lastIncident = useSelector((state) => state.realtime.lastIncident);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError("");

      const incidents = await getIncidentsApi();
      setData(incidents);
    } catch (err) {
      console.error("Σφάλμα φόρτωσης incidents:", err);
      setError("Αδυναμία φόρτωσης δεδομένων από το backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);
  useEffect(() => {
  if (refreshKey > 0) {
    fetchIncidents();
  }
}, [refreshKey]);
useEffect(() => {
  dispatch(clearUnread());
}, [dispatch]);
  const handleSendEmail = async (incidentId) => {
    try {
      setSendingId(incidentId);
      setSuccessMessage("");
      setError("");

      const response = await sendIncidentEmailApi(incidentId);

      setSuccessMessage(
        response?.message || "Το περιστατικό στάλθηκε επιτυχώς στο email."
      );
    } catch (err) {
      console.error("Σφάλμα αποστολής email:", err);
      setError("Αδυναμία αποστολής email για το συγκεκριμένο περιστατικό.");
    } finally {
      setSendingId(null);
    }
  };

  const renderMedia = (row) => {
    return (
      <>
        {row.photo_url && (
          <a href={row.photo_url} target="_blank" rel="noreferrer" className="me-2">
            📸 Φωτογραφία
          </a>
        )}
        {row.video_url && (
          <a href={row.video_url} target="_blank" rel="noreferrer" className="me-2">
            🎥 Βίντεο
          </a>
        )}
        {row.audio_url && (
          <a href={row.audio_url} target="_blank" rel="noreferrer">
            🎤 Ήχος
          </a>
        )}
        {!row.photo_url && !row.video_url && !row.audio_url && "—"}
      </>
    );
  };

  const renderCoordinates = (row) => {
    if (row.latitude && row.longitude) {
      return `${row.latitude}, ${row.longitude}`;
    }
    return "—";
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Φόρτωση συμβάντων...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {lastIncident && (
  <Alert variant="warning">
    Νέο περιστατικό: <strong>{lastIncident.title || "Χωρίς τίτλο"}</strong>
  </Alert>
)}
      <h2 className="mb-4">📊 Πίνακας Καταστροφών</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Είδος</th>
            <th>Περιοχή</th>
            <th>Συντεταγμένες</th>
            <th>Πολυμέσα</th>
            <th>Πληροφορίες</th>
            <th>Αποστολή</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.incident_type || "—"}</td>
                <td>{row.area || "—"}</td>
                <td>{renderCoordinates(row)}</td>
                <td>{renderMedia(row)}</td>
                <td>
                  <strong>{row.title || "Χωρίς τίτλο"}</strong>
                  <br />
                  <small>{row.description || "—"}</small>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSendEmail(row.id)}
                    disabled={sendingId === row.id}
                  >
                    {sendingId === row.id ? "Αποστολή..." : "Στείλε Email"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Δεν υπάρχουν καταχωρημένα συμβάντα.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default DashboardTable;