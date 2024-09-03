import React, { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Alert, Container, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

function SignUp() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Pet Owner'
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const[errorMessages, setErrorMessages] = useState([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value}));
  };

  const handleRoleChange = (role) => {
    setUser((prevUser) => ({ ...prevUser, role: role }));
  };

  //The following function was given by OpenAI (2024) ChatGPT [Large language model], accessed 20 March 2024. (*Link could not be generated successfully*)
  const isPasswordStrong = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*()_+\\-={}[\\]\\\\|;:'\",<.>/?~`])(?=.{8,})");
    return re.test(password);
  };

  //Validate the user inputs
  const validateForm = () => {
    let errors = [];
    //If password is not equal to confirmMessage, output the error message
    if(user.password !== user.confirmPassword){
      errors.push("Passwords do not match.");
    }
    //If password is not strong, output the error message
    if (!isPasswordStrong(user.password)) {
      errors.push("Your password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.");
    }
    //Display the error messages for 3 seconds 
    if (errors.length > 0) {
      setErrorMessages(errors);
      setShowErrorMessage(true);
      //Hide error message after 3 seconds
      setTimeout(() => setShowErrorMessage(false), 3000);
      return false;
    }
    return true;
  };

  const handleSubmit = async(event) => {
  event.preventDefault();
  if(!validateForm()){
    return;
  }

  //Save the user to localStorage
 localStorage.setItem(user.email, JSON.stringify(user));
 setShowSuccessAlert(true);
 //Redirect to login page after a successful signup
 setTimeout(() => {
 setShowSuccessAlert(false);
    navigate('/login');
    }, 3000);
 };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', fontFamily: 'Lato, sans-serif'}}>
       <div className="w-100 p-4" style={{ maxWidth: '600px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
        <br></br>
        {showSuccessAlert && <Alert variant="success">SignUp Successful!</Alert>}
        {showErrorMessage && errorMessages.map((error, index) => (
                        <Alert key={index} variant="danger">{error}</Alert>
           ))}
      <h2 className="mb-4 text-center" style={{ fontWeight: '600', color: '#333', fontSize:'40px'}}>SignUp To VetCare</h2>
      <Form onSubmit={handleSubmit} className="rounded-3">
        <Form.Label className="mb-2 text-center w-100" style={{ fontWeight: '500', fontSize: '20px', color: '#333' }}>
                Choose Your Role:
        </Form.Label>
         <div className="d-flex justify-content-center mb-4">
            <ToggleButtonGroup 
              type="radio" 
              name="role" 
              value={user.role} 
              onChange={handleRoleChange}
              className="w-100"
            >
              <ToggleButton 
                id="tbg-radio-1"
                value="Pet Owner" 
                variant={user.role === 'Pet Owner' ? 'primary' : 'outline-primary'}
                className="w-50"
              >
                Pet Owner
              </ToggleButton>
              <ToggleButton 
                id="tbg-radio-2"
                value="Vet" 
                variant={user.role === 'Vet' ? 'primary' : 'outline-primary'}
                className="w-50"
              >
                Vet
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        <Form.Group className="mb-3" controlId="userName">
          <Form.Label style={{fontFamily: 'Lato, sans-serif', fontSize:'20px'}}>Name</Form.Label>
          <Form.Control type="text" name="name" value={user.name} onChange={handleChange} required style={{ borderRadius: '15px'}}/>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="userEmailSignUp">
          <Form.Label style={{fontFamily: 'Lato, sans-serif', fontSize:'20px'}}>Email</Form.Label>
          <Form.Control type="email" name="email" value={user.email} onChange={handleChange} required style={{ borderRadius: '15px'}}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="userPassword">
          <Form.Label style={{fontFamily: 'Lato, sans-serif', fontSize:'20px'}}>Password</Form.Label>
          <Form.Control type="password" name="password" value={user.password} onChange={handleChange} required style={{ borderRadius: '15px' }} />
        </Form.Group>

        <Form.Group className="mb-4" controlId="userConfirmPassword">
          <Form.Label style={{fontFamily: 'Lato, sans-serif', fontSize:'20px'}}>Confirm Password</Form.Label>
          <Form.Control type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required style={{ borderRadius: '15px'}}/>
        </Form.Group>
        <div className="d-grid gap-2">
            <Button variant="outline-primary" type="submit" className="rounded-pill shadow-sm" style={{ fontWeight: '500', fontSize:'22px'}}>Sign Up</Button>
          </div>
        <div className = "mt-4 text-center" style={{fontSize: '18px'}}>
          Already have an account? <Link to="/login" style={{ color: '#007bff'}}>Login</Link>
        </div>
      </Form>
      </div>
    </Container>
  );
}

export default SignUp;