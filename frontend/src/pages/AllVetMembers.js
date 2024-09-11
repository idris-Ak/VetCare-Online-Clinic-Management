// src/pages/AllVetMembers.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AllVetMembers.css'; // Make sure to create this CSS file for styling

const AllVetMembers = ({ vets }) => (
  <div className="all-vets-page">
    <h1>All Veterinary Members</h1>
    <div className="vets-list">
      {vets.map(vet => (
        <div key={vet.id} className="vet-card">
          <img src={vet.imagePath} alt={`Dr. ${vet.name}`} className="vet-image" />
          <h3>{vet.name}</h3>
          <p>{vet.short_description}</p>
          <Link to={vet.detailPath} className="learn-more-link">Learn More</Link>
        </div>
      ))}
    </div>
  </div>
);

export default AllVetMembers;
