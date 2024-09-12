import React, { useState } from 'react';
import './Prescription.css';

import pet3Image from 'frontend/src/components/assets/about1.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet1Image from 'frontend/src/components/assets/blog3.jpg';

const Prescription = () => {
    const [selectedPet, setSelectedPet] = useState(null);
    const [prescriptionDetail, setPrescriptionDetail] = useState('');
    const [preferredPharmacy, setPreferredPharmacy] = useState('');
    const [preferredPickupDate, setPreferredPickupDate] = useState('');
    const [preferredPickupTime, setPreferredPickupTime] = useState('');
  
    const pets = [
      { id: 1, name: 'Goatie', image: pet1Image },
      { id: 2, name: 'Pookie', image: pet2Image },
      { id: 3, name: 'Dogie', image: pet3Image },
    ];
  
    const handlePetSelect = (petId) => {
      const selectedPet = pets.find(pet => pet.id === petId); 
      setSelectedPet(selectedPet); 
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Prescription Detail:', prescriptionDetail);
      console.log('Preferred Pharmacy:', preferredPharmacy);
      console.log('Preferred Pickup Date:', preferredPickupDate);
      console.log('Preferred Pickup Time:', preferredPickupTime);
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
              <textarea
                id="prescriptionDetail"
                className="form-input"
                value={prescriptionDetail}
                onChange={(e) => setPrescriptionDetail(e.target.value)}
                placeholder="Enter details about the prescription"
                rows="4"
                required
              />
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
      </div>
    );
  };
  
  export default Prescription;