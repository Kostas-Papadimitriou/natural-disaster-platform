import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getIncidentsApi } from "../api/incidentsApi";

import SummaryCard from "../components/home/SummaryCard";
import RecentIncidentsCard from "../components/home/RecentIncidentsCard";
import QuickActionsCard from "../components/home/QuickActionsCard";
import CategoryStatsCard from "../components/home/CategoryStatsCard";
import UserStatusCard from "../components/home/UserStatusCard";
import AlertsPanel from "../components/home/AlertsPanel";

function HomePage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authUser = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getIncidentsApi();
        setIncidents(data);
      } catch (err) {
        console.error("Σφάλμα φόρτωσης αρχικής:", err);
        setError("Αδυναμία φόρτωσης των δεδομένων της αρχικής σελίδας.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const todayString = new Date().toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const total = incidents.length;

    const todayCount = incidents.filter((item) => {
      if (!item.submitted_at) return false;
      return item.submitted_at.slice(0, 10) === todayString;
    }).length;

    const firesCount = incidents.filter(
      (item) => item.incident_type === "Πυρκαγιά"
    ).length;

    const withMediaCount = incidents.filter(
      (item) => item.photo_url || item.video_url || item.audio_url
    ).length;

    // Αν δεν υπάρχει ακόμα email_sent από backend, το κρατάμε fallback false
    const emailedCount = incidents.filter((item) => item.email_sent === true).length;

    const latestIncident =
      incidents.length > 0
        ? incidents[0].title || `#${incidents[0].id}`
        : "Δεν υπάρχει";

    const categoryStats = {
      Πυρκαγιά: incidents.filter((i) => i.incident_type === "Πυρκαγιά").length,
      Πλημμύρα: incidents.filter((i) => i.incident_type === "Πλημμύρα").length,
      Τροχαίο: incidents.filter((i) => i.incident_type === "Τροχαίο").length,
      Διάσωση: incidents.filter((i) => i.incident_type === "Διάσωση").length,
      Άλλο: incidents.filter(
        (i) =>
          !["Πυρκαγιά", "Πλημμύρα", "Τροχαίο", "Διάσωση"].includes(i.incident_type)
      ).length,
    };

    const withoutMediaCount = incidents.filter(
      (item) => !item.photo_url && !item.video_url && !item.audio_url
    ).length;

    const withoutLocationCount = incidents.filter(
      (item) => !item.latitude || !item.longitude
    ).length;

    const notSentCount = incidents.filter((item) => item.email_sent !== true).length;

    return {
      total,
      todayCount,
      firesCount,
      withMediaCount,
      emailedCount,
      latestIncident,
      categoryStats,
      withoutMediaCount,
      withoutLocationCount,
      notSentCount,
    };
  }, [incidents, todayString]);

  const latestFive = incidents.slice(0, 5);

  const alerts = [
    stats.notSentCount > 0 && {
      variant: "warning",
      text: `Υπάρχουν ${stats.notSentCount} νέα συμβάντα που δεν έχουν σταλεί ακόμα.`,
    },
    stats.withoutMediaCount > 0 && {
      variant: "secondary",
      text: `Υπάρχουν ${stats.withoutMediaCount} incidents χωρίς media.`,
    },
    stats.withoutLocationCount > 0 && {
      variant: "danger",
      text: `Υπάρχουν ${stats.withoutLocationCount} incidents χωρίς γεωγραφική θέση.`,
    },
  ].filter(Boolean);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Φόρτωση αρχικής σελίδας...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <h2 className="fw-bold">🏠 Αρχική Σελίδα</h2>
        <p className="text-muted mb-0">
          Κέντρο ελέγχου περιστατικών και φυσικών καταστροφών
        </p>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4} xl={2}>
          <SummaryCard
            title="Συνολικά incidents"
            value={stats.total}
            subtitle="Όλες οι καταχωρίσεις"
            icon="📌"
          />
        </Col>
        <Col md={4} xl={2}>
          <SummaryCard
            title="Σήμερα"
            value={stats.todayCount}
            subtitle="Σημερινά συμβάντα"
            icon="📅"
          />
        </Col>
        <Col md={4} xl={2}>
          <SummaryCard
            title="Πυρκαγιές"
            value={stats.firesCount}
            subtitle="Συμβάντα πυρκαγιάς"
            icon="🔥"
          />
        </Col>
        <Col md={4} xl={2}>
          <SummaryCard
            title="Με media"
            value={stats.withMediaCount}
            subtitle="Φωτογραφία / βίντεο / ήχος"
            icon="🎥"
          />
        </Col>
        <Col md={4} xl={2}>
          <SummaryCard
            title="Στάλθηκαν email"
            value={stats.emailedCount}
            subtitle="Αποστολές email"
            icon="📧"
          />
        </Col>
        <Col md={4} xl={2}>
          <SummaryCard
            title="Τελευταία αναφορά"
            value={stats.latestIncident}
            subtitle="Πιο πρόσφατο incident"
            icon="🕘"
          />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <RecentIncidentsCard incidents={latestFive} />
        </Col>
        <Col lg={3}>
          <QuickActionsCard />
        </Col>
        <Col lg={3}>
          <UserStatusCard user={authUser} />
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={4}>
          <CategoryStatsCard stats={stats.categoryStats} />
        </Col>
        <Col lg={8}>
          <AlertsPanel alerts={alerts} />
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;