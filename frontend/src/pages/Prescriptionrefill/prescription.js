import React, { useState } from 'react';
import './Prescription.css';

const Prescription = () => {
  const [petTag, setPetTag] = useState('');
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);

  const pets = [
    { id: 1, name: 'Pet 1', image: '/path/to/dog1.jpg' },
    { id: 2, name: 'Pet 2', image: '/path/to/dog2.jpg' },
    { id: 3, name: 'Pet 3', image: '/path/to/dog3.jpg' },
  ];

  const handlePetSelect = (petId) => {
    setSelectedPet(petId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pet Tag:', petTag);
    console.log('Prescription Number:', prescriptionNumber);
    // Here, you can handle form submission (e.g., API call)
  };

  return (
    <div className="prescription-page">
      <h1>Select your pet</h1>
      <div className="pet-selection">
        {pets.map((pet) => (
          <div key={pet.id} className="pet">
            <img src={pet.image} alt={pet.name} />
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
          <label htmlFor="petTag">Add your Pet Tag:</label>
          <input
            type="text"
            id="petTag"
            value={petTag}
            onChange={(e) => setPetTag(e.target.value)}
            required
          />

          <label htmlFor="prescriptionNumber">Add Prescription Number:</label>
          <input
            type="text"
            id="prescriptionNumber"
            value={prescriptionNumber}
            onChange={(e) => setPrescriptionNumber(e.target.value)}
            required
          />

          <button type="submit" className="submit-btn">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default Prescription;
