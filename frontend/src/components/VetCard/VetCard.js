import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./VetCard.css"; // Ensure this path is correct for your CSS

const VetCard = ({ vet }) => {
  // Now use the vet object directly instead of fetching it again
  return (
    <div className="vet-card">
      <div className="vet-image">
        <img src={`http://localhost:8080${vet.imagePath}`} alt={`${vet.name}, ${vet.title}`} />
      </div>
      <div className="vet-info">
        <h2 className="vet-name">{vet.name}</h2>
        <h3 className="vet-title">{vet.title}</h3>
        <p className="vet-description">{vet.shortDescription}</p>
        <Link to={`/vets/${vet.id}`} className="learn-more-link">Learn More</Link>
      </div>
    </div>
  );
};

export default VetCard;

