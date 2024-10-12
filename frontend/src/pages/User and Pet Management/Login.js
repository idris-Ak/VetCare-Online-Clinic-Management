import React, {useState} from 'react';
import { Button, Form, Alert, Container, ToggleButtonGroup, ToggleButton, Spinner } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from "react-router-dom";

function Login({loginUser}) {
  const [userDetails, setUserDetails] = useState({ email: '', password: '', role: 'Pet Owner' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails, [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails, role: role
    }));
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    setShowErrorMessage(false);

    try {
    // Try getting a response from the api
    const response = await fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the user details to the backend to verify they are correct
      body: JSON.stringify({
        email: userDetails.email.trim(),
        password: userDetails.password,
        role: userDetails.role,
      }),
    });

    // Set the appropriate error message if the response status is 401
    if (response.status === 401) {
      setErrorMessage('Invalid email, password, or role selection.');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      setUserDetails(prevDetails => ({ ...prevDetails, password: '' }));
    } else if (response.ok) {
      // Otherwise, log the user in and navigate them to the last page they navigated to
      const user = await response.json();
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        loginUser(user);
        // Redirect based on user role
        if (user.role === "Vet") {
          navigate('/VetDashboard');  // Redirect to vet dashboard
        } else {
          const redirectTo = location.state?.from || '/';
          navigate(redirectTo);
        }
      }, 3000);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
  finally {
    setIsLoading(false);
  }
}

  // Loading spinner displayed until the user data is loaded
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
  <Container className="d-flex justify-content-center align-items-center" style={{ marginTop: '25px', marginBottom: '25px', minHeight: '75vh', fontFamily: 'Lato, sans-serif'}}>
      <div className="w-100 p5" style={{ maxWidth: '600px', background: '#ffffff', borderRadius: '20px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1'}}>
          {showErrorMessage && errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {showSuccessAlert && <Alert variant="success">Login Successful!</Alert>}
      <Form onSubmit={handleSubmit} className="p-5">
          <h2 className="mb-4 text-center" style={{ fontWeight: '700', color: '#333', fontFamily: 'Lato, sans-serif', fontSize: '40px'}}>Login</h2>
          <div className="d-flex justify-content-center mb-4">
            <ToggleButtonGroup 
              type="radio" 
              name="role" 
              value={userDetails.role} 
              onChange={handleRoleChange}
              className="w-100"
            >
              <ToggleButton 
                id="tbg-radio-1"
                value="Pet Owner" 
                variant={userDetails.role === 'Pet Owner' ? 'primary' : 'outline-primary'}
                className="w-50"
              >
                Pet Owner
              </ToggleButton>
              <ToggleButton
                id="tbg-radio-2" 
                value="Vet" 
                variant={userDetails.role === 'Vet' ? 'primary' : 'outline-primary'}
                className="w-50"
              >
                Vet
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        <Form.Group controlId='userEmailLogin' className="mb-4" style={{fontSize: '20px'}}>
              <Form.Control 
                type="email" 
                name="email" 
                value={userDetails.email} 
                placeholder="Email Address" 
                onChange={handleChange} 
                required 
                className="py-2 rounded-pill"
              />
            </Form.Group>
            
        <Form.Group controlId='userPassword' className="mb-4" style={{fontSize: '20px'}}>
              <Form.Control 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={userDetails.password} 
                onChange={handleChange} 
                required 
                className="py-2 rounded-pill" 
              />
            </Form.Group>
            <Button variant='outline-primary' type="submit"  className="w-100 mt-2 rounded-pill" style={{ fontWeight: '600', fontSize: '22px'}}>
                Login
            </Button>
            <div className="mt-3 text-center" style={{ fontSize: '18px' }}>
              Don't have an account? <Link to="/SignUp" style={{ fontWeight: '700', color: '#007bff' }}>SignUp</Link>
            </div>
          </Form>
          </div>
    </Container>
  );
}


export default Login; 
