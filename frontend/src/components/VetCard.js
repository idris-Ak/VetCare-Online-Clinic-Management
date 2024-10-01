// src/components/VetCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import "../components/VetCard.css"
// test 
const VetCard = ({ vet }) => (
  <div className="vet-card">
    <div className="vet-image">
      <img src={vet.imagePath} alt={`${vet.name}, ${vet.title}`}/>
    </div>
    <div className="vet-info">
      <div className="vet-name">{vet.name}</div>
      <div className="vet-title">{vet.title}</div>
      <div className="vet-description">{vet.short_description}</div>
      <Link to={vet.detailPath} className="learn-more-link">Learn More</Link>
    </div>
  </div>
);

export default VetCard;
