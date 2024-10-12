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
    // { id: 3, name: 'Exotic Pets', image: pet1Image },

  ];

  const [allVideos] = useState([
    { petId: 1, title: 'How to Socialize Your Pet with Other Animals', video: '6k-MOFLgGlo?si=fcDndYTzLHinZesO', id: 1 },
    { petId: 1, title: 'Essential Tips for New Dog Owners', video: 'hvBxZBJfoFw?si=g3h0iCZufqHQRT_t', id: 2 },
    { petId: 1, title: 'Puppy Training Basics: Housebreaking', video: 'e5xoq6tbwCM?si=__W5Q5cBi_2czO2I', id: 3 },
    { petId: 1, title: 'Dealing with Separation Anxiety in Pets', video: 'IAjJoGxjp24?si=DAWaHPE97UWs6-KK', id: 4 },
    { petId: 1, title: 'First Aid for Dogs', video: 'KChHsBKMrgU?si=O-bMSgphvJaszXAW', id: 5 },
    { petId: 1, title: 'Benefits of Regular Dental Care for Your Dog', video: 'DohZiEqxVIY?si=-dZEElqxqmLPaCpO', id: 6 },
    { petId: 1, title: 'Best Diet for Your Dog', video: 'd7laQ-a8K3Q?si=QrG-0nqJo8Xm5GEU', id: 7 },
    { petId: 1, title: 'The Importance of Regular Exercise for Your Dog', video: 'OympCK7cVDg?si=i0ARI_v1InyS4DpU', id: 8 },

    { petId: 2, title: 'How to introduce your cat to your other pets', video: 'qXS1sJdyCgE?si=U6ibjybH2cQ7X6v9', id: 9 },
    { petId: 2, title: 'Essential Tips for New Cat Owners',video: 'pp_q1hiKDCE?si=ipf-0rhYy2s1dJ2-', id: 10 },
    { petId: 2, title: 'Kitten Training Basics: Housebreaking', video: '3WGMQur-X9E?si=xDRQ_b1bQUkLInvc',id: 11 },
    { petId: 2, title: 'Dealing with Separation Anxiety in Cats', video: '_XZbTWKXJR8?si=VTZ3S6g_4jFYS9up',id: 12 },
    { petId: 2, title: 'First Aid for Cats', video: 'B3Ky7kU87vw?si=HhfkQMCEHNBNFHvD',id: 13 },
    { petId: 2, title: 'Benefits of Regular Dental Care for Your Cat',video: '2WZZQiAoVOg?si=WhFNGNT8-eaw6OGJ', id: 14 },
    { petId: 2, title: 'Best Diet for Your Cat', video: 'cf0TFDvE7bM?si=AuCU_nlqq7AchfWe',id: 15 },
    { petId: 2, title: 'Fat to fit cat exercise',video: 'SvGx9ny4LHo?si=zDMrJWu24K1vh26G', id: 16 }

    // { petId: 3, title: 'How to Socialize Your Pet with Other Animals', id: 17 },
    // { petId: 3, title: 'Essential Tips for New Pet Owners', id: 18 },
    // { petId: 3, title: 'Kitten Training Basics: Housebreaking', id: 19 },
    // { petId: 3, title: 'Dealing with Separation Anxiety in Pets', id: 20 },
    // { petId: 3, title: 'First Aid for Pets', id: 21 },
    // { petId: 3, title: 'Benefits of Regular Dental Care for Your Pet', id: 22 },
    // { petId: 3, title: 'Best Diet for Your Pet', id: 23 },
    // { petId: 3, title: 'The Importance of Regular Exercise for Your Pet', id: 24 }
  ]);

  const [allArticles] = useState([
    { petId: 1, title: 'Holidays With Dogs: Christmas', url: 'https://www.purina.com/articles/dog/behavior/understanding-dogs/christmas-safety-for-dogs', id: 1 },
    { petId: 1, title: 'Why Do Female Dogs Hump Things?', url: 'https://www.purina.com/articles/dog/behavior/understanding-dogs/why-do-female-dogs-hump', id: 2 },
    { petId: 1, title: 'Running With Your Dog: Getting Started', url: 'https://www.purina.com/articles/dog/behavior/play/running-with-your-dog', id: 3 },
    { petId: 1, title: 'Hiking With Your Dog', url: 'https://www.purina.com/articles/dog/behavior/play/hiking-with-your-dog', id: 4 },
    { petId: 1, title: 'Water Exercise for Dogs: Swimming Safely', url: 'https://www.purina.com/articles/dog/behavior/play/water-exercise-for-dogs', id: 5 },
    { petId: 1, title: 'Why Are Dogs Scared of Fireworks?', url: 'https://www.purina.com/articles/dog/behavior/understanding-dogs/why-are-dogs-scared-of-fireworks', id: 6 },
    { petId: 1, title: 'Why Do Dogs Chew Everything?', url: 'https://www.purina.com/articles/dog/behavior/understanding-dogs/why-do-dogs-chew-everything', id: 7 },
    { petId: 1, title: 'How to Socialize Your Dog', url: 'https://www.purina.com/articles/dog/behavior/training/how-can-i-socialize-my-dog', id: 8 },
    { petId: 1, title: 'How Much Exercise Does a Dog Need?', url: 'https://www.purina.com/articles/dog/behavior/play/how-much-exercise-does-a-dog-need', id: 9 },
    { petId: 1, title: 'How to Stop a Dog from Digging', url: 'https://www.purina.com/articles/dog/behavior/understanding-dogs/how-to-stop-a-dog-digging', id: 10 },
   
    { petId: 2, title: 'Why is My Cat’s Nose Dry?', url: 'https://www.purina.com/articles/cat/health/symptoms/cat-nose-dry', id: 11 },
    { petId: 2, title: 'When Does a Kitten Become a Cat?', url: 'https://www.purina.com/articles/cat/kitten/getting-a-kitten/when-does-a-kitten-become-a-cat', id: 12 },
    { petId: 2, title: 'Cat Exercises – 5 Cat Workouts and Fitness Tips', url: 'https://www.purina.com/articles/cat/behavior/play/5-tips-for-cat-fitness', id: 13 },
    { petId: 2, title: 'Is My Cat’s Stomach Upset?', url: 'https://www.purina.com/articles/cat/health/digestion/upset-stomach', id: 14 },
    { petId: 2, title: 'How to Introduce Cats', url: 'https://www.purina.com/articles/cat/behavior/training/how-to-introduce-cats', id: 15 },
    { petId: 2, title: 'How to Bathe a Cat: Step-By-Step Tips', url: 'https://www.purina.com/articles/cat/health/routine-care/how-to-bathe-a-cat', id: 16 },
    { petId: 2, title: 'Signs & Symptoms of a Stressed Cat', url: 'https://www.purina.com/articles/cat/health/symptoms/is-my-cat-stressed', id: 17 },
    { petId: 2, title: 'Is Organic Cat Food Better for My Cat?', url: 'https://www.purina.com/articles/cat/health/nutrition/is-organic-cat-food-better', id: 18 },
    { petId: 2, title: 'FVRCP Vaccinations', url: 'https://www.purina.com/articles/cat/health', id: 19 },
    { petId: 2, title: 'Cat Vitamins & Supplements: What Do Cats Need?', url: 'https://www.purina.com/articles/cat/health/nutrition/cat-vitamins-supplements', id: 20 }

    // { petId: 3, title: 'Pets 1', id: 13 },
    // { petId: 3, title: 'Pets 2', id: 14 },
    // { petId: 3, title: 'Pets 3', id: 15 },
    // { petId: 3, title: 'Pets 4', id: 16 },
    // { petId: 3, title: 'Pets 5', id: 17 },
    // { petId: 3, title: 'Pets 6', id: 18 },
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
                   <iframe width="350" height="205" src={"https://www.youtube.com/embed/" + record.video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
                    <a target="_blank" rel='noreferrer' href={record.url}>{record.title}</a>
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
