import React, {useState} from 'react';
import { Button, Form, Alert, Container, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from "react-router-dom";

function Login({loginUser}) {
  const [userDetails, setUserDetails] = useState({ email: '', password: '', role: 'Pet Owner' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowErrorMessage(false);

    //Check if the Vet's email ends with @vetcare.com
    if (userDetails.role === 'Vet' && !userDetails.email.endsWith('@vetcare.com').trim()) {
      setErrorMessage("Vets must use an email that ends with '@vetcare.com'.");
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }

    //Retrieve the users array from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    //Store the user details in local storage temporarily 
    const storedUser = users.find(user => user.email.trim() === userDetails.email && user.role === userDetails.role);
    
    if (storedUser && storedUser.password.trim() === userDetails.password && storedUser.role === userDetails.role) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        loginUser(storedUser);

        // if(storedUser.role === 'Vet'){
        //   navigate('/AdminDashboard');
        // }
        // else {
        //   navigate('/');
        // }

        // Check if the user was redirected here with a "from" state
        const redirectTo = location.state?.from || '/';
        navigate(redirectTo);
      }, 3000);
    } else {
      //Show an error message if the user enters any invalid details
      setErrorMessage('Invalid email, password, or role selection.');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      setUserDetails(prevDetails => ({ ...prevDetails, password: '' }));
    }
  };

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
