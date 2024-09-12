import React, { useState } from 'react';
import './Prescription.css';


import pet3Image from 'frontend/src/components/assets/about1.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet1Image from 'frontend/src/components/assets/blog3.jpg';

const Prescription = () => {
  const [petTag, setPetTag] = useState('');
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);

  // Update image sources and assign pet names
  const pets = [
    { id: 1, name: 'Goatie', image: pet1Image },
    { id: 2, name: 'Pookie', image: pet2Image },
    { id: 3, name: 'Dogie', image: pet3Image },
  ];

  const handlePetSelect = (petId) => {
    setSelectedPet(petId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pet Tag:', petTag);
    console.log('Prescription Number:', prescriptionNumber);
    // Handle form submission (e.g., API call)
  };

  return (
    <div className="prescription-page">
      <h1>Request Prescription for Your Pet</h1>
      <div className="pet-selection">
        {pets.map((pet) => (
          <div key={pet.id} className="pet">
            <img src={pet.image} alt={pet.name} />
            <p className="pet-name">{pet.name}</p> {/* Display the pet's name */}
            <button
              className={selectedPet === pet.id ? 'selected' : 'select'}
              onClick={() => handlePetSelect(pet.id)}
            >
              {selectedPet === pet.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>

      <div className="prescription-form">
        <h2>Prescription Refill</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="petTag">Pet Tag:</label>
            <input
              type="text"
              id="petTag"
              className="form-input"
              value={petTag}
              onChange={(e) => setPetTag(e.target.value)}
              placeholder="Enter your pet's tag"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prescriptionNumber">Prescription Number:</label>
            <input
              type="text"
              id="prescriptionNumber"
              className="form-input"
              value={prescriptionNumber}
              onChange={(e) => setPrescriptionNumber(e.target.value)}
              placeholder="Enter prescription number"
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
