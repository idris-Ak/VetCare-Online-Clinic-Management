import React, { useState } from 'react';
import { Button, Container, Form, Card } from 'react-bootstrap';
import './EducationalResource.css';

// Importing pet images
import pet1Image from 'frontend/src/components/assets/blog3.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet3Image from 'frontend/src/components/assets/about1.jpg';

function EducationalResource() {
  // Mock user data with multiple pets
  const pets = [
    { id: 1, name: 'Dog care', image: pet3Image },
    { id: 2, name: 'Cat care', image: pet2Image },
    { id: 3, name: 'Exotic Pets', image: pet1Image },

  ];

  const [allVideos] = useState([
    { petId: 1, title: 'How to Socialize Your Pet with Other Animals', id: 1 },
    { petId: 1, title: 'Essential Tips for New Dog Owners', id: 2 },
    { petId: 1, title: 'Puppy Training Basics: Housebreaking', id: 3 },
    { petId: 1, title: 'Dealing with Separation Anxiety in Pets', id: 4 },
    { petId: 1, title: 'First Aid for Dogs', id: 5 },
    { petId: 1, title: 'Benefits of Regular Dental Care for Your Dog', id: 6 },
    { petId: 1, title: 'Best Diet for Your Dog', id: 7 },
    { petId: 1, title: 'The Importance of Regular Exercise for Your Dog', id: 8 },

    { petId: 2, title: 'How to Socialize Your Pet with Other Animals', id: 9 },
    { petId: 2, title: 'Essential Tips for New Cat Owners', id: 10 },
    { petId: 2, title: 'Kitten Training Basics: Housebreaking', id: 11 },
    { petId: 2, title: 'Dealing with Separation Anxiety in Pets', id: 12 },
    { petId: 2, title: 'First Aid for Cats', id: 13 },
    { petId: 2, title: 'Benefits of Regular Dental Care for Your Cat', id: 14 },
    { petId: 2, title: 'Best Diet for Your Cat', id: 15 },
    { petId: 2, title: 'The Importance of Regular Exercise for Your Cat', id: 16 },

    { petId: 3, title: 'How to Socialize Your Pet with Other Animals', id: 17 },
    { petId: 3, title: 'Essential Tips for New Pet Owners', id: 18 },
    { petId: 3, title: 'Kitten Training Basics: Housebreaking', id: 19 },
    { petId: 3, title: 'Dealing with Separation Anxiety in Pets', id: 20 },
    { petId: 3, title: 'First Aid for Pets', id: 21 },
    { petId: 3, title: 'Benefits of Regular Dental Care for Your Pet', id: 22 },
    { petId: 3, title: 'Best Diet for Your Pet', id: 23 },
    { petId: 3, title: 'The Importance of Regular Exercise for Your Pet', id: 24 }
  ]);

  const [allArticles] = useState([
    { petId: 1, title: 'Dogs 1', id: 1 },
    { petId: 1, title: 'Dogs 2', id: 2 },
    { petId: 1, title: 'Dogs 3', id: 3 },
    { petId: 1, title: 'Dogs 4', id: 4 },
    { petId: 1, title: 'Dogs 5', id: 5 },
    { petId: 1, title: 'Dogs 6', id: 6 },

    { petId: 2, title: 'Cats 1', id: 7 },
    { petId: 2, title: 'Cats 2', id: 8 },
    { petId: 2, title: 'Cats 3', id: 9 },
    { petId: 2, title: 'Cats 4', id: 10 },
    { petId: 2, title: 'Cats 5', id: 11 },
    { petId: 2, title: 'Cats 6', id: 12 },

    { petId: 3, title: 'Pets 1', id: 13 },
    { petId: 3, title: 'Pets 2', id: 14 },
    { petId: 3, title: 'Pets 3', id: 15 },
    { petId: 3, title: 'Pets 4', id: 16 },
    { petId: 3, title: 'Pets 5', id: 17 },
    { petId: 3, title: 'Pets 6', id: 18 },
  ]);

  // State for selected pet (default is all)
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchArticle, setArticle] = useState('');

  // Handle filtering based on selected pet and search term
  const filteredVideos = allVideos
    .filter(record => 
      (!selectedPet || record.petId === selectedPet)
    );

  const filteredArticles = allArticles
    .filter(record => 
      (!selectedPet || record.petId === selectedPet) && 
      record.title.toLowerCase().includes(searchArticle.toLowerCase())
    );


  return (
    <Container>
      <h1>choose the category</h1>

      {/* Pet Selection UI */}
      <div className="pet-selection">
        <div className="pet-list">
          {pets.map(pet => (
            <div key={pet.id} className="pet">
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <p className="pet-name">{pet.name}</p>
              <Button
                className={selectedPet === pet.id ? 'selected' : 'select'}
                onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
              >
                {selectedPet === pet.id ? 'Selected' : 'Select'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Video of pet category*/}
      <div>
        <h2>Videos</h2>
        {filteredVideos.length > 0 ? (
            <div  className="video-list">
            {filteredVideos.map((record) => (
                <div key={"video-" + record.id} className="video">
                    <Card>
                    <Card.Img variant="top" src={pets.find(pet => pet.id === record.petId).image} />
                        <Card.Body>
                            {/* <Card.Title>Card Title</Card.Title> */}
                            <Card.Text>
                                {record.title}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            ))}
            </div>
        ) : (
            <p>No relevant information was found.</p>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Form.Control
          type="text"
          placeholder="Search records by articles"
          value={searchArticle}
          onChange={(e) => setArticle(e.target.value)}
        />
      </div>

      {/* Articles of pet category*/}
      <div>
        <h2>Articles</h2>
        {filteredArticles.length > 0 ? (
            <div className="article-list">
            {filteredArticles.map((record) => (
                <div key={"article-" + record.id} className="article">
                    {record.title}
                </div>
            ))}
            </div>
        ) : (
            <p>No relevant information was found.</p>
        )}
      </div>
    </Container>
  );
}

export default EducationalResource;
