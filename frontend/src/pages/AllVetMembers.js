import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllVetMembers.css'; // Ensure the CSS file is correctly set up

const AllVetMembers = () => {
  // Step 1: Initialize state for storing vet data
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 2: Fetch data from API when component mounts
  useEffect(() => {
    fetch('http://localhost:5001/api/vets') // Adjust the URL if necessary
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.message === 'success') {
          setVets(data.data); // Set the fetched data to state
          setLoading(false);  // Set loading to false after data is fetched
        }
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []); // Empty array ensures this runs only once after the initial render

  // Step 3: Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Step 4: Render the vets list once data is fetched
  return (
    <div className="all-vets-page">
      <h1>All Veterinary Members</h1>
      <div className="vets-list">
        {vets.map(vet => (
          <div key={vet.id} className="vet-card">
            <img src={vet.image_path} alt={`${vet.name}`} className="vet-image" />
            <h3>{vet.name}</h3>
            <p>{vet.short_description}</p>
            <Link to={vet.detail_path} className="learn-more-link">Learn More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVetMembers;
