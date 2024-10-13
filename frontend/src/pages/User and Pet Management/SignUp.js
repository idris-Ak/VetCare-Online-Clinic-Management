import React, { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Alert, Container, ToggleButtonGroup, ToggleButton, OverlayTrigger, Tooltip, Spinner} from 'react-bootstrap';

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
  const [isLoading, setIsLoading] = useState(false); // Loading state
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


  // The following function was given by OpenAI (2024) ChatGPT [Large language model], accessed 3 September 2024. (*Link could not be generated successfully*)
  const isPasswordStrong = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*()_+\\-={}[\\]\\\\|;:'\",<.>/?~`])(?=.{8,})");
    return re.test(password);
  };

  // Validate the user inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    };

    // If password is not equal to confirmMessage, output the error message
    if(user.password !== user.confirmPassword){
      newErrors.confirmPasswordError = 'Passwords do not match.';
      isValid = false; 
    }

    // If password is not strong, output the error message
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

  let name = user.name.trim();
  if (user.role === "Vet"){
    name = "Dr. " + user.name.trim();
  }

  try {
    // Try getting a response from the api
    const response = await fetch('http://localhost:8080/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the user data to the backend
      body: JSON.stringify({
        name: name,
        email: user.email.trim(),
        password: user.password,
        role: user.role,
      }),
    });

    // If the response status is 409 then set the appropriate error
    if (response.status === 409) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailError: 'An account with this email already exists.',
      }));
    } else if (response.ok) {
      // Otherwise, log the user in and navigate them to the home page
      const fetchUser = await response.json();
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        loginUser(fetchUser);

        // Redirect based on role
        if (fetchUser.role === "Vet") {
          addVet(fetchUser);
          navigate('/VetDashboard');  // Redirect to Vet dashboard
        } else {
          navigate('/');
        }
      }, 2000);
    }
  } catch (error) {
    console.error('Error during sign-up:', error);
  }
  finally {
    setIsLoading(false);
  }
  };
  const addVet = async (user) => {
    try {
      // Prepare the vet data using the user details from signup
      const vetData = {
        name: user.name,
        title: 'Veterinarian',  
        short_description: `Dr. ${user.name} is a skilled`,
        long_description: `Dr. ${user.name} has joined VetCare as a dedicated vet, bringing expertise and a passion for pet health.`,
        image_path: 'default-vet.jpg',  // Placeholder image path, could be updated later
        detail_path: `/vets/${user.name.toLowerCase()}`, // Dynamic vet detail path
        clinic_name: 'Clinic 4',  // You can update this as per actual clinic name or leave as default
      };
  
      // Send the vet data to the backend
      const response = await fetch('http://localhost:8080/api/vets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vetData),
      });
  
      if (response.ok) {
        const vet = await response.json();
        console.log('Vet added successfully:', vet);
  
        // Now update the user with the vetId
        const userResponse = await fetch(`http://localhost:8080/api/users/vetId/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ vetId: vet.id }),
        });
  
        if (userResponse.ok) {
          console.log('User vetId updated successfully');
        } else {
          console.error('Error updating user with vetId');
        }
      } else {
        console.error('Error adding vet');
      }
    } catch (error) {
      console.error('Error adding vet:', error);
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
          <Form.Control type="text" name="name" maxLength={50} value={user.name} onChange={handleChange} 
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Only allow letters and spaces
            }}
            required style={{ borderRadius: '15px'}}/>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="userEmailSignUp">
        <Form.Label style={{ fontFamily: 'Lato, sans-serif', fontSize: '20px' }}>
              Email{' '}
              <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipEmail}>
                <i className="bi bi-info-circle"></i>
              </OverlayTrigger>
            </Form.Label>
            <Form.Control type="email" name="email" maxLength={100} value={user.email} onChange={handleChange} required style={{ borderRadius: '15px'}}/>
            {errors.emailError && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.emailError}</div>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="userPassword">
        <Form.Label style={{ fontFamily: 'Lato, sans-serif', fontSize: '20px' }}>
              Password{' '}
              <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipPassword}>
                <i className="bi bi-info-circle"></i>
              </OverlayTrigger>
            </Form.Label>
        <Form.Control type="password" name="password" maxLength={100} value={user.password} onChange={handleChange} required style={{ borderRadius: '15px' }} />
        {errors.passwordError && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.passwordError}</div>}
        </Form.Group>

        <Form.Group className="mb-4" controlId="userConfirmPassword">
          <Form.Label style={{fontFamily: 'Lato, sans-serif', fontSize:'20px'}}>Confirm Password</Form.Label>
          <Form.Control type="password" name="confirmPassword"  maxLength={100} value={user.confirmPassword} onChange={handleChange} required style={{ borderRadius: '15px'}}/>
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