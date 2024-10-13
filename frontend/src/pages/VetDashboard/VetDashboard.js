import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Table, Modal } from 'react-bootstrap';
import './VetDashboard.css';

function VetDashboard({ user }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [sharedRecords, setSharedRecords] = useState([]);
  const [appointments, setAppointments] = useState([]); // New state for appointments
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch shared records when the component mounts
  useEffect(() => {
    if (user && user.role === 'Vet') {
      fetchSharedRecords(user.vetId);
      console.log("vet user:", user);
    }
  }, [user]);

  const fetchSharedRecords = async (vetId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/vets/${vetId}`);
      if (response.ok) {
        const vet = await response.json();
        const recordIds = vet.sharedRecordIds;
        saveRecords(recordIds);
      } else {
        console.error('Failed to fetch shared records');
      }
    } catch (error) {
      console.error('Error fetching shared records:', error);
    }
  };

  // Function to save records based on the list of record IDs
  const saveRecords = async (recordIds) => {
    try {
      const response = await fetch(`http://localhost:8080/api/medicalRecords/getRecordsByIds?recordIds=${recordIds.join(',')}`);
      if (response.ok) {
        const records = await response.json();
        setSharedRecords(records); // Update state with fetched records
        console.log("vets shared records", records);
      } else {
        console.error('Failed to fetch medical records');
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentsData = await getAllAppointments();
      if (appointmentsData) {
        setAppointments(appointmentsData); // Update state with fetched appointments
      }
    };
    fetchAppointments();
  }, []);

  // Function to get all appointments
  const getAllAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments`);
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      return null;
    }
  };

  // Handle viewing a record in the modal
  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowRecordModal(true);
  };

  const handleDownload = (record) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Medical Record', 10, 10);

    console.log("record to download: ", record);

    doc.setFontSize(12);
    doc.text(`Date: ${record.recordDate || 'N/A'}`, 10, 20); 
    doc.text(`Service: ${record.service || 'N/A'}`, 10, 30);
    doc.text(`Veterinarian: ${record.vet.name || 'N/A'}`, 10, 40);
  
    let yPosition = 50; 

    if (record.weight) {
      doc.text(`Weight: ${record.weight}`, 10, yPosition);
      yPosition += 10;
    }

    if (record.healthStatus) {
      doc.text(`Health Status: ${record.healthStatus}`, 10, yPosition);
      yPosition += 10;
    }

    if (record.diet) {
      doc.text(`Diet: ${record.diet}`, 10, yPosition);
      yPosition += 10;
    }

    if (record.allergies) {
      doc.text(`Allergies: ${record.allergies}`, 10, yPosition);
      yPosition += 10;
    }

    if (record.medications) {
      doc.text(`Medications: ${record.medications}`, 10, yPosition);
      yPosition += 10;
    }

    if (record.description) {
      doc.text(`Description: ${record.description}`, 10, yPosition);
      yPosition += 10;
    }

    doc.save(`medical-record-${record.id || 'unknown'}.pdf`);
    console.log("Downloading PDF for record:", record);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container className="vet-dashboard">
        <h1 className="dashboard-title">Welcome, {user && user.role === 'Vet' ? `Dr. ${user.name}` : user ? user.name : 'Vet'}</h1>

        <div className="dashboard-content">
          <div className="calendar-section">
            <h2>Calendar</h2>
            <DateCalendar value={selectedDate} onChange={(date) => setSelectedDate(date)} />
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
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.pet?.name || 'N/A'}</td>  {/* Safeguard here */}
                        <td>{appointment.owner?.name || 'N/A'}</td>  {/* Safeguard here */}
                        <td>{appointment.status}</td>
                        <td>
                          <Button variant="info" size="sm">View</Button>{' '}
                          <Button variant="warning" size="sm">Reschedule</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No upcoming appointments</td>
                    </tr>
                  )}

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
                    {/* Add prescription requests data here */}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>

          <div className="shared-records-section">
            <Card className="mb-3">
              <Card.Header>Shared Medical Records</Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Record Date</th>
                      <th>Pet</th>
                      <th>Service</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedRecords.length > 0 ? (
                      sharedRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{record.recordDate}</td>
                          <td>{record.pet.name}</td>
                          <td>{record.service}</td>
                          <td>
                            <Button variant="info" size="sm" onClick={() => handleViewRecord(record)}>View</Button>{' '}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No shared records available.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Modal for viewing record details */}
        <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Medical Record Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRecord ? (
              <>
                <p>Date: {selectedRecord.recordDate}</p>
                <p>Service: {selectedRecord.service}</p>
                <p>Weight: {selectedRecord.weight}</p>
                <p>Health Status: {selectedRecord.healthStatus}</p>
                <p>Diet: {selectedRecord.diet}</p>
                <p>Allergies: {selectedRecord.allergies}</p>
                <p>Medications: {selectedRecord.medications}</p>
                <p>Description: {selectedRecord.description}</p>
              </>
            ) : (
              <p>No record selected.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRecordModal(false)}>Close</Button>
            <Button variant="primary" onClick={() => handleDownload(selectedRecord)}>Download PDF</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </LocalizationProvider>
  );
}

export default VetDashboard;
