import React, { useState, useEffect } from 'react';
import { Button, Table, Container, Modal, Alert, Form } from 'react-bootstrap';
import { jsPDF } from 'jspdf';  // Import jsPDF library
// Importing pet images
import pet1Image from 'frontend/src/components/assets/blog3.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet3Image from 'frontend/src/components/assets/about1.jpg';
import './MedicalRecords.css';

function MedicalRecords() {

  // Mock user data with multiple pets
  const pets = [
    { id: 1, name: 'Goatie', image: pet1Image, age: '2 years', breed: 'Goat' },
    { id: 2, name: 'Pookie', image: pet2Image, age: '1 year', breed: 'Cat' },
    { id: 3, name: 'Dogie', image: pet3Image, age: '3 years', breed: 'Dog' }
  ];
  // State for storing vets and medical records
  const [vets, setVets] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [showVetModal, setShowVetModal] = useState(false);
  // Expanded medical records with vaccination and treatment plans
  const [allRecords] = useState([
    { petId: 1, date: '01/01/2023', service: 'Annual Check-up', vet: 'Dr. Doofenshmirtz', id: 1 },
    { petId: 1, date: '01/06/2023', service: 'Vaccination', vet: 'Dr. Perry', id: 2, vaccine: 'Rabies', dose: '10mg', nextDose: '06/06/2023' },
    { petId: 1, date: '01/10/2023', service: 'Treatment Plan', vet: 'Dr. Doofenshmirtz', id: 5, treatment: 'Allergy Treatment', medications: 'Antihistamine', duration: '2 weeks' },
    { petId: 2, date: '02/01/2023', service: 'Surgery', vet: 'Dr. Doofenshmirtz', id: 3 },
    { petId: 3, date: '03/10/2023', service: 'General Check-up', vet: 'Dr. Perry', id: 4 },
    { petId: 2, date: '03/15/2023', service: 'Vaccination', vet: 'Dr. Perry', id: 6, vaccine: 'Distemper', dose: '5mg', nextDose: '09/15/2023' },
    { petId: 3, date: '04/10/2023', service: 'Treatment Plan', vet: 'Dr. Perry', id: 7, treatment: 'Post-Surgery Recovery', medications: 'Painkillers', duration: '1 month' }
  ]);

  // State for selected pet (default is all)
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state for viewing medical record, vaccination, or treatment plan
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  

  useEffect(() => {
    // Load vets from localStorage
    const storedVets = JSON.parse(localStorage.getItem('users'))?.filter(user => user.role === 'Vet') || [];
    setVets(storedVets);
  }, []);

  // Handle filtering based on selected pet and search term
  const filteredRecords = allRecords
    .filter(record =>
      (!selectedPet || record.petId === selectedPet) &&
      (record.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm))
    );

  // Handle Download Record (PDF)
  const handleDownload = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Medical Record', 10, 10);
    doc.setFontSize(12);
    doc.text(`Date: ${record.date}`, 10, 20);
    doc.text(`Service: ${record.service}`, 10, 30);
    doc.text(`Veterinarian: ${record.vet}`, 10, 40);
    if (record.vaccine) {
      doc.text(`Vaccine: ${record.vaccine}`, 10, 50);
      doc.text(`Dose: ${record.dose}`, 10, 60);
      doc.text(`Next Dose: ${record.nextDose}`, 10, 70);
    }
    if (record.treatment) {
      doc.text(`Treatment: ${record.treatment}`, 10, 50);
      doc.text(`Medications: ${record.medications}`, 10, 60);
      doc.text(`Duration: ${record.duration}`, 10, 70);
    }
    doc.save(`medical-record-${record.id}.pdf`);
  };

  // Handle Email Record
  const handleEmail = (record) => {
    alert(`Record of ${record.service} sent via email.`);
  };
  
  const handleSendToVet = () => {
    if (!selectedVet || !selectedRecord) return;

    console.log(selectedRecord)
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    // const sender = existingUsers.find(user => user.email === selectedRecord.sender);
    
    // if (!sender) {
    //   alert('Sender information not found.');
    //   return;
    // }

    const sharedRecords = JSON.parse(localStorage.getItem('sharedRecords')) || [];
    sharedRecords.push({
      recordId: selectedRecord.id,
      vetEmail: selectedVet.email,
      // sender: sender.email,
      treatmentPlans: selectedRecord.treatment || {},
      pdfFile: `medical-record-${selectedRecord.id}.pdf`, // This should be handled differently in practice
      dateShared: new Date().toISOString(),
    });
    localStorage.setItem('sharedRecords', JSON.stringify(sharedRecords));

    setShowVetModal(false);
    alert(`Record shared with ${selectedVet.email}`);
  };


  // Format record details for display in modal
  const formatRecordDetails = (record) => {
    let details = `Date: ${record.date}\nService: ${record.service}\nVeterinarian: ${record.vet}`;
    if (record.vaccine) {
      details += `\n\nVaccine: ${record.vaccine}\nDose: ${record.dose}\nNext Dose: ${record.nextDose}`;
    }
    if (record.treatment) {
      details += `\n\nTreatment: ${record.treatment}\nMedications: ${record.medications}\nDuration: ${record.duration}`;
    }
    return details;
  };

  return (
    <Container className='medicarecords-page'>
      <div className='pet-section'>
        <h1>Select Pet Profile</h1>
        <div className="pet-selection">
          <div className="pet-list">
            {pets.map(pet => (
              <div key={pet.id} className="pet">
                <img src={pet.image} alt={pet.name} className="pet-image" />
                <p className="pet-name">{pet.name}</p>
                <Button
                  className={selectedPet === pet.id ? 'selected' : 'select'}
                  onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
                >
                  {selectedPet === pet.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical Records Table */}
      <div>
        <h2>{selectedPet ? `${pets.find(pet => pet.id === selectedPet).name}'s Medical Records` : 'All Pets Medical Records'}</h2>

        {/* Search Bar */}
        <div className="search-bar">
          <Form.Control
            type="text"
            placeholder="Search records by date or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredRecords.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type of Service</th>
                <th>Veterinarian</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.service}</td>
                  <td>{record.vet}</td>
                  <td>
                    <Button variant="primary" onClick={() => { setSelectedRecord(record); setShowRecordModal(true); }}>
                      View
                    </Button>
                    <Button variant="success" onClick={() => handleDownload(record)}>
                      Download
                    </Button>
                    <Button variant="warning" onClick={() => { setSelectedRecord(record); setShowVetModal(true); }}>
                      Share to Vet
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No records available for the selected pet or search term.</p>
        )}
      </div>

      {/* Modal for Viewing Medical Record */}
      {selectedRecord && (
        <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Record Details for {selectedRecord.service}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <div className="modal-content">
              <Alert variant="info" className="modal-alert">Veterinarian: {selectedRecord.vet}</Alert>
              <h5>Details</h5>
              <pre>{formatRecordDetails(selectedRecord)}</pre>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRecordModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Modal for Sharing to Vet */}
      {showVetModal && (
        <Modal show={showVetModal} onHide={() => setShowVetModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Select Vet to Share Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formVetSelect">
                <Form.Label>Select a Vet</Form.Label>
                <Form.Control as="select" onChange={(e) => setSelectedVet(vets.find(vet => vet.email === e.target.value))}>
                  <option value="">Select a Vet</option>
                  {vets.map(vet => (
                    <option key={vet.email} value={vet.email}>{vet.email}</option>
                  ))}
                </Form.Control>

              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowVetModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendToVet}>
              Share Record
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default MedicalRecords;
