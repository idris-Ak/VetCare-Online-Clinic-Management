import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Card, Container, Table } from 'react-bootstrap';
import './VetDashboard.css';

function VetDashboard({ vet }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={dayjs}>
      <Container className="vet-dashboard">
        <h1 className="dashboard-title">Welcome, Dr. {vet ? vet.name : 'Vet'}</h1>
        
        <div className="dashboard-content">
          <div className="calendar-section">
            <h2>Calendar</h2>
            <DateCalendar
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          <div className="appointments-section">
            <Card className="mb-3">
              <Card.Header>Upcoming Appointments</Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Pet</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-10-15</td>
                      <td>10:00 AM</td>
                      <td>Buddy</td>
                      <td>John Doe</td>
                      <td>Confirmed</td>
                      <td>
                        <Button variant="info" size="sm">View</Button>{' '}
                        <Button variant="warning" size="sm">Reschedule</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>2024-10-16</td>
                      <td>1:00 PM</td>
                      <td>Whiskers</td>
                      <td>Jane Smith</td>
                      <td>Pending</td>
                      <td>
                        <Button variant="info" size="sm">View</Button>{' '}
                        <Button variant="warning" size="sm">Reschedule</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>Prescription Requests</Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Pet</th>
                      <th>Owner</th>
                      <th>Request Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Antibiotic</td>
                      <td>Max</td>
                      <td>Alice Johnson</td>
                      <td>2024-10-12</td>
                      <td>Pending</td>
                      <td>
                        <Button variant="success" size="sm">Approve</Button>{' '}
                        <Button variant="danger" size="sm">Reject</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Pain Relief</td>
                      <td>Bella</td>
                      <td>Bob Brown</td>
                      <td>2024-10-10</td>
                      <td>Approved</td>
                      <td>
                        <Button variant="info" size="sm">View</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </LocalizationProvider>
  );
}

export default VetDashboard;
