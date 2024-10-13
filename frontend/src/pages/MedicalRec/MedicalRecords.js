import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, DropdownButton, Form, Modal, Table } from 'react-bootstrap';

import './MedicalRecords.css';

function MedicalRecords({ user }) {
  const [vets, setVets] = useState([]);
  const [petData, setPetData] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [showVetModal, setShowVetModal] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [category, setCategory] = useState('All');
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: null,
    service: "",
    vet: "",
    weight: "",
    healthStatus: "",
    diet: "",
    allergies: "",
    medications: "",
    description: ""
  });
  const [editRecord, setEditRecord] = useState({
    id: null,
    date: null,
    service: "",
    vet: "",
    weight: "",
    healthStatus: "",
    diet: "",
    allergies: "",
    medications: "",
    description: ""
  });
  const [errors, setErrors] = useState({ date: "", service: "", vet: "" });

  // Effect to fetch the list of veterinarians from the API on component mount
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/vets');
        const vetData = await response.json();
        setVets(vetData);
      } catch (error) {
        console.error('Error fetching vets:', error);
      }
    };

    fetchVets();
  }, []);

  // Effect to fetch the user's pets if the user is defined
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) {
      async function getUserPets() {
        const storedUserPets = await getPetInfo();
        setPetData(storedUserPets || []);

      }
      getUserPets();
    }

  }, [user]); 
  
  // Function to fetch pet information for the current user
  const getPetInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/pets/user/${user.id}`);
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Error fetching pets:', error);
      return null;
    }
  };

  // Effect to fetch medical records based on selected pet or user
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchRecords = async () => {

      if (!user) {
        console.error("User is not defined.");
        return; 
    }
    
      let url = `http://localhost:8080/api/medicalRecords`;
      if (selectedPet) {
        url += `/pet/${selectedPet}`;
      } else {
        url += `/user/${user.id}`; 
      }

      try {
        const response = await fetch(url);

        if (response.ok) {
          const records = await response.json();
          setAllRecords(records);

          setTimeout(() => {
        }, 0);
        } else {
          console.error('Failed to fetch records');
          setAllRecords([]);
        }
      } catch (error) {
        console.error('Error fetching records:', error);
        setAllRecords([]);
      }
    };

    fetchRecords();
  }, [selectedPet, user]);

  // Effect to filter medical records based on selected pet and search term
  useEffect(() => {
    const filtered = allRecords.filter(record => {
        const matchesPet = !selectedPet || (record.pet && record.pet.id === Number(selectedPet)); 
        const matchesSearch = 
            (record.service && record.service.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (record.recordDate && record.recordDate.includes(searchTerm)); 

        return matchesPet && matchesSearch;
    });

    setFilteredRecords(filtered);
}, [allRecords, selectedPet, searchTerm]);

  // Function to handle downloading a medical record as a PDF
  const handleDownload = (record) => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text('Medical Record', 10, 10);
  
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
  };
  
  // Function to send the selected medical record to the selected veterinarian
  const handleSendToVet = async () => {
    if (!selectedVet || !selectedRecord) return;

    const shareData = {
      recordId: selectedRecord.id,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/vets/share/${selectedVet.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shareData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Record shared with ${selectedVet.name}`);
        setShowVetModal(false);
      } else {
        alert(`Failed to share record: ${result.message}`);
      }
    } catch (error) {
      console.error("Error sharing record:", error);
    }
  };
  // Function to handle showing the modal for adding a new medical record
  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  // Function to validate and save a new medical record
  const handleSaveNewRecord = async () => {
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

    if (newRecord.vet.startsWith("Select")) {
      newErrors.vet = "You must select a Veterinarian";
      valid = false;
    }

    setErrors(newErrors);

    if (!selectedVet) {
      alert("Please select a veterinarian before saving the record.");
      return; 
    }
    
    if (valid) {
      const recordData = {
        petId: selectedPet,  
        recordDate: dayjs(newRecord.date).format('YYYY-MM-DD'),
        service: newRecord.service === 'Other' ? newRecord.customService : newRecord.service, 
        vetId: selectedVet.id,
        weight: newRecord.weight || "", 
        healthStatus: newRecord.healthStatus || "", 
        diet: newRecord.diet || "", 
        allergies: newRecord.allergies || "", 
        medications: newRecord.medications || "", 
        description: newRecord.description || "",
      };

      try {
        const response = await fetch(`http://localhost:8080/api/medicalRecords/pet/${selectedPet}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recordData),
        });

        if (response.ok) {
          const createdRecord = await response.json();
          setAllRecords(prev => [...prev, createdRecord]);
          setShowAddModal(false);
          setNewRecord({
            date: null,
            service: "",
            vet: "",
            weight: "",
            healthStatus: "",
            diet: "",
            allergies: "",
            medications: "",
            description: ""
          });
        } else {
          const errorData = await response.json(); 
          console.error("Failed to add medical record:", errorData);
          alert("Failed to add medical record: " + (errorData.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error saving new record:", error);
      }
    }
  };

  // Function to handle showing the modal for editing an existing medical record
  const handleShowEditModal = (record) => {
    setEditRecord({
        id: record.id,
        date: dayjs(record.recordDate), 
        service: record.service || "", 
        vet: record.vet.name || "", 
        weight: record.weight || "", 
        healthStatus: record.healthStatus || "", 
        diet: record.diet || "", 
        allergies: record.allergies || "", 
        medications: record.medications || "", 
        description: record.description || "", 
    });
  
      setShowEditModal(true);
    };
    

  // Function to validate and save the edited medical record
  const handleSaveEdit = async () => {
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

    if (typeof editRecord.vet !== 'string' || editRecord.vet.startsWith("Select")) {
      newErrors.vet = "You must select a Veterinarian";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const updatedRecordData = {
        ...editRecord,

        recordDate: dayjs(editRecord.date).format('YYYY-MM-DD'),
        service: editRecord.service === 'Other' ? editRecord.customService : editRecord.service, 
        vetId: selectedVet.id,
        weight: editRecord.weight || "", 
        healthStatus: editRecord.healthStatus || "", 
        diet: editRecord.diet || "", 
        allergies: editRecord.allergies || "", 
        medications: editRecord.medications || "", 
        description: editRecord.description || "", 
      };


      try {
        const response = await fetch(`http://localhost:8080/api/medicalRecords/${editRecord.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecordData),
        });

        if (response.ok) {
          const updatedRecord = await response.json();
          setAllRecords(prev => prev.map(record => (record.id === updatedRecord.id ? updatedRecord : record)));
          setShowEditModal(false);
        } else {
          alert("Failed to update medical record.");
        }
      } catch (error) {
        console.error("Error saving edited record:", error);
      }
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setErrors({ date: "", service: "", vet: "" });
  };

  // Function to delete a medical record
  const handleDeleteRecord = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/medicalRecords/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAllRecords(prev => prev.filter(record => record.id !== id));
      } else {
        alert("Failed to delete medical record.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container className="medical-records-page">
        <div className="pet-section">
          <section className="appointment-pet-selection">
          <h2>Select Pet Profile</h2>
            <div className="appointment-pet-profiles">
              {petData.length > 0 ? (
                petData.map((pet) => (
                  <div key={pet.id} className="pet">
                    <img src={`data:image/jpeg;base64,${pet.profilePicture}`} alt={pet.name} />
                    <p className="pet-name">{pet.name}</p>
                    <button
                      className={selectedPet === pet.id ? 'selected' : 'select'}
                      onClick={() => {
                        setSelectedPet(selectedPet === pet.id ? null : pet.id);
                      }}
                    >
                      {selectedPet === pet.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                ))
              ) : (
                <h2>Please add your pets on the profile page.</h2>
              )}
            </div>
          </section>
        </div>

        <div>
          <h2>{selectedPet ? `${petData.find(pet => pet.id === selectedPet).name}'s Medical Records` : 'All Pets Medical Records'}</h2>

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
                  <td>{record.recordDate}</td>
                  <td>{record.service}</td>
                  <td>{record.vet.name}</td>
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
                  maxDate={dayjs()}  
                  textField={(params) => (
                    <Form.Control
                      {...params.inputProps}
                      isInvalid={!!errors.date}
                      value={params.inputProps.value} //
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formService">
                <Form.Label>Service</Form.Label>
                <Form.Select
                  value={newRecord.service}
                  onChange={(e) => {
                    const selectedService = e.target.value;
                    setNewRecord((prevRecord) => ({
                      ...prevRecord,
                      service: selectedService,
                      customService: selectedService === 'Other' ? '' : prevRecord.customService,
                    }));
                  }}
                  isInvalid={!!errors.service}
                >
                  <option value="">Select Service</option>
                  <option value="Treatment Plan">Treatment Plan</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.service}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Conditional input for custom service */}
              {newRecord.service === 'Other' && (
                <Form.Group controlId="formCustomService">
                  <Form.Label>Custom Service</Form.Label>
                  <Form.Control
                    type="text"
                    value={newRecord.customService || ""}  
                    onChange={(e) => setNewRecord((prevRecord) => ({
                      ...prevRecord,
                      customService: e.target.value,
                    }))}
                    isInvalid={!!errors.customService}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.customService}
                  </Form.Control.Feedback>
                </Form.Group>
              )}


              <Form.Group controlId="formVet">
                <Form.Label>Veterinarian</Form.Label>
                <Form.Control as="select" value={newRecord.vet} onChange={(e) => {
                  const selectedVetName = e.target.value;
                  const selectedVet = vets.find(vet => vet.name === selectedVetName);
                  setSelectedVet(selectedVet);
                  setNewRecord({ ...newRecord, vet: selectedVetName });
                }} isInvalid={!!errors.vet}>
                  <option value="">Select Vet</option>
                  {vets.map(vet => (
                    <option key={vet.id} value={vet.name}>{vet.name}</option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.vet}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formWeight">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecord.weight}
                  onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formHealthStatus">
                <Form.Label>Health Status</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecord.healthStatus}
                  onChange={(e) => setNewRecord({ ...newRecord, healthStatus: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formDiet">
                <Form.Label>Diet</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecord.diet}
                  onChange={(e) => setNewRecord({ ...newRecord, diet: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAllergies">
                <Form.Label>Allergies</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecord.allergies}
                  onChange={(e) => setNewRecord({ ...newRecord, allergies: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formMedications">
                <Form.Label>Medications</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecord.medications}
                  onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                />
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
              <Form.Control as="select"
               onChange={(e) => setSelectedVet(vets.find(vet => vet.id === parseInt(e.target.value)))}>
                <option value="">Select Vet</option>
                {vets.map(vet => (
                  <option key={vet.id} value={vet.id}>{vet.name}</option>
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
                  maxDate={dayjs()}
                  textField={(params) => (
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
            {/* Use service dropdown like Add modal */}
            <Form.Group controlId="formService">
              <Form.Label>Service</Form.Label>
              <Form.Select
                value={editRecord.service || ""}
                onChange={(e) => {
                  const selectedService = e.target.value;
                  setEditRecord((prevRecord) => ({
                    ...prevRecord,
                    service: selectedService,
                    customService: selectedService === 'Other' ? '' : prevRecord.customService,
                  }));
                }}
                isInvalid={!!errors.service}
              >
                <option value="">Select Service</option>
                <option value="Treatment Plan">Treatment Plan</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.service}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Conditional input for custom service */}
            {editRecord.service === 'Other' && (
              <Form.Group controlId="formCustomService">
                <Form.Label>Custom Service</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.customService || ""}
                  onChange={(e) => setEditRecord((prevRecord) => ({
                    ...prevRecord,
                    customService: e.target.value
                  }))}
                  isInvalid={!!errors.customService}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.customService}
                </Form.Control.Feedback>
              </Form.Group>
            )}
              <Form.Group controlId="formVet">
                <Form.Label>Veterinarian</Form.Label>
                <Form.Control as="select" value={editRecord.vet} onChange={(e) => {
                  const selectedVetName = e.target.value;
                  const selectedVet = vets.find(vet => vet.name === selectedVetName);
                  setSelectedVet(selectedVet);
                  setEditRecord({ ...editRecord, vet: selectedVetName });
                }} isInvalid={!!errors.vet}>
                  <option value="">Select Vet</option>
                  {vets.map(vet => (
                    <option key={vet.id} value={vet.name}>{vet.name}</option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.vet}
                </Form.Control.Feedback>
              </Form.Group>

              {/* <Form.Group controlId="formVet">
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
              </Form.Group> */}
              <Form.Group controlId="formWeight">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.weight}
                  onChange={(e) => setEditRecord({ ...editRecord, weight: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formHealthStatus">
                <Form.Label>Health Status</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.healthStatus}
                  onChange={(e) => setEditRecord({ ...editRecord, healthStatus: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formDiet">
                <Form.Label>Diet</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.diet}
                  onChange={(e) => setEditRecord({ ...editRecord, diet: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAllergies">
                <Form.Label>Allergies</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.allergies}
                  onChange={(e) => setEditRecord({ ...editRecord, allergies: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formMedications">
                <Form.Label>Medications</Form.Label>
                <Form.Control
                  type="text"
                  value={editRecord.medications}
                  onChange={(e) => setEditRecord({ ...editRecord, medications: e.target.value })}
                />
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
