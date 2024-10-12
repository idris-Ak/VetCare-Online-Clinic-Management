import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllVetMembers.css'; // Ensure the CSS file is correctly set up

const AllVetMembers = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/vets') // Updated to correct API URL
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setVets(data); // Assuming the API directly returns the array of vets
        setLoading(false);  // Set loading to false after data is fetched
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []); // Empty array ensures this runs only once after the initial render

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="all-vets-page">
      <h1>All Veterinary Members</h1>
      <div className="vets-list">
        {vets.map(vet => (
          <div key={vet.id} className="vet-card">
            <img src={`http://localhost:8080${vet.imagePath}`} alt={`Portrait of ${vet.name}`} className="vet-image" />
            <h3>{vet.name}</h3>
            <p>{vet.shortDescription}</p>
            <Link to={`/vets/${vet.id}`} className="learn-more-link">Learn More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVetMembers;
