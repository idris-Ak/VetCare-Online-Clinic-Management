import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Modal, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import profilepic from '../components/assets/profilepic.png';

function MyProfile({ user, setUser, logoutUser }) {
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const navigate = useNavigate();

  // Pet profiles state
  const [pets, setPets] = useState(user.pets || []);

  // State for pet details modal
  const [showPetModal, setShowPetModal] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

  // State for edit profile modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // State for delete account modal
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    // Set profile picture preview if the user has a profile picture
    if (user && user.profilePicture) {
      setProfilePicPreview(user.profilePicture);
    }
  }, [user]);

  // Handle profile picture upload
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Convert image file to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updatedUser = { ...user, profilePicture: base64String };
        setUser(updatedUser);
        setProfilePicPreview(base64String);
        // Update user in localStorage
        updateUserInLocalStorage(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update user in localStorage
  const updateUserInLocalStorage = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // Also update the user in the 'users' array in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex((u) => u.email === updatedUser.email);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  // Handle profile picture click
  const handleProfilePicClick = () => {
    document.getElementById('profilePicInput').click();
  };

  // Handle add/edit pet
  const handlePetSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const pet = {
      id: currentPet ? currentPet.id : Date.now(),
      name: form.elements.petName.value,
      type: form.elements.petType.value,
      breed: form.elements.petBreed.value,
      age: form.elements.petAge.value,
      profilePicture: null,
    };

    // Handle pet profile picture
    const petProfilePicFile = form.elements.petProfilePicture.files[0];
    if (petProfilePicFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        pet.profilePicture = reader.result;

        if (currentPet) {
          // Edit existing pet
          const updatedPets = pets.map((p) => (p.id === pet.id ? pet : p));
          setPets(updatedPets);
          updateUserPets(updatedPets);
        } else {
          // Add new pet
          const updatedPets = [...pets, pet];
          setPets(updatedPets);
          updateUserPets(updatedPets);
        }
        setShowPetModal(false);
        setCurrentPet(null);
      };
      reader.readAsDataURL(petProfilePicFile);
    } else {
      // No new profile picture
      if (currentPet && currentPet.profilePicture) {
        pet.profilePicture = currentPet.profilePicture;
      }

      if (currentPet) {
        // Edit existing pet
        const updatedPets = pets.map((p) => (p.id === pet.id ? pet : p));
        setPets(updatedPets);
        updateUserPets(updatedPets);
      } else {
        // Add new pet
        const updatedPets = [...pets, pet];
        setPets(updatedPets);
        updateUserPets(updatedPets);
      }
      setShowPetModal(false);
      setCurrentPet(null);
    }
  };

  const handleRemoveProfilePic = () => {
  const updatedUser = { ...user, profilePicture: null };
  setUser(updatedUser);
  setProfilePicPreview(null);
  updateUserInLocalStorage(updatedUser);
  };

  const updateUserPets = (updatedPets) => {
    const updatedUser = { ...user, pets: updatedPets };
    setUser(updatedUser);
    // Update user in localStorage
    updateUserInLocalStorage(updatedUser);
  };

  // Handle pet profile picture preview
  const getPetProfilePicPreview = (pet) => {
    if (pet.profilePicture) {
      return pet.profilePicture;
    } else {
      return null;
    }
  };

  // Handle pet edit
  const handlePetEdit = (pet) => {
    setCurrentPet(pet);
    setShowPetModal(true);
  };

  // Handle pet delete
  const handlePetDelete = (petId) => {
    const updatedPets = pets.filter((pet) => pet.id !== petId);
    setPets(updatedPets);
    updateUserPets(updatedPets);
  };

  // Handle profile update
  const handleProfileUpdate = (event) => {
    event.preventDefault();
    const form = event.target;
    const updatedUser = { ...user };
    const newName = form.elements.name.value.trim();
    const newEmail = form.elements.email.value.trim();
    const newPassword = form.elements.password.value;
    const confirmPassword = form.elements.confirmPassword.value;

    // Validate that new password and the new confirm password match
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Check if the email is changed and already exists in the users array
    if (newEmail !== user.email) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const emailExists = users.some((u) => u.email === newEmail);
      if (emailExists) {
        alert("This email is already registered with another account.");
        return;
      }
    }

    updatedUser.name = newName;
    updatedUser.email = newEmail;
    if (newPassword) {
      updatedUser.password = newPassword;
    }

    setUser(updatedUser);
    updateUserInLocalStorage(updatedUser);
    setShowEditProfileModal(false);
    alert("Profile updated successfully.");
  };

  // Handle account deletion
  const handleAccountDeletion = () => {
    // Remove user from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.filter((u) => u.email !== user.email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setShowDeleteAccountModal(false);
    // Call logoutUser function
    logoutUser(); 
    navigate('/signup');
  };

  return (
    <Container style={{ marginTop: '50px', marginBottom: '50px', fontFamily: 'Lato, sans-serif' }}>
      <div
        className="d-flex flex-column align-items-center p-5"
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* User Profile Picture */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <img
            src={profilePicPreview || profilepic}
            alt="Profile"
            className="rounded-circle"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <div
            onClick={handleProfilePicClick}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: '#007bff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <i className="bi bi-plus-circle" style={{ color: '#fff', fontSize: '24px' }}></i>
          </div>
           {profilePicPreview && (
            <div
            onClick={handleRemoveProfilePic}
            style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: 'red',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
        }}
        >
         <i className="bi bi-x" style={{ color: '#fff', fontSize: '20px' }}></i>
            </div>
        )}
          <input
            type="file"
            id="profilePicInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </div>

        {/* User Details */}
        <h2 style={{ fontWeight: '700', color: '#333' }}>{user.name}</h2>
        <p style={{ color: '#555' }}>{user.email}</p>
        <div className="mt-3">
          <Button variant="outline-primary" className="me-2" onClick={() => setShowEditProfileModal(true)}>
            Edit Profile
          </Button>
          <Button variant="outline-danger" onClick={() => setShowDeleteAccountModal(true)}>
            Delete Account
          </Button>
        </div>

        {/* Pet Profiles */}
        <div className="w-100 mt-5">
          <h3 style={{ fontWeight: '700', color: '#333' }}>My Pets</h3>
          <div className="d-flex flex-wrap">
            {/* Pet Cards */}
            {pets.map((pet) => (
              <Card key={pet.id} className="m-2" style={{ width: '18rem' }}>
                <Card.Img
                  variant="top"
                  src={
                    getPetProfilePicPreview(pet) ||
                    'https://via.placeholder.com/286x180.png?text=Pet+Picture'
                  }
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{pet.name}</Card.Title>
                  <Card.Text>
                    Type: {pet.type}
                    <br />
                    Breed: {pet.breed}
                    <br />
                    Age: {pet.age}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handlePetEdit(pet)}
                  >
                    Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handlePetDelete(pet.id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            ))}
            {/* Add Pet */}
            <div
              className="d-flex flex-column align-items-center justify-content-center m-2"
              style={{
                width: '18rem',
                height: '286px',
                border: '2px dashed #ccc',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setCurrentPet(null); // Reset currentPet
                setShowPetModal(true)}}
            >
              <i className="bi bi-plus-circle" style={{ fontSize: '48px', color: '#007bff' }}></i>
              <p style={{ fontSize: '18px', color: '#007bff', marginTop: '10px' }}>Add Pet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pet Modal */}
      <Modal show={showPetModal} onHide={() => { setShowPetModal(false); setCurrentPet(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{currentPet ? 'Edit Pet' : 'Add Pet'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handlePetSubmit}>
            <Form.Group controlId="petName" className="mb-3">
              <Form.Label>Pet Name</Form.Label>
              <Form.Control
                type="text"
                name="petName"
                defaultValue={currentPet ? currentPet.name : ''}
                required
                placeholder="Enter your pet's name"
              />
            </Form.Group>
            <Form.Group controlId="petType" className="mb-3">
              <Form.Label>Pet Type</Form.Label>
              <Form.Control
                type="text"
                name="petType"
                defaultValue={currentPet ? currentPet.type : ''}
                required
                placeholder="Enter your pet's type"
                list="petTypeList"
              />
            <datalist id="petTypeList">
            <option value="Dog" />
            <option value="Cat" />
            <option value="Bird" />
            <option value="Fish" />
            <option value="Reptile" />
            </datalist>
            </Form.Group>
            <Form.Group controlId="petBreed" className="mb-3">
              <Form.Label>Breed</Form.Label>
              <Form.Control
                type="text"
                name="petBreed"
                defaultValue={currentPet ? currentPet.breed : ''}
                list="breedList"
                placeholder="Enter your pet's breed"
              />
            <datalist id="breedList">
            <option value="Labrador Retriever" />
            <option value="German Shepherd" />
            <option value="Golden Retriever" />
            <option value="Bulldog" />
            </datalist>
            </Form.Group>
            <Form.Group controlId="petAge" className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="petAge"
                defaultValue={currentPet ? currentPet.age : ''}
              />
            </Form.Group>
            <Form.Group controlId="petProfilePicture" className="mb-3">
              <Form.Label>Pet Profile Picture</Form.Label>
              <Form.Control type="file" name="petProfilePicture" accept="image/*" />
            </Form.Group>
                  </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => { setShowPetModal(false); setCurrentPet(null); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentPet ? 'Save Changes' : 'Add Pet'}
            </Button>
          </Modal.Footer>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal show={showEditProfileModal} onHide={() => setShowEditProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileUpdate}>
          <Modal.Body>
            <Form.Group controlId="userName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                defaultValue={user.name}
                required
              />
            </Form.Group>
            <Form.Group controlId="userEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={user.email}
                required
              />
            </Form.Group>
            <Form.Group controlId="userPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter new password"
              />
            </Form.Group>
            <Form.Group controlId="userConfirmPassword" className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => setShowEditProfileModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteAccountModal} onHide={() => setShowDeleteAccountModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => setShowDeleteAccountModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleAccountDeletion}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyProfile;
