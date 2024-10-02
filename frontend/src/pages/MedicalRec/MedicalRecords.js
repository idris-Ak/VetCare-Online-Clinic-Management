import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, DropdownButton, Form, Modal, Table } from 'react-bootstrap';

import pet3Image from 'frontend/src/components/assets/about1.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet1Image from 'frontend/src/components/assets/blog3.jpg';
import './MedicalRecords.css';

function MedicalRecords() {
  const pets = [
    { id: 1, name: 'Goatie', image: pet1Image, age: '2 years', breed: 'Goat' },
    { id: 2, name: 'Pookie', image: pet2Image, age: '1 year', breed: 'Cat' },
    { id: 3, name: 'Dogie', image: pet3Image, age: '3 years', breed: 'Dog' }
  ];

  const [vets, setVets] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [showVetModal, setShowVetModal] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [category, setCategory] = useState('All');

  const initialRecords = [
    { petId: 1, date: '01/01/2023', service: 'Annual Check-up', vet: 'Dr. Doofenshmirtz', id: 1, weight: '25kg', healthStatus: 'Healthy', diet: 'Grass only' },
    { petId: 1, date: '01/06/2023', service: 'Vaccination', vet: 'Dr. Perry', id: 2, vaccine: 'Rabies', dose: '10mg', nextDose: '06/06/2023', vetComments: 'All went well' },
    { petId: 1, date: '01/10/2023', service: 'Treatment Plan', vet: 'Dr. Doofenshmirtz', id: 5, treatment: 'Allergy Treatment', medications: 'Antihistamine', dosage: '10mg', duration: '2 weeks', symptoms: 'Itchy skin', diagnosis: 'Seasonal allergies', followUpDate: '02/01/2023' },
    { petId: 2, date: '02/01/2023', service: 'Surgery', vet: 'Dr. Doofenshmirtz', id: 3, procedure: 'Spay', preOpDiagnosis: 'Healthy', postOpMedications: 'Painkillers', followUpPlan: 'Check-up in 1 week' },
    { petId: 3, date: '03/10/2023', service: 'General Check-up', vet: 'Dr. Perry', id: 4, weight: '12kg', healthStatus: 'Healthy', diet: 'Standard dry food' },
    { petId: 2, date: '03/15/2023', service: 'Vaccination', vet: 'Dr. Perry', id: 6, vaccine: 'Distemper', dose: '5mg', nextDose: '09/15/2023', vetComments: 'Minor swelling at injection site' },
    { petId: 3, date: '04/10/2023', service: 'Treatment Plan', vet: 'Dr. Perry', id: 7, treatment: 'Post-Surgery Recovery', medications: 'Painkillers', dosage: '20mg', duration: '1 month', symptoms: 'Post-op pain', diagnosis: 'Expected recovery', followUpDate: '05/10/2023' }
  ];

  const [selectedPet, setSelectedPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ 
    date: null, service: "", vet: "", weight: "", healthStatus: "", diet: "", allergies: "", medications: "" 
  });
  const [editRecord, setEditRecord] = useState({
    date: null,
    service: "",
    vet: ""
  });  
  const [errors, setErrors] = useState({ date: "", service: "", vet: "" });

  useEffect(() => {
    const storedVets = JSON.parse(localStorage.getItem('users'))?.filter(user => user.role === 'Vet') || [];
    setVets(storedVets);

    const storedRecords = JSON.parse(localStorage.getItem('medicalRecords'));
    if (storedRecords) {
      setAllRecords(storedRecords);
    } else {
      setAllRecords(initialRecords);
      localStorage.setItem('medicalRecords', JSON.stringify(initialRecords));
    }
  }, []);

  const handleDownload = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Medical Record', 10, 10);
    doc.setFontSize(12);
    doc.text(`Date: ${record.date}`, 10, 20);
    doc.text(`Service: ${record.service}`, 10, 30);
    doc.text(`Veterinarian: ${record.vet}`, 10, 40);
    if (record.weight) {
      doc.text(`Weight: ${record.weight}`, 10, 50);
      doc.text(`Health Status: ${record.healthStatus}`, 10, 60);
      doc.text(`Diet: ${record.diet}`, 10, 70);
    }
    if (record.vaccine) {
      doc.text(`Vaccine: ${record.vaccine}`, 10, 80);
      doc.text(`Dose: ${record.dose}`, 10, 90);
      doc.text(`Next Dose: ${record.nextDose}`, 10, 100);
      doc.text(`Vet Comments: ${record.vetComments}`, 10, 110);
    }
    if (record.treatment) {
      doc.text(`Treatment: ${record.treatment}`, 10, 120);
      doc.text(`Medications: ${record.medications}`, 10, 130);
      doc.text(`Dosage: ${record.dosage}`, 10, 140);
      doc.text(`Duration: ${record.duration}`, 10, 150);
      doc.text(`Symptoms: ${record.symptoms}`, 10, 160);
      doc.text(`Diagnosis: ${record.diagnosis}`, 10, 170);
      doc.text(`Follow-up Date: ${record.followUpDate}`, 10, 180);
    }
    if (record.procedure) {
      doc.text(`Procedure: ${record.procedure}`, 10, 190);
      doc.text(`Pre-op Diagnosis: ${record.preOpDiagnosis}`, 10, 200);
      doc.text(`Post-op Medications: ${record.postOpMedications}`, 10, 210);
      doc.text(`Follow-up Plan: ${record.followUpPlan}`, 10, 220);
    }
    doc.save(`medical-record-${record.id}.pdf`);
  };

  const handleSendToVet = () => {
    if (!selectedVet || !selectedRecord) return;
    const sharedRecords = JSON.parse(localStorage.getItem('sharedRecords')) || [];
    sharedRecords.push({
      recordId: selectedRecord.id,
      vetEmail: selectedVet.email,
      pdfFile: `medical-record-${selectedRecord.id}.pdf`,
      dateShared: new Date().toISOString(),
    });
    localStorage.setItem('sharedRecords', JSON.stringify(sharedRecords));
    setShowVetModal(false);
    alert(`Record shared with ${selectedVet.email}`);
  };

  const formatRecordDetails = (record) => {
    let details = `Date: ${record.date}\nService: ${record.service}\nVeterinarian: ${record.vet}`;
    if (record.weight) {
      details += `\n\nWeight: ${record.weight}\nHealth Status: ${record.healthStatus}\nDiet: ${record.diet}`;
    }
    if (record.vaccine) {
      details += `\n\nVaccine: ${record.vaccine}\nDose: ${record.dose}\nNext Dose: ${record.nextDose}\nVet Comments: ${record.vetComments}`;
    }
    if (record.treatment) {
      details += `\n\nTreatment: ${record.treatment}\nMedications: ${record.medications}\nDosage: ${record.dosage}\nDuration: ${record.duration}\nSymptoms: ${record.symptoms}\nDiagnosis: ${record.diagnosis}\nFollow-up Date: ${record.followUpDate}`;
    }
    if (record.procedure) {
      details += `\n\nProcedure: ${record.procedure}\nPre-op Diagnosis: ${record.preOpDiagnosis}\nPost-op Medications: ${record.postOpMedications}\nFollow-up Plan: ${record.followUpPlan}`;
    }
    return details;
  };

  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleSaveNewRecord = () => {
    let valid = true;
    const newErrors = { date: "", service: "", vet: "" };

    if (!newRecord.date) {
      newErrors.date = "Date is required.";
      valid = false;
    }
    
    if (newRecord.service.trim() === "") {
      newErrors.service = "Service is required.";
      valid = false;
    }
    
    if (!newRecord.vet.startsWith("Dr.")) {
      newErrors.vet = "Veterinarian must start with 'Dr.'";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const updatedRecords = [...allRecords, { id: allRecords.length + 1, ...newRecord, petId: selectedPet, date: dayjs(newRecord.date).format('MM/DD/YYYY') }];
      setAllRecords(updatedRecords);
      localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
      setShowAddModal(false);
      setNewRecord({ date: null, service: "", vet: "" });
      setErrors({ date: "", service: "", vet: "" });
    }
  };

  const handleSaveEdit = () => {
    let valid = true;
    const newErrors = { date: "", service: "", vet: "" };
  
    if (!editRecord.date) {
      newErrors.date = "Date is required.";
      valid = false;
    }
    
    if (editRecord.service.trim() === "") {
      newErrors.service = "Service is required.";
      valid = false;
    }
    
    if (!editRecord.vet.startsWith("Dr.")) {
      newErrors.vet = "Veterinarian must start with 'Dr.'";
      valid = false;
    }
  
    setErrors(newErrors);
  
    if (valid) {
      const updatedRecords = allRecords.map((record) =>
        record.id === editRecord.id
          ? { ...record, ...editRecord, date: dayjs(editRecord.date).format('MM/DD/YYYY') }
          : record
      );
  
      setAllRecords(updatedRecords);
      localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
      setShowEditModal(false);
      setErrors({ date: "", service: "", vet: "" });
    }
  };

  const handleClose = () => {
    setShowEditModal(false); 
    setShowAddModal(false);  
    setErrors({ date: "", service: "", vet: "" }); 
  };

  const handleDeleteRecord = (id) => {
    const updatedRecords = allRecords.filter(record => record.id !== id);
    setAllRecords(updatedRecords);
    localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
  };

  const handleShowEditModal = (record) => {
    setEditRecord({ ...record, date: dayjs(record.date, 'MM/DD/YYYY') });  
    setShowEditModal(true); 
  };

  const filteredRecords = allRecords
    .filter(record =>
      (!selectedPet || record.petId === selectedPet) &&
      ((record.service && record.service.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (record.date && record.date.includes(searchTerm)))
    );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container className="medical-records-page">
        <div className="pet-section">
          <h2>Pets</h2>
          <div className="pet-selection">
            <div className="pet-list">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={`pet ${selectedPet === pet.id ? 'selected' : ''}`}
                >
                  <img src={pet.image} alt={pet.name} className="pet-image" />
                  <div className="pet-name">{pet.name}</div>
                  <Button
                    className={`select ${selectedPet === pet.id ? 'selected-green' : ''}`}  
                    onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)} 
                  >
                    {selectedPet === pet.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2>{selectedPet ? `${pets.find(pet => pet.id === selectedPet).name}'s Medical Records` : 'All Pets Medical Records'}</h2>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <DropdownButton
              id="dropdown-basic-button"
              title={`Category: ${category}`}
              onSelect={(eventKey) => setCategory(eventKey)}
              className="category-dropdown"
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Vaccination">Vaccination</Dropdown.Item>
              <Dropdown.Item eventKey="Treatment Plan">Treatment Plan</Dropdown.Item>
              <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
            </DropdownButton>

            <Button onClick={handleAddRecord} disabled={!selectedPet} className="add-record-btn">
              Add Record
            </Button>
          </div>

          <div className="search-bar mb-3">
            <Form.Control
              type="text"
              placeholder="Search records by date or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table striped bordered hover className="table-container">
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Veterinarian</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.service}</td>
                  <td>{record.vet}</td>
                  <td>
                    <Button variant="info" size="sm" onClick={() => {
                      setSelectedRecord(record);
                      setShowRecordModal(true);
                    }}>View</Button>{' '}
                    <Button variant="warning" size="sm" onClick={() => handleShowEditModal(record)}>Edit</Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDeleteRecord(record.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Add Record Modal */}
        <Modal show={showAddModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Medical Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  label="Select date"
                  value={newRecord.date}
                  onChange={(date) => setNewRecord({ ...newRecord, date })}
                  renderInput={(params) => (
                    <Form.Control
                      {...params.inputProps}
                      isInvalid={!!errors.date}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formService">
                <Form.Label>Service</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecord.service}
                  onChange={(e) => setNewRecord({ ...newRecord, service: e.target.value })}
                  isInvalid={!!errors.service}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.service}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formVet">
                <Form.Label>Veterinarian</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecord.vet}
                  onChange={(e) => setNewRecord({ ...newRecord, vet: e.target.value })}
                  isInvalid={!!errors.vet}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.vet}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={handleSaveNewRecord}>Save Record</Button>
          </Modal.Footer>
        </Modal>

        {/* View Record Modal */}
        <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Medical Record Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRecord && <pre>{formatRecordDetails(selectedRecord)}</pre>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRecordModal(false)}>Close</Button>
            <Button variant="primary" onClick={() => handleDownload(selectedRecord)}>Download PDF</Button>
            <Button variant="primary" onClick={() => setShowVetModal(true)}>Share with Vet</Button>
          </Modal.Footer>
        </Modal>

        {/* Share with Vet Modal */}
        <Modal show={showVetModal} onHide={() => setShowVetModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Share with Vet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Select Veterinarian</Form.Label>
              <Form.Control as="select" onChange={(e) => setSelectedVet(vets.find(vet => vet.email === e.target.value))}>
                <option value="">Select Vet</option>
                {vets.map(vet => (
                  <option key={vet.email} value={vet.email}>{vet.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowVetModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleSendToVet}>Send</Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Record Modal */}
        <Modal show={showEditModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Medical Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  label="Select date"
                  value={editRecord.date}
                  onChange={(date) => setEditRecord({ ...editRecord, date })}
                  renderInput={(params) => (
                    <Form.Control
                      {...params.inputProps}
                      isInvalid={!!errors.date}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formService">
                <Form.Label>Service</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.service}
                  onChange={(e) => setEditRecord({ ...editRecord, service: e.target.value })}
                  isInvalid={!!errors.service}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.service}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formVet">
                <Form.Label>Veterinarian</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.vet}
                  onChange={(e) => setEditRecord({ ...editRecord, vet: e.target.value })}
                  isInvalid={!!errors.vet}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.vet}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </LocalizationProvider>
  );
}

export default MedicalRecords;
