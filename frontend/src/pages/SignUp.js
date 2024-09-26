import React, { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Alert, Container, ToggleButtonGroup, ToggleButton, OverlayTrigger, Tooltip } from 'react-bootstrap';

function SignUp({loginUser}) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Pet Owner'
  });
  const [errors, setErrors] = useState({
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUserDetails) => ({
      ...prevUserDetails, [name]: value
    }));
  };

   const handleRoleChange = (role) => {
    setUser((prevUserDetails) => ({
      ...prevUserDetails, role: role
    }));
  };


  //The following function was given by OpenAI (2024) ChatGPT [Large language model], accessed 3 September 2024. (*Link could not be generated successfully*)
  const isPasswordStrong = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*()_+\\-={}[\\]\\\\|;:'\",<.>/?~`])(?=.{8,})");
    return re.test(password);
  };

  //Validate the user inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    };

    //Check if the Vet's email ends with @vetcare.com
    if (user.role === 'Vet' && !user.email.endsWith('@vetcare.com')) {
      newErrors.emailError = "Vets must use an email that ends with '@vetcare.com'.";
      isValid = false; 
    }

    //If password is not equal to confirmMessage, output the error message
    if(user.password !== user.confirmPassword){
      newErrors.confirmPasswordError = 'Passwords do not match.';
      isValid = false; 
    }

    //If password is not strong, output the error message
    if (!isPasswordStrong(user.password)) {
      newErrors.passwordError = 'Your password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.';
      isValid = false; 
    }

    setErrors(newErrors);
    
     return isValid;
  };

  const handleSubmit = async(event) => {
  event.preventDefault();
  if(!validateForm()){
    return;
  }

try {
    const response = await fetch('http://localhost:8080/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user.name.trim(),
        email: user.email.trim(),
        password: user.password,
        role: user.role,
      }),
    });

    if (response.status === 409) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailError: 'An account with this email already exists.',
      }));
    } else if (response.ok) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        loginUser(user);
        navigate('/');
      }, 2000);
    }
  } catch (error) {
    console.error('Error during sign-up:', error);
  }
    if (user.role === 'Vet') {
      user.medRecSent = []; // Array to hold multiple medical records
    }
  };

   const renderTooltipEmail = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Enter a valid email. If you're a vet, use an email ending in '@vetcare.com'.
    </Tooltip>
  );

  const renderTooltipPassword = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
    </Tooltip>
  );

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ marginTop: '25px', marginBottom: '25px', minHeight: '100vh', fontFamily: 'Lato, sans-serif'}}>
       <div className="w-100 p-4" style={{ maxWidth: '600px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
        <br></br>
        {showSuccessAlert && <Alert variant="success">SignUp Successful!</Alert>}
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
        <Form.Label style={{ fontFamily: 'Lato, sans-serif', fontSize: '20px' }}>
              Email{' '}
              <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipEmail}>
                <i className="bi bi-info-circle"></i>
              </OverlayTrigger>
            </Form.Label>
            <Form.Control type="email" name="email" value={user.email} onChange={handleChange} required style={{ borderRadius: '15px'}}/>
            {errors.emailError && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.emailError}</div>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="userPassword">
        <Form.Label style={{ fontFamily: 'Lato, sans-serif', fontSize: '20px' }}>
              Password{' '}
              <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipPassword}>
                <i className="bi bi-info-circle"></i>
              </OverlayTrigger>
            </Form.Label>
        <Form.Control type="password" name="password" value={user.password} onChange={handleChange} required style={{ borderRadius: '15px' }} />
        {errors.passwordError && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.passwordError}</div>}
        </Form.Group>

        <Form.Group className="mb-4" controlId="userConfirmPassword">
          <Form.Label style={{fontFamily: 'Lato, sans-serif', fontSize:'20px'}}>Confirm Password</Form.Label>
          <Form.Control type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required style={{ borderRadius: '15px'}}/>
          {errors.confirmPasswordError && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.confirmPasswordError}</div>}
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