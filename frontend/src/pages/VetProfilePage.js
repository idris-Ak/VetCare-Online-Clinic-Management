import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../pages/VetProfilePage.css'; // Ensure the path is correct

const VetProfilePage = ({ vet }) => (
  <div className="vet-profile-page">
    <div className="profile-header">
      <h1>— {vet.title.toUpperCase()} —</h1>
      <h2>{vet.name}</h2>
    </div>
    <div className="profile-body">
      <img src={vet.imagePath} alt={`Portrait of ${vet.name}`} className="profile-image" />
      <p>{vet.long_description}</p>
      <div className="button-container">
        <Link to="/all-vets">
          <button className="see-all-members-btn">See All Members</button>
        </Link>
      </div>
    </div>
  </div>
);

export default VetProfilePage;
