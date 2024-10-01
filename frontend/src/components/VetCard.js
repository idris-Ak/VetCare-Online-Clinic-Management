// src/components/VetCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import "../components/VetCard.css"; // Ensure this path is correct for your CSS

const VetCard = ({ vet }) => (
  <div className="vet-card">
    <div className="vet-image">
      {/* Ensure that the vet.imagePath is correctly set up to handle the path or URL */}
      <img src={vet.image_path} alt={`${vet.name}, ${vet.title}`} />
    </div>
    <div className="vet-info">
      <h2 className="vet-name">{vet.name}</h2>
      <h3 className="vet-title">{vet.title}</h3>
      {/* Correct the property name to match the API response */}
      <p className="vet-description">{vet.short_description}</p>
      {/* Ensure that the routing path set up in your React Router matches vet.detailPath */}
      <Link to={`/vets/${vet.id}`} className="learn-more-link">Learn More</Link>

    </div>
  </div>
);


export default VetCard;
