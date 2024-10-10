import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../VetProfilePage/VetProfilePage.css"

const VetProfilePage = () => {
  const { id } = useParams(); // Get the vet ID from the URL
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch the specific vet data by ID
    fetch(`http://localhost:8080/api/vets/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch vet data');
        }
        return response.json();
      })
      .then(data => {
        setVet(data); // Assuming the response is directly the vet object
        setLoading(false); // Stop loading
      })
      .catch(error => {
        setError(error.message); // Set the error state
        setLoading(false); // Stop loading
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Handle loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Handle error state
  }

  if (!vet) {
    return <div>No vet data available.</div>; // In case no data is returned
  }

  return (
    <div className="vet-profile-page">
      <div className="profile-header">
        <h1>— {vet.title.toUpperCase()} —</h1>
        <h2>{vet.name}</h2>
      </div>
      <div className="profile-body">
        <img src={`http://localhost:8080${vet.imagePath}`} alt={`Portrait of ${vet.name}`} className="profile-image" />
        <p>{vet.longDescription}</p>
        <div className="button-container">
          <Link to="/all-vets">
            <button className="see-all-members-btn">See All Members</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VetProfilePage;
