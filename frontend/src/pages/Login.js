import React, {useState} from 'react';
import { Button, Form, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";


function Login() {
const [userDetails, setUserDetails] = useState({ email: '', password: '', role: 'Pet Owner' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

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

    const storedUser = JSON.parse(localStorage.getItem(userDetails.email));
    
    if (storedUser && storedUser.password === userDetails.password && storedUser.role === userDetails.role) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/');
      }, 3000);
    } else {
      setErrorMessage('Invalid email, password, or role selection.');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      setUserDetails(prevDetails => ({ ...prevDetails, password: '' }));
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '75vh', fontFamily: 'Lato, sans-serif' }}>
      <Card className="shadow-lg border-0" style={{ width: '100%', maxWidth: '500px', borderRadius: '20px' }}>
        <Card.Body className="p-5">
          <h2 className="mb-4 text-center" style={{ fontWeight: '700', color: '#333', fontSize: '40px' }}>Login</h2>

          {showErrorMessage && errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {showSuccessAlert && <Alert variant="success">Login Successful!</Alert>}
          
          <div className="d-flex justify-content-center mb-4">
            <Button 
              variant={userDetails.role === 'Pet Owner' ? 'primary' : 'outline-primary'} 
              onClick={() => handleRoleChange('Pet Owner')} 
              className="me-2 w-50"
              style={{ fontWeight: '600' }}
            >
              Pet Owner
            </Button>
            <Button 
              variant={userDetails.role === 'Vet' ? 'primary' : 'outline-primary'} 
              onClick={() => handleRoleChange('Vet')} 
              className="w-50"
              style={{ fontWeight: '600' }}
            >
              Vet
            </Button>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='userEmailLogin' className="mb-4">
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
            
            <Form.Group controlId='userPassword' className="mb-4">
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
            
            <Button 
              variant='primary' 
              type="submit"  
              className="w-100 mt-2 rounded-pill" 
              style={{ fontWeight: '600', fontSize: '22px' }}
            >
              Login
            </Button>
            
            <div className="mt-3 text-center" style={{ fontSize: '18px' }}>
              Don't have an account? <Link to="/SignUp" style={{ fontWeight: '700', color: '#007bff' }}>SignUp</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}


export default Login; 
