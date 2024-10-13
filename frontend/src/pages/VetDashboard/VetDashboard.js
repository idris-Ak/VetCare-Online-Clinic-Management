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
        console.log("vets shared records",records)
      } else {
        console.error('Failed to fetch medical records');
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

    // Handle viewing a record in the modal
    const handleViewRecord = (record) => {
      setSelectedRecord(record);
      setShowRecordModal(true);
    };
  
  const handleDownload = (record) => {
    // Create a new jsPDF document
    const doc = new jsPDF();
  
    // Title of the document
    doc.setFontSize(16);
    doc.text('Medical Record', 10, 10);

    console.log("record to download: ", record);
  
    // Add record information
    doc.setFontSize(12);
    doc.text(`Date: ${record.recordDate || 'N/A'}`, 10, 20); // Default 'N/A' if date is missing
    doc.text(`Service: ${record.service || 'N/A'}`, 10, 30);
    doc.text(`Veterinarian: ${record.vet.name || 'N/A'}`, 10, 40);
  
    // Conditionally add the optional fields if they exist
    let yPosition = 50; // Keep track of vertical position
  
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
  
    // Save the PDF file with a unique name using the record ID
    doc.save(`medical-record-${record.id || 'unknown'}.pdf`);
    console.log("Downloading PDF for record:", record);
  };


    //   // Create a new jsPDF document
    //   const doc = new jsPDF();
  
    //   // Title of the document
    //   doc.setFontSize(16);
    //   doc.text('Medical Record', 10, 10);
  
    //   console.log("record to download: ", record);
    
    //   // Add record information
    //   doc.setFontSize(12);
    //   doc.text(`Date: ${record.recordDate || 'N/A'}`, 10, 20); // Default 'N/A' if date is missing
    //   doc.text(`Service: ${record.service || 'N/A'}`, 10, 30);
    //   doc.text(`Veterinarian: ${record.vet.name || 'N/A'}`, 10, 40);
    
    //   // Conditionally add the optional fields if they exist
    //   let yPosition = 50; // Keep track of vertical position
    
    //   if (record.weight) {
    //     doc.text(`Weight: ${record.weight}`, 10, yPosition);
    //     yPosition += 10;
    //   }
    
    //   if (record.healthStatus) {
    //     doc.text(`Health Status: ${record.healthStatus}`, 10, yPosition);
    //     yPosition += 10;
    //   }
    
    //   if (record.diet) {
    //     doc.text(`Diet: ${record.diet}`, 10, yPosition);
    //     yPosition += 10;
    //   }
    
    //   if (record.allergies) {
    //     doc.text(`Allergies: ${record.allergies}`, 10, yPosition);
    //     yPosition += 10;
    //   }
    
    //   if (record.medications) {
    //     doc.text(`Medications: ${record.medications}`, 10, yPosition);
    //     yPosition += 10;
    //   }
    
    //   if (record.description) {
    //     doc.text(`Description: ${record.description}`, 10, yPosition);
    //     yPosition += 10;
    //   }
    
    //   // Save the PDF file with a unique name using the record ID
    //   doc.save(`medical-record-${record.id || 'unknown'}.pdf`);
    // };
    

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container className="vet-dashboard">
        <h1 className="dashboard-title" >Welcome, {user && user.role === 'Vet' ? `Dr. ${user.name}` : user ? user.name : 'Vet'}</h1>
        
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
                        <td colSpan="4" className="text-center">
                          No shared records available.
                        </td>
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
            {selectedRecord && (
              <>
                <p><strong>Date:</strong> {selectedRecord.recordDate}</p>
                <p><strong>Service:</strong> {selectedRecord.service}</p>
                <p><strong>Veterinarian:</strong> {selectedRecord.vet.name}</p>
                <p><strong>Weight:</strong> {selectedRecord.weight}</p>
                <p><strong>Health Status:</strong> {selectedRecord.healthStatus}</p>
                <p><strong>Diet:</strong> {selectedRecord.diet}</p>
                <p><strong>Allergies:</strong> {selectedRecord.allergies}</p>
                <p><strong>Medications:</strong> {selectedRecord.medications}</p>
                <p><strong>Description:</strong> {selectedRecord.description}</p>
              </>
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
