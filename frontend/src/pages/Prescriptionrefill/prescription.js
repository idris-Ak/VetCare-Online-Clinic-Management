import React, { useState } from 'react';
import './prescription.css';

import pet3Image from 'frontend/src/components/assets/about1.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet1Image from 'frontend/src/components/assets/blog3.jpg';

const Prescription = () => {
    const [selectedPet, setSelectedPet] = useState(null);
    const [prescriptionDetail, setPrescriptionDetail] = useState('');
    const [preferredPharmacy, setPreferredPharmacy] = useState('');
    const [preferredPickupDate, setPreferredPickupDate] = useState('');
    const [preferredPickupTime, setPreferredPickupTime] = useState('');
    const [showModal, setShowModal] = useState(false);  // State to control the modal
  
    // Pet images and names
    const pets = [
      { id: 1, name: 'Goatie', image: pet1Image },
      { id: 2, name: 'Pookie', image: pet2Image },
      { id: 3, name: 'Dogie', image: pet3Image },
    ]; // branch test
  
    const handlePetSelect = (petId) => {
      const selectedPet = pets.find(pet => pet.id === petId); // Find the selected pet
      setSelectedPet(selectedPet); // Update the selected pet
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Show modal on submit
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false); // Close the modal
    };
  
    return (
      <div className="prescription-page">
        <h1>Request Prescription for Your Pet</h1>
        <div className="pet-selection">
          {pets.map((pet) => (
            <div key={pet.id} className="pet">
              <img src={pet.image} alt={pet.name} />
              <p className="pet-name">{pet.name}</p>
              <button
                className={selectedPet?.id === pet.id ? 'selected' : 'select'}
                onClick={() => handlePetSelect(pet.id)}
              >
                {selectedPet?.id === pet.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
  
        <div className="prescription-form">
          <h2>
            Prescription Request {selectedPet ? `for ${selectedPet.name}` : ''}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="prescriptionDetail">Prescription Detail:</label>
              <select
  id="prescriptionDetail"
  className="form-input"
  value={prescriptionDetail}
  onChange={(e) => setPrescriptionDetail(e.target.value)}
  required
>
  <option value="">Select a prescription</option>
  <option value="Antibiotics">Antibiotics</option>
  <option value="Painkillers">Painkillers</option>
  <option value="Vitamins">Vitamins</option>
</select>

            </div>
  
            <div className="form-group">
              <label htmlFor="preferredPharmacy">Preferred Pharmacy:</label>
              <select
                id="preferredPharmacy"
                className="form-input"
                value={preferredPharmacy}
                onChange={(e) => setPreferredPharmacy(e.target.value)}
                required
              >
                <option value="">Select a pharmacy</option>
                <option value="Pharmacy 1">Pharmacy 1</option>
                <option value="Pharmacy 2">Pharmacy 2</option>
                <option value="Pharmacy 3">Pharmacy 3</option>
                <option value="Pharmacy 4">Pharmacy 4</option>
                <option value="Pharmacy 5">Pharmacy 5</option>
              </select>
            </div>
  
            <div className="form-group">
              <label htmlFor="preferredPickupDate">Preferred Pickup Date:</label>
              <input
                type="date"
                id="preferredPickupDate"
                className="form-input"
                value={preferredPickupDate}
                onChange={(e) => setPreferredPickupDate(e.target.value)}
                required
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="preferredPickupTime">Preferred Pickup Time:</label>
              <input
                type="time"
                id="preferredPickupTime"
                className="form-input"
                value={preferredPickupTime}
                onChange={(e) => setPreferredPickupTime(e.target.value)}
                required
              />
            </div>
  
            <button type="submit" className="submit-btn">Submit Request</button>
          </form>
        </div>
  
        {/* Modal for showing summary */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Thank you for your submission!</h3>
              <p>Here is a summary of your request:</p>
              <ul>
                <li><strong>Pet:</strong> {selectedPet?.name || 'N/A'}</li>
                <li><strong>Prescription Detail:</strong> {prescriptionDetail}</li>
                <li><strong>Preferred Pharmacy:</strong> {preferredPharmacy}</li>
                <li><strong>Preferred Pickup Date:</strong> {preferredPickupDate}</li>
                <li><strong>Preferred Pickup Time:</strong> {preferredPickupTime}</li>
              </ul>
              <button onClick={handleCloseModal} className="close-btn">Close</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Prescription;