import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Alert,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  getKeycloakUsersApi,
  createKeycloakUserApi,
  deleteKeycloakUserApi,
  getKeycloakGroupsApi,
  assignGroupApi,
  removeGroupApi,
} from "../api/keycloakUsersApi";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    group_id: "",
  });

const loadData = async (showError = true) => {
  try {
    setLoading(true);

    const [usersData, groupsData] = await Promise.all([
      getKeycloakUsersApi(),
      getKeycloakGroupsApi(),
    ]);

    console.log("USERS DATA:", usersData);
    console.log("GROUPS DATA:", groupsData);

    setUsers(Array.isArray(usersData) ? usersData : []);
    setGroups(Array.isArray(groupsData) ? groupsData : []);

    if (showError) {
      setError("");
    }
  } catch (err) {
    console.error("LOAD DATA ERROR:", err?.response?.data || err?.message || err);

    if (showError) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Αδυναμία φόρτωσης χρηστών ή groups από το Keycloak."
      );
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async () => {
    try {
      setError("");
      setSuccess("");

      if (!formData.username || !formData.password) {
        setError("Το username και το password είναι υποχρεωτικά.");
        return;
      }

      const result = await createKeycloakUserApi(formData);

      setSuccess(result.message || "Ο χρήστης δημιουργήθηκε επιτυχώς.");
      setShowModal(false);

      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        group_id: "",
      });

       loadData();
    } catch (err) {
      console.error(err);
      setError("Αδυναμία δημιουργίας χρήστη.");
    }
  };

 const handleDeleteUser = async (userId) => {
  try {
    setError("");
    setSuccess("");

    const result = await deleteKeycloakUserApi(userId);
    setSuccess(result.message || "Ο χρήστης διαγράφηκε.");

    await loadData(false);
  } catch (err) {
    console.error("DELETE USER ERROR:", err?.response?.data || err?.message || err);
    setError(
      err?.response?.data?.message ||
      err?.message ||
      "Αδυναμία διαγραφής χρήστη."
    );
  }
};

  const handleAssignGroup = async (userId, groupId) => {
    try {
      setError("");
      setSuccess("");

      const result = await assignGroupApi(userId, groupId);
      setSuccess(result.message || "Ο χρήστης προστέθηκε στο group.");
      loadData();
    } catch (err) {
      console.error(err);
      setError("Αδυναμία ανάθεσης group.");
    }
  };

  const handleRemoveGroup = async (userId, groupId) => {
    try {
      setError("");
      setSuccess("");

      const result = await removeGroupApi(userId, groupId);
      setSuccess(result.message || "Ο χρήστης αφαιρέθηκε από το group.");
      loadData();
    } catch (err) {
      console.error(err);
      setError("Αδυναμία αφαίρεσης group.");
    }
  };

  const getRoleLabel = (user) => {
    const groupNames = (user.groups || []).map((g) => g.name.toLowerCase());

    if (groupNames.includes("admin")) return "admin";
    if (groupNames.includes("operator")) return "operator";
    if (groupNames.includes("viewer")) return "viewer";

    return "—";
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Φόρτωση χρηστών...</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="mb-1">👥 Χρήστες </h2>
              <p className="text-muted mb-0">
                Διαχείριση χρηστών και ομάδων της εφαρμογής
              </p>
            </div>

            <Button variant="primary" onClick={() => setShowModal(true)}>
              Προσθήκη Χρήστη
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Όνομα Χρήστη</th>
                <th>Ρόλος</th>
                <th>Email</th>
                <th>Groups</th>
                <th>Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{getRoleLabel(user)}</td>
                    <td>{user.email || "—"}</td>
                    <td>
                      {user.groups?.length > 0 ? (
                        user.groups.map((group) => (
                          <div
                            key={group.id}
                            className="d-flex align-items-center justify-content-between mb-1"
                          >
                            <span>{group.name}</span>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveGroup(user.id, group.id)}
                            >
                              Αφαίρεση
                            </Button>
                          </div>
                        ))
                      ) : (
                        <span>—</span>
                      )}

                      <Form.Select
                        className="mt-2"
                        size="sm"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignGroup(user.id, e.target.value);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="">Προσθήκη σε group...</option>
                        {groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Διαγραφή
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Δεν βρέθηκαν χρήστες.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Δημιουργία Νέου Χρήστη</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12} className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </Col>

            <Col md={12} className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Col>

            <Col md={6} className="mb-2">
              <Form.Label>Όνομα</Form.Label>
              <Form.Control
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </Col>

            <Col md={6} className="mb-2">
              <Form.Label>Επώνυμο</Form.Label>
              <Form.Control
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </Col>

            <Col md={12} className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Col>

            <Col md={12} className="mb-2">
              <Form.Label>Αρχικό Group</Form.Label>
              <Form.Select
                value={formData.group_id}
                onChange={(e) =>
                  setFormData({ ...formData, group_id: e.target.value })
                }
              >
                <option value="">Επιλογή ομάδας</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Άκυρο
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Δημιουργία
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UsersPage;