import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiService from "../services/apiService";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "../styles/Team611.css";

function Team611() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true);
        const data = await apiService.getTeamData("611");
        setTeam(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to load team data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  if (!team) {
    return (
      <Container className="mt-5">
        <div className="alert alert-warning" role="alert">
          No team data found.
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="team-page">
      <Row className="justify-content-center mt-5">
        <Col md={10} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="team-header-card">
              <Card.Body>
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="text-center text-md-start mb-3 mb-md-0">
                    <h1 className="team-number">Team {team.team_number}</h1>
                    <h2 className="team-name">{team.nickname}</h2>
                    <h3 className="team-location">{team.city}, {team.state_prov}, {team.country}</h3>
                    <p className="team-info">Rookie Year: {team.rookie_year}</p>
                    {team.website && (
                      <Button
                        variant="outline-primary"
                        href={team.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2"
                      >
                        Visit Team Website
                      </Button>
                    )}
                  </div>
                  <div className="team-logo">
                    <img
                      src={team.logo_url || "/images/team611.png"}
                      alt={`Team ${team.team_number} Logo`}
                      className="img-fluid"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mt-4 team-content-card">
              <Card.Body>
                <h3 className="section-title">About {team.nickname}</h3>
                <p>
                  {team.description || 
                    `Team 611, known as the Saxons, is a competitive FIRST Robotics team based at Langley High School in McLean, Virginia. Since our rookie year in ${team.rookie_year}, we've been dedicated to inspiring students in STEM through robotics competitions and community outreach.`
                  }
                </p>
                {team.motto && <p><strong>Motto:</strong> {team.motto}</p>}
              </Card.Body>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="mt-4 team-content-card">
              <Card.Body>
                <h3 className="section-title">Achievements</h3>
                {team.achievements && team.achievements.length > 0 ? (
                  <ul className="achievement-list">
                    {team.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="achievement-list">
                    <li>Competed in multiple regional and district events</li>
                    <li>Mentored and supported numerous FIRST Lego League teams</li>
                    <li>Engaged in various STEM outreach initiatives in our community</li>
                    <li>Built innovative robots demonstrating creative engineering solutions</li>
                  </ul>
                )}
              </Card.Body>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="mt-4 team-content-card">
              <Card.Body>
                <h3 className="section-title">Get Involved</h3>
                <Row>
                  <Col md={4} className="mb-3 mb-md-0">
                    <Card className="h-100 involvement-card">
                      <Card.Body className="text-center">
                        <h4 className="involvement-title">Students</h4>
                        <p>
                          Join our team and learn valuable skills in engineering,
                          programming, design, and teamwork.
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-3 mb-md-0">
                    <Card className="h-100 involvement-card">
                      <Card.Body className="text-center">
                        <h4 className="involvement-title">Mentors</h4>
                        <p>
                          Share your expertise and help guide students in their
                          STEM journey through hands-on mentorship.
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="h-100 involvement-card">
                      <Card.Body className="text-center">
                        <h4 className="involvement-title">Sponsors</h4>
                        <p>
                          Support our mission by helping fund our team's robot
                          builds, competition fees, and outreach programs.
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default Team611; 