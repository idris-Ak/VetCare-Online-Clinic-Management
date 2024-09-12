import React, { useState } from 'react';
import { Button, Table, Container, Modal, Alert, Form, Row, Col, InputGroup, FormControl, Tab, Nav } from 'react-bootstrap';
import { jsPDF } from 'jspdf';  // Import jsPDF library
import { useNavigate } from 'react-router-dom';

function MedicalRecords() {
  const [activeView, setActiveView] = useState('medicalRecords'); // Tracks whether to show medical records or prescriptions
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering records

  // Dummy Data for Medical Records
  const [records] = useState([
    { date: '01/01/2023', service: 'Annual Check-up', vet: 'Dr. Doofenshmirtz', id: 1, notes: 'Healthy checkup, all vitals normal.' },
    { date: '01/06/2023', service: 'Vaccination', vet: 'Dr. Perry', id: 2, notes: 'Rabies and distemper vaccinations administered.' },
  ]);
  const [filteredRecords, setFilteredRecords] = useState(records); // Filtered records for the search

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  const navigate = useNavigate();

  // Payment form state and validation
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '', expiryDate: '', cvv: ''
  });
  const [errors, setErrors] = useState({
    cardNumberError: '', expiryDateError: '', cvvError: ''
  });

  // Handle download of medical record as PDF
  const handleDownload = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Medical Record', 10, 10);
    doc.setFontSize(12);
    doc.text(`Date: ${record.date}`, 10, 20);
    doc.text(`Service: ${record.service}`, 10, 30);
    doc.text(`Veterinarian: ${record.vet}`, 10, 40);
    doc.text(`Notes: ${record.notes}`, 10, 50);
    doc.save(`medical-record-${record.id}.pdf`);
  };

  // Filter records based on search term
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredRecords(records.filter(record => record.service.toLowerCase().includes(term) || record.vet.toLowerCase().includes(term)));
  };

  return (
    <Container>
      <h1 className="title">VetCare Dashboard</h1>

      {/* Tab Navigation for Medical Records and Prescription Refills */}
      <Tab.Container id="dashboard-tabs" defaultActiveKey="medicalRecords">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="medicalRecords" onClick={() => setActiveView('medicalRecords')}>Medical Records</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Medical Records View */}
          {activeView === 'medicalRecords' && (
            <div className="medical-records-container">
              <h2>Pet Medical Records</h2>
              
              {/* Search Bar */}
              <div className="search-bar">
                <InputGroup>
                  <FormControl
                    placeholder="Search by service or vet..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </div>

              <Table striped bordered hover className="records-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type of Service</th>
                    <th>Veterinarian</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? filteredRecords.map(record => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>{record.service}</td>
                      <td>{record.vet}</td>
                      <td>
                        <Button variant="primary" className="action-button" onClick={() => { setSelectedRecord(record); setShowRecordModal(true); }}>View</Button>
                        <Button variant="success" className="action-button" onClick={() => handleDownload(record)}>Download</Button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4">No records found</td></tr>}
                </tbody>
              </Table>
            </div>
          )}
        </Tab.Content>
      </Tab.Container>

      {/* Modal for Viewing Medical Record */}
      {selectedRecord && (
        <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)} className="record-modal">
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecord.service} Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info">Consulted by: {selectedRecord.vet}</Alert>
            <h5>Service Details</h5>
            <p>{selectedRecord.notes}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRecordModal(false)}>Close</Button>
            <Button variant="success" onClick={() => handleDownload(selectedRecord)}>Download PDF</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default MedicalRecords;
