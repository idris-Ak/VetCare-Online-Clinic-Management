import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import './prescription.css';

function PrescriptionRefill({ user, addPrescriptionToHistory }) {
  const [petData, setPetData] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [refillRequest, setRefillRequest] = useState({
    medication: '',
    dosage: '',
    preferredPharmacy: '',
    pickupDate: '',
  });
  const [selectedVet, setSelectedVet] = useState(null);
  const [vets, setVets] = useState([]);

  // Fetch pet data
  useEffect(() => {
    if (user) {
      async function getUserPets() {
        const storedUserPets = await getPetInfo();
        setPetData(storedUserPets || []);
      }
      getUserPets();
    }
  }, [user]);

  const getPetInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/pets/user/${user.id}`);
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Error fetching pets:', error);
      return null;
    }
  };

  // Fetch vet data
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

  // Handle prescription submission
  const handleSubmit = async () => {
    if (!selectedPet) {
      alert('Please select a pet for the prescription request.');
      return;
    }

    const requestData = {
      petId: selectedPet,
      service: 'Prescription', // Specify this is a prescription
      medication: refillRequest.medication,
      dosage: refillRequest.dosage,
      preferredPharmacy: refillRequest.preferredPharmacy,
      pickupDate: refillRequest.pickupDate,
      recordDate: dayjs().format('YYYY-MM-DD'), // Record the date of the prescription submission
      vetId: selectedVet ? selectedVet.id : null, // Include the vet ID if available
    };

    try {
      const response = await fetch(`http://localhost:8080/api/medicalRecords/pet/${selectedPet}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newRecord = await response.json();
        alert('Prescription refill request submitted successfully!');

        // Add the new prescription to the history
        addPrescriptionToHistory(newRecord);

        // Reset form fields
        setRefillRequest({
          medication: '',
          dosage: '',
          preferredPharmacy: '',
          pickupDate: '',
        });
      } else {
        alert('Failed to submit the refill request.');
      }
    } catch (error) {
      console.error('Error submitting refill request:', error);
    }
  };

  // Get today's date in 'YYYY-MM-DD' format for the min attribute
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <Container className="prescription-page">
      <h1>Prescription Refill Request</h1>
      <h2>Select a pet and fill out the details below to request a refill.</h2>
      <section className="pet-selection">
        {petData.length > 0 ? (
          petData.map((pet) => (
            <div key={pet.id} className={`pet ${selectedPet === pet.id ? 'selected' : ''}`}>
              <img src={`data:image/jpeg;base64,${pet.profilePicture}`} alt={pet.name} />
              <p className="pet-name">{pet.name}</p>
              <Button
                className={selectedPet === pet.id ? 'selected' : 'select'}
                onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
              >
                {selectedPet === pet.id ? 'Selected' : 'Select'}
              </Button>
            </div>
          ))
        ) : (
          <p>Please add your pets in the profile section.</p>
        )}
      </section>

      <div className="prescription-form">
        <Form>
          <Form.Group controlId="formMedication" className="form-group">
            <Form.Label>Medication</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter medication name"
              className="form-input"
              value={refillRequest.medication}
              onChange={(e) => setRefillRequest({ ...refillRequest, medication: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="formDosage" className="form-group">
            <Form.Label>Dosage</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter dosage"
              className="form-input"
              value={refillRequest.dosage}
              onChange={(e) => setRefillRequest({ ...refillRequest, dosage: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="formPharmacy" className="form-group">
            <Form.Label>Preferred Pharmacy</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter pharmacy name"
              className="form-input"
              value={refillRequest.preferredPharmacy}
              onChange={(e) =>
                setRefillRequest({ ...refillRequest, preferredPharmacy: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formPickupDate" className="form-group">
            <Form.Label>Preferred Pickup Date</Form.Label>
            <Form.Control
              type="date"
              className="form-input"
              min={today} // Restrict date selection to today or later
              value={refillRequest.pickupDate}
              onChange={(e) => setRefillRequest({ ...refillRequest, pickupDate: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="formVet" className="form-group">
            <Form.Label>Select Veterinarian</Form.Label>
            <Form.Control
              as="select"
              value={selectedVet ? selectedVet.name : ''}
              onChange={(e) => {
                const selectedVetName = e.target.value;
                const selectedVet = vets.find((vet) => vet.name === selectedVetName);
                setSelectedVet(selectedVet);
              }}
            >
              <option value="">Select Vet</option>
              {vets.map((vet) => (
                <option key={vet.id} value={vet.name}>{vet.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!selectedPet}
          >
            Submit Request
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default PrescriptionRefill;
