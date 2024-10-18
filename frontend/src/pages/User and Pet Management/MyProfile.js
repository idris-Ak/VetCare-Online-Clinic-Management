import React, { useCallback, useState, useEffect } from 'react';
import { Button, Form, Container, Modal, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import profilepic from '../../components/assets/profilepic.png';
import defaultPetProfilePic from '../../components/assets/defaultPetProfilePic.png';

function MyProfile({ user, setUser, logoutUser }) {
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isProfilePicLoading, setIsProfilePicLoading] = useState(false);
  const navigate = useNavigate();

  // Pet profiles state
  const [pets, setPets] = useState(user?.pets || []);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each pet


  // State for pet details modal
  const [showPetModal, setShowPetModal] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const[showAlert, setAlert] = useState(false);
  //State for the alert messages 
  const[alertContent, setAlertContent] = useState('');
  const[alertContentDanger, setAlertContentDanger] = useState('');
  const[showAlertDanger, setAlertDanger] = useState(false);
  const [showDeletePetModal, setShowDeletePetModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const [isSavingPet, setIsSavingPet] = useState(false);

  // State for edit profile modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // State for delete account modal
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);


// Fetch pets from the backend for the current user
const fetchPets = useCallback(async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/pets/user/${user.id}`);
    if (!response.ok) {
      throw new Error(`Error fetching pets: ${response.statusText}`);
    }
    const data = await response.json();
    setPets(data);
  } catch (error) {
    console.error('Error fetching pets:', error);
    // Display an error alert to the user
    setAlertContentDanger('Failed to fetch pets, please try again later.');
    setAlertDanger(true);
    setTimeout(() => setAlertDanger(false), 3000);
  }
}, [user]);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
    setTimeout(() => setIsLoading(false), 500);
  }, [user, fetchPets]);

  useEffect(() => {
    // Set profile picture preview if the user has a profile picture
    if (user && user.profilePicture) {
      setProfilePicPreview(`data:image/jpeg;base64,${user.profilePicture}`);
    }
  }, [user]);

  // Handle profile picture upload
  const handleProfilePicChange = async(event) => {
  const file = event.target.files[0];
  
  // Start the loading state
  setIsProfilePicLoading(true);

  // Check file size (max 10MB)
  const maxSizeInMB = 10;
  if (file && file.size > maxSizeInMB * 1024 * 1024) {
    setAlertContentDanger('Image size exceeds the allowable limit of 10MB. Please upload a smaller file.');
    setAlertDanger(true);
    setTimeout(() => setAlertDanger(false), 5000);
    setIsProfilePicLoading(false); // Reset loading state
    return; // Prevent further execution if size exceeds limit
  }

  // Check file type for allowed image formats
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (file && allowedTypes.includes(file.type)) {
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await fetch(`http://localhost:8080/api/users/${user.id}/profilePicture`, {
                method: 'PUT',
                body: formData,
            });

        if (response.status === 413) {
          // Handle "Payload Too Large" error
          setAlertContentDanger('Image size exceeds the allowable limit of 10MB. Please upload a smaller file.');
          setAlertDanger(true);
          return; // Exit after displaying the error message
        }
        if (!response.ok) {
          throw new Error(`Error uploading profile picture: ${response.statusText}`);
        }
          const updatedUser = await response.json();
          setUser(updatedUser);
          // Update profilePicPreview using the updated user data from the server
          if (updatedUser.profilePicture) {
            setProfilePicPreview(`data:image/jpeg;base64,${updatedUser.profilePicture}`);
          } else {
            setProfilePicPreview(null);
          }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            setAlertContentDanger(error.message || 'Failed to upload profile picture. Please try again later.');
            setAlertDanger(true);
            setTimeout(() => setAlertDanger(false), 5000);
        }
        finally {
          // Reset the loading state
          setIsProfilePicLoading(false);
        }
    }
    else {
    setAlertContentDanger('Please upload a valid image file (jpg or png).');
    setAlertDanger(true);
    setTimeout(() => setAlertDanger(false), 5000);
    setIsProfilePicLoading(false); // Reset loading state
  }
};

const handleRemoveProfilePic = async () => {
   // Start the loading state
  setIsProfilePicLoading(true);

  try {
    const response = await fetch(`http://localhost:8080/api/users/${user.id}/profilePicture`, {
      method: 'DELETE', // Use DELETE method for removing the profile picture
    });

    if (!response.ok) {
      throw new Error(`Error removing profile picture: ${response.statusText}`);
    }

    // Update the user object to reflect that the profile picture is removed
    const updatedUser = { ...user, profilePicture: null };
    setUser(updatedUser); // Update React state with the new user object
    setProfilePicPreview(null); // Set the profile picture preview to default placeholder
  } catch (error) {
    console.error('Error removing profile picture:', error);
    setAlertContentDanger('Failed to remove profile picture. Please try again later.');
    setAlertDanger(true);
    setTimeout(() => setAlertDanger(false), 5000);
  }
  finally {
    // Reset the loading state
    setIsProfilePicLoading(false);
  }
};

  // Handle profile picture click
  const handleProfilePicClick = () => {
    document.getElementById('profilePicInput').click();
  };

  // Handle profile update
  const handleProfileUpdate = async(event) => {
    event.preventDefault();
    const form = event.target;
    const newName = form.elements.name.value.trim();
    const newEmail = form.elements.email.value.trim();
    const currentPassword = form.elements.currentPassword.value;
    const newPassword = form.elements.password.value;
    const confirmPassword = form.elements.confirmPassword.value;

    // Create a FormData object to handle both text and file data
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('email', newEmail);
    if (newPassword) formData.append('password', newPassword);

     // Validate current password
    if (currentPassword && currentPassword !== user.password) {
        setAlertContentDanger("Current Password is incorrect.");
        setAlertDanger(true);
        setTimeout(() => {
        setAlertDanger(false);
        }, 2500);
        return;
    }

    if (currentPassword && (!newPassword || !confirmPassword)) {
        setAlertContentDanger("Please enter and confirm your new password.");
        setAlertDanger(true);
        setTimeout(() => {
        setAlertDanger(false);
        }, 2500);
        return;
    }

    //Handle case where new password and confirm new password is entered but current password is not yet provided
    if (newPassword && confirmPassword && (!currentPassword)) {
        setAlertContentDanger("Please enter your current password.");
        setAlertDanger(true);
        setTimeout(() => {
        setAlertDanger(false);
        }, 2500);
        return;
    }

    //Handle case where confirm new password is entered but new password or current password is not yet provided
    if (confirmPassword && (!newPassword || !currentPassword)) {
        setAlertContentDanger("Please enter your current and new password.");
        setAlertDanger(true);
        setTimeout(() => {
        setAlertDanger(false);
        }, 2500);
        return;
    }

  
    //Handle case where new password is entered but confirm new password or current password is not yet provided
    if (newPassword && (!confirmPassword|| !currentPassword)) {
        setAlertContentDanger("Please enter your current password and confirm your new password.");
        setAlertDanger(true);
        setTimeout(() => {
        setAlertDanger(false);
        }, 2500);
        return;
    }

    // Validate that new password and the new confirm password match
    if (newPassword && newPassword !== confirmPassword) {
        setAlertContentDanger("Passwords do not match.");
        setAlertDanger(true);
        setTimeout(() => {
        setAlertDanger(false);
        }, 2500);
        return;
    }

    //The following function was given by OpenAI (2024) ChatGPT [Large language model], accessed 3 September 2024. (*Link could not be generated successfully*)
    const isPasswordStrong = (newPassword) => {
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*()_+\\-={}[\\]\\\\|;:'\",<.>/?~`])(?=.{8,})");
        return re.test(newPassword);
    };

     //If password is not strong, output the error message
    if (currentPassword && newPassword && confirmPassword && !isPasswordStrong(newPassword)) {
     setAlertContentDanger('Your password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.');
     setAlertDanger(true);
        setTimeout(() => {
        setAlertDanger(false);
     }, 2500);
     return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        body: formData,  // Use FormData to send the request
      });

     if (!response.ok) {
      if (response.status === 409) {
        setAlertContentDanger("The email entered is already registered.");
        setAlertDanger(true);
        setTimeout(() => setAlert(false), 2500);
      } else {
        throw new Error(`Error updating profile: ${response.statusText}`);
      }
    }
    else {
        const savedUser = await response.json();
        setUser(savedUser);
        setShowEditProfileModal(false);
        setAlertContent('Profile Successfully Updated!');
        setAlert(true);
        setTimeout(() => setAlert(false), 2500);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        // Show an error alert to the user
        setAlertContentDanger('Profile update failed, please try again later.');
        setAlertDanger(true);
        setTimeout(() => setAlertDanger(false), 3000);
  } 
};

  // Handle account deletion
  const handleAccountDeletion = async() => {
   try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'DELETE',
      });

    if (!response.ok) {
      throw new Error(`Error deleting account: ${response.statusText}`);
    }

    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setAlertContent('Profile Successfully Deleted!');
    setShowDeleteAccountModal(false);
    setAlert(true);
      setTimeout(() => {
        //This function will logout the user after the profile is successfully deleted
        logoutUser();
        setAlert(false);
        //Navigate back to login page after successful deletion
        navigate('/');
      }, 2500);
    }
    catch (error) {
    console.error('Error deleting account:', error);
    // Show an error alert to the user
    setAlertContentDanger('Failed to delete account, please try again later.');
    setAlertDanger(true);
    setTimeout(() => setAlertDanger(false), 3000);
    }
  };


  // Handle add/edit pet
  const handlePetSubmit = async(event) => {
    event.preventDefault();
    setIsSavingPet(true);  // Set saving state before the operation
    const form = event.target;
    const petData = new FormData();

    petData.append('name', form.elements.petName.value);
    petData.append('type', form.elements.petType.value);
    // Only append breed and age if they have values (making them optional)
    const breed = form.elements.petBreed.value.trim();
    const age = form.elements.petAge.value.trim();
  
    if (breed) {
      petData.append('breed', breed);
    }
    if (age) {
      petData.append('age', age);
    }

    // Handle pet profile picture
    const petProfilePicFile = form.elements.petProfilePicture.files[0];
    if (petProfilePicFile) {
        petData.append('profilePicture', petProfilePicFile);
    }

    try {
      let response;
        if (currentPet) {
            // If currentPet is defined, we are editing an existing pet
            response = await fetch(`http://localhost:8080/api/pets/${currentPet.id}?userId=${user.id}`, {
                method: 'PUT',
                body: petData,
            });
        } else {
            // If currentPet is not defined, we are adding a new pet
            response = await fetch(`http://localhost:8080/api/pets/user/${user.id}`, {
                method: 'POST',
                body: petData,
            });
        }

    // Check if response is not OK and handle it
    if (!response.ok) {
      const errorData = await response.text();  // Read the response as text
      throw new Error(`Error saving pet: ${errorData || response.statusText}`);
    }

    const updatedPet = await response.json();
    setPets((prevPets) =>
    currentPet ? prevPets.map((p) => (p.id === updatedPet.id ? updatedPet : p)) : [...prevPets, updatedPet]
    );
    setShowPetModal(false);
    setCurrentPet(null);
    } catch (error) {
    console.error('Error saving pet:', error);
    setAlertContentDanger(error.message || 'Failed to save pet, please try again later.');
    setAlertDanger(true);
    setTimeout(() => setAlertDanger(false), 3000);
    }
    finally {
        setIsSavingPet(false);
    }
};

// Handle pet profile picture upload
const handlePetProfilePicChange = async (event, petId) => {
  const file = event.target.files[0];
  if (!file) return;

  // Track loading state for this specific pet
  setLoadingStates((prevStates) => ({ ...prevStates, [petId]: true }));

  // Check file size (max 10MB)
  const maxSizeInMB = 10;
  if (file && file.size > maxSizeInMB * 1024 * 1024) {
    setAlertContentDanger('Image size exceeds the allowable limit of 10MB. Please upload a smaller file.');
    setAlertDanger(true);
    setTimeout(() => setAlertDanger(false), 5000);
    setLoadingStates((prevStates) => ({ ...prevStates, [petId]: false }));
    return; // Prevent further execution if size exceeds limit
  }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
        const response = await fetch(`http://localhost:8080/api/pets/${petId}/profilePicture?userId=${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error uploading pet profile picture: ${response.statusText}`);
      }

      const updatedPet = await response.json();

      // Update the pets array in the state with the new profile picture
      setPets((prevPets) =>
        prevPets.map((pet) => (pet.id === updatedPet.id ? { ...pet, profilePicture: updatedPet.profilePicture } : pet))
      );
    } catch (error) {
      console.error('Error uploading pet profile picture:', error.message);
      setAlertContentDanger('Failed to upload pet profile picture. Please try again later.');
      setAlertDanger(true);
      setTimeout(() => setAlertDanger(false), 5000);
    }
    finally {
      setLoadingStates((prevStates) => ({ ...prevStates, [petId]: false }));
    }
};

const handleRemovePetProfilePic = async (petId) => {
  setLoadingStates((prevStates) => ({ ...prevStates, [petId]: true }));
  try {
    // Send a PUT request to the backend to update the pet and remove the profile picture
    const response = await fetch(`http://localhost:8080/api/pets/${petId}/profilePicture?userId=${user.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error removing pet profile picture: ${response.statusText}`);
    }

    // Update the pet state in the frontend
     setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === petId ? { ...pet, profilePicture: null } : pet
      )
    );
  } catch (error) {
      console.error('Error removing pet profile picture:', error);
      setAlertContentDanger('Failed to remove pet profile picture. Please try again later.');
      setAlertDanger(true);
      setTimeout(() => setAlertDanger(false), 5000);  }
   finally {
    setLoadingStates((prevStates) => ({ ...prevStates, [petId]: false }));
  }
};

// Helper function to display the profile picture with a spinner
const getPetProfilePicPreview = (pet) => {
    if (loadingStates[pet.id]) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '220px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
      const src = pet.profilePicture
      ? `data:image/png;base64,${pet.profilePicture}`
      : defaultPetProfilePic; // Use the default pet profile picture

    return (
    <Card.Img
      variant="top"
      src={src}
      style={{ height: '220px', objectFit: 'cover', borderBottom: '5px solid #007bff'  }}
    />    
  );
  };


  // Handle pet edit
  const handlePetEdit = (pet) => {
    setCurrentPet(pet);
    setShowPetModal(true);
  };


  const confirmPetDelete = (pet) => {
    setPetToDelete(pet); 
    setShowDeletePetModal(true);  // Show delete confirmation modal
  };


  // Handle pet delete
 const handlePetDelete = async (petId) => {
  if (!petId) {
    console.error('Pet ID is undefined!');
    return;
  }
    try {
      const response = await fetch(`http://localhost:8080/api/pets/${petToDelete}?userId=${user.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPets(pets.filter((pet) => pet.id !== petToDelete));
        setShowDeletePetModal(false); // Close modal on success
      } else {
        console.error('Error deleting pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  // Loading spinner displayed until the user data is loaded
  if (isLoading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container style={{ marginTop: '50px', marginBottom: '50px', fontFamily: 'Lato, sans-serif' }}>
      {isSavingPet && <Spinner animation="border" role="status"><span className="visually-hidden">Saving...</span></Spinner>}
        {showAlert && alertContent &&(<Alert variant="success">{alertContent}</Alert>)}
        {showAlertDanger && alertContentDanger && <Alert variant="danger">{alertContentDanger}</Alert>}
      <div
        className="d-flex flex-column align-items-center p-5"
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        {/* User Profile Picture */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
        {isProfilePicLoading ? (
        // Render spinner in place of the profile picture
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
          width: '150px',
          height: '150px',
          backgroundColor: '#f0f0f0',
          borderRadius: '50%',
        }}
        >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
          </div>
          ) : (
          <img
            src={profilePicPreview || profilepic}
            alt="Profile"
            className="rounded-circle"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
           )}
        {/* Overlay Spinner when loading */}
        {!isProfilePicLoading && (
           <>
          <div
            onClick={handleProfilePicClick}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: '#007bff',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <i className="bi bi-pencil-fill" style={{ color: '#fff', fontSize: '16px' }}></i>
          </div>
           {user.profilePicture && !isProfilePicLoading && (
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
        </>
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
        <h2 style={{ fontWeight: '700', color: '#333' }}>
        {user.role === 'Vet' ? (
        <span>
          {user.name}
        </span>
        ) : user.name}
        </h2>
        <p style={{ color: '#555' }}>{user.email}</p>
        <div className="mt-3">
          <Button variant="outline-primary" className="me-2" onClick={() => setShowEditProfileModal(true)}>
            Edit Profile
          </Button>
          <Button variant="outline-danger" onClick={() => setShowDeleteAccountModal(true)}>
            Delete Account
          </Button>
        </div>

      {/* View Transaction History Button */}
      {user.role === 'Pet Owner' && (
        <Button
          variant="outline-primary"
          onClick={() => navigate('/transaction-history')}
          className="mb-3"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
          }}
        >
          View Transaction History
        </Button>
      )}

      {/* Edit Profile Modal */}
      <Modal show={showEditProfileModal} onHide={() => setShowEditProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileUpdate}>
          <Modal.Body>
            {showAlertDanger && alertContentDanger && <Alert variant="danger">{alertContentDanger}</Alert>}
            <Form.Group controlId="userName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                maxLength={50}
                defaultValue={user.name}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Only allow letters and spaces
                }}
                required
              />
            </Form.Group>
            <Form.Group controlId="userEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                maxLength={100}
                defaultValue={user.email}
                required
              />
            </Form.Group>
               <Form.Group controlId="currentPassword" className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
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

      {/* Pet Modal */}
      <Modal show={showPetModal} onHide={() => { setShowPetModal(false); setCurrentPet(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{currentPet ? 'Edit Pet' : 'Add Pet'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePetSubmit}>
            <Modal.Body>
              {showAlertDanger && alertContentDanger && <Alert variant="danger">{alertContentDanger}</Alert>}
            <Form.Group controlId="petName" className="mb-3">
              <Form.Label>Pet Name</Form.Label>
              <Form.Control
                type="text"
                name="petName"
                maxLength={50}
                defaultValue={currentPet ? currentPet.name : ''}
                required
                placeholder="Enter your pet's name"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Only allow letters and spaces
                }}
              />
            </Form.Group>
            <Form.Group controlId="petType" className="mb-3">
              <Form.Label>Pet Type</Form.Label>
              <Form.Control
                type="text"
                name="petType"
                maxLength={30} 
                defaultValue={currentPet ? currentPet.type : ''}
                required
                placeholder="Enter your pet's type"
                list="petTypeList"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Only allow letters and spaces
                }}
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
                maxLength={40}
                defaultValue={currentPet ? currentPet.breed : ''}
                placeholder="Enter your pet's breed (optional)"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Only allow letters and spaces
                }}
              />
            </Form.Group>
            <Form.Group controlId="petAge" className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="petAge"
                defaultValue={currentPet ? currentPet.age : ''}
                max='40'
                min='0'
                placeholder="Enter your pet's age (optional)"
              />
            </Form.Group>
            <Form.Group controlId="petProfilePicture" className="mb-3">
              <Form.Label>Pet Profile Picture</Form.Label>
              <Form.Control type="file" name="petProfilePicture" accept="image/*" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => { setShowPetModal(false); setCurrentPet(null); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentPet ? 'Save Changes' : 'Add Pet'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

        {/* Pet Profiles */}
        {user.role === 'Pet Owner' && (
        <div className="w-100 mt-5">
          <h3 style={{ fontWeight: '700', color: '#333' }}>My Pets</h3>
          <Row>
            {/* Pet Cards */}
            {pets.map((pet) => (
              <Col md={4} sm={6} xs={12} key={pet.id} className="d-flex">
                  <Card className="m-2 flex-fill" style={{  width: '100%', borderRadius: '15px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)', backgroundColor: '#f8f9fa', overflow: 'hidden', 
                  transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.025)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <div style={{ position: 'relative' }}>
                        {getPetProfilePicPreview(pet)}
                    {!loadingStates[pet.id] && (
                      <div
                        onClick={() => document.getElementById(`petPicInput-${pet.id}`).click()}
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          backgroundColor: '#007bff',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <i className="bi bi-pencil-fill" style={{ color: '#fff', fontSize: '16px' }}></i>
                      </div>
                    )}
                      {pet.profilePicture && pet.profilePicture !== defaultPetProfilePic && !loadingStates[pet.id] && (
                        <div
                          onClick={() => handleRemovePetProfilePic(pet.id)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <i className="bi bi-x" style={{ color: '#fff', fontSize: '16px' }}></i>
                        </div>
                      )}
                      <input
                        type="file"
                        id={`petPicInput-${pet.id}`}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={(e) => handlePetProfilePicChange(e, pet.id)}
                      />
                    </div>
                    <Card.Body style={{ padding: '20px', textAlign: 'center' }}>
                      <Card.Title style={{ fontWeight: '700', marginBottom: '10px', fontSize: '22px', lineHeight: '1.6', color: '#333' }}>{pet.name}</Card.Title>
                      <Card.Text style={{ color: '#555', marginBottom: '15px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '10px' }}>
                         <strong style={{ marginRight: '10px', fontWeight: 'bold', color: '#007bff', display: 'center' }}>Type:</strong> 
                         <span>{pet.type}</span>
                        </div>
                         <div style={{ marginBottom: '10px' }}>
                         <strong style={{ marginRight: '10px', fontWeight: 'bold', color: '#007bff', display: 'center'}}>Breed:</strong> 
                         <span>{pet.breed || 'N/A'}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                         <strong style={{ marginRight: '10px', fontWeight: 'bold', color: '#007bff', display: 'center' }}>Age:</strong> 
                         <span>{pet.age || 'N/A'}</span>
                        </div>        
                       </Card.Text>
                      <div className="d-flex justify-content-center" style={{ gap: '10px' }}>
                        <Button
                          variant="outline-primary"
                          onClick={() => handlePetEdit(pet)}
                          style={{ flex: '1', padding: '10px 15px', borderRadius: '10px', fontWeight: 'bold' }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => confirmPetDelete(pet.id)}
                          style={{ flex: '1', padding: '10px 15px', borderRadius: '10px', fontWeight: 'bold' }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
               {/* Add Pet */}
              <Col md={4} sm={6} xs={12} className="d-flex">
                <div
                  className="d-flex flex-column align-items-center justify-content-center m-2 flex-fill"
                  style={{
                    border: '2px dashed #ccc',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    minHeight: '400px',
                  }}
                  onClick={() => {
                    setCurrentPet(null); // Reset currentPet
                    setShowPetModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle" style={{ fontSize: '48px', color: '#007bff' }}></i>
                  <p style={{ fontSize: '18px', color: '#007bff', marginTop: '10px' }}>Add Pet</p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>

        {/* Pet Deletion Confirmation Modal */}
        <Modal show={showDeletePetModal} onHide={() => setShowDeletePetModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Pet</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        Are you sure you want to delete this pet? This action cannot be undone.
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={() => setShowDeletePetModal(false)}>
            Cancel
        </Button>
        <Button variant="danger" onClick={handlePetDelete}>
            Delete
        </Button>
      </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default MyProfile;
