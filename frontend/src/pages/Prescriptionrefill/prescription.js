import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'; // PayPalButton Component
import dayjs from 'dayjs';
import successfulPaymentCheck from 'frontend/src/components/assets/check.png';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import './prescription.css';

function PrescriptionRefill({ user }) {
  const [petData, setPetData] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [refillRequest, setRefillRequest] = useState({
    medication: '',
    dosage: '',
    preferredPharmacy: '',
    pickupDate: '',
  });
  const [selectedVet, setSelectedVet] = useState(null);
  const [vets, setVets] = useState([]);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control payment modal
  const [showPayPalButtons, setShowPayPalButtons] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State to control confirmation modal  

    // Payment Form State
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({
    cardNumberError: '',
    expiryDateError: '',
    cvvError: '',
  });


  // Fetch pet data
  useEffect(() => {
    if (user) {
      async function getUserPets() {
        const storedUserPets = await getPetInfo();
        setPetData(storedUserPets || []);
      }
      getUserPets();
    }
  }, [user]);

  const getPetInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/pets/user/${user.id}`);
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Error fetching pets:', error);
      return null;
    }
  };

  // Fetch vet data
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/vets');
        const vetData = await response.json();
        setVets(vetData);
      } catch (error) {
        console.error('Error fetching vets:', error);
      }
    };

    fetchVets();
  }, []);

  // Handle prescription submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if form is valid
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
        e.stopPropagation();
        return;
    }

    if (!selectedPet) {
      alert('Please select a pet for the prescription request.');
      return;
    }

    // Show payment method modal on submit
      setShowPaymentMethodModal(true);
    };

    // Handle Payment Form Changes
    const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    let formattedValue = value;
    if (name === 'cardNumber') {
      // Remove all non-digit characters
      formattedValue = formattedValue.replace(/\D/g, '');
      // Insert dashes after every 4 digits
      formattedValue = formattedValue.substring(0, 16); // Limit to 16 digits
      formattedValue = formattedValue.replace(/(.{4})/g, '$1-').trim();
      // Remove trailing dash if any
      if (formattedValue.endsWith('-')) {
        formattedValue = formattedValue.slice(0, -1);
      }
    } else if (name === 'expiryDate') {
      // Auto-format expiry date as MM/YY
      formattedValue = formattedValue.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 4);
        formattedValue = formattedValue.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    } else if (name === 'cvv') {
      // Only digits, limit to 3
    formattedValue = formattedValue.replace(/\D/g, '');
    formattedValue = formattedValue.substring(0, 3);
    }

    setPaymentDetails(prevDetails => ({
    ...prevDetails,
    [name]: formattedValue
    }));
      // Trigger validation on each change
      validateSingleField(name, formattedValue);
    };

    // Real-time validation for individual fields
    const validateSingleField = (fieldName, value) => {
        let newErrors = { ...errors };

        if (fieldName === 'cardNumber') {
            const cardNumberDigits = value.replace(/\D/g, '');
            if (cardNumberDigits.length !== 16) {
                newErrors.cardNumberError = "Card number must be 16 digits.";
            } else {
                newErrors.cardNumberError = ''; // Clear error if valid
            }
        }

        if (fieldName === 'expiryDate') {
            if (!validateExpiryDate(value)) {
                newErrors.expiryDateError = "Invalid or expired date. Use MM/YY format.";
            } else {
                newErrors.expiryDateError = ''; // Clear error if valid
            }
        }

        if (fieldName === 'cvv') {
            if (value.length !== 3) {
                newErrors.cvvError = "CVV must be 3 digits.";
            } else {
                newErrors.cvvError = ''; // Clear error if valid
            }
        }

        setErrors(newErrors); // Update the errors state
    };

// Validate credit card expiry date
const validateExpiryDate = (expiryDate) => {
    const [month, year] = expiryDate.split('/').map(Number);
    if (!month || !year) return false;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Last two digits of the year
    const currentMonth = currentDate.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth) || month > 12) {
    return false;
    }
    return true;
};

  // Validate Payment Form
const validatePaymentForm = async() => {
    const { cardNumber, expiryDate, cvv } = paymentDetails;
    let isValid = true;
    let newErrors = {
    cardNumberError: '',
    expiryDateError: '',
    cvvError: ''
    };

    // Validate card number (16 digits)
    const cardNumberDigits = cardNumber.replace(/\D/g, '');
    if (cardNumberDigits.length !== 16) {
    newErrors.cardNumberError = "Card number must be 16 digits.";
    isValid = false;
    }

      // Validate expiry date (MM/YY)
    if (!validateExpiryDate(expiryDate)) {
    newErrors.expiryDateError = "Invalid or expired date. Use MM/YY format.";
    isValid = false;
    }

    // Validate CVV (3 digits)
    if (cvv.length !== 3) {
    newErrors.cvvError = "CVV must be 3 digits.";
    isValid = false;
    }
    setErrors(newErrors);
    return isValid;
};

  // Function to submit prescription request
  const submitPrescriptionRequest = async () => {
    if (!user || !selectedPet) {
      alert('User or pet information is missing.');
      return false;
    }

    const requestData = {
      petId: selectedPet,
      service: 'Prescription', // Specify this is a prescription
      medication: refillRequest.medication,
      dosage: refillRequest.dosage,
      preferredPharmacy: refillRequest.preferredPharmacy,
      pickupDate: refillRequest.pickupDate,
      recordDate: dayjs().format('YYYY-MM-DD'), // Record the date of the prescription submission
      vetId: selectedVet ? selectedVet.id : null, // Include the vet ID if available
    };

    try {
      const response = await fetch(`http://localhost:8080/api/medicalRecords/pet/${selectedPet}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newRecord = await response.json();

        return true;
      } else {
        alert('Failed to submit the refill request.');
        return false; // Indicate failure
      }
    } catch (error) {
      console.error('Error submitting refill request:', error);
    return false; // Indicate failure
    }
  };

   // Handle Payment Submission
 const handlePaymentSubmit = async (e) => {
      e.preventDefault();
      if (validatePaymentForm()) {
        if (!user || !selectedPet) {
            alert('User or pet information is missing.');
            return;
        }
        // Send payment details to the backend
        try {
            const response = await fetch(`http://localhost:8080/api/payment/credit-card?userId=${user.id}&petId=${selectedPet}&serviceType=Prescription+Refill`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 50.00
            }),
          });

      if (response.ok) {
        const prescriptionSuccess = await submitPrescriptionRequest();
        if (prescriptionSuccess) {
          // Close the payment modal
          setShowPaymentModal(false);

          // Open the confirmation modal
          setShowConfirmationModal(true);
        } else {
          alert('Failed to submit the prescription request.');
        }
      } else {
        alert('Failed to submit the refill request.');
      }
    } catch (error) {
      console.error('Error submitting refill request:', error);
    }
  }
};

const handleCloseConfirmationModal = () => {
    // Reset form or navigate to home page
    setShowConfirmationModal(false);
    setSelectedPet(null);
    setRefillRequest({
        medication: '',
        dosage: '',
        preferredPharmacy: '',
        pickupDate: ''
    });
    setSelectedVet(null);
};

  // Get today's date in 'YYYY-MM-DD' format for the min attribute
  const today = dayjs().format('YYYY-MM-DD');

return (
  <Container className="prescription-page">
    <h1>Prescription Refill Request</h1>
    <h2>Select a pet and fill out the details below to request a refill.</h2>
    <section className="pet-selection">
      {petData.length > 0 ? (
        petData.map((pet) => (
          <div key={pet.id} className={`pet ${selectedPet === pet.id ? 'selected' : ''}`}>
            <img src={`data:image/jpeg;base64,${pet.profilePicture}`} alt={pet.name} />
            <p className="pet-name">{pet.name}</p>
            <Button
              className={selectedPet === pet.id ? 'selected' : 'select'}
              onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}
            >
              {selectedPet === pet.id ? 'Selected' : 'Select'}
            </Button>
          </div>
        ))
      ) : (
        <p>Please add your pets in the profile section.</p>
      )}
    </section>

    <div className="prescription-form">
      <Form>
      <Form.Group controlId="formMedication" className="form-group">
  <Form.Label>Medication</Form.Label>
  <Form.Control
    as="select"
    className="form-input"
    value={refillRequest.medication}
    required
    onChange={(e) => setRefillRequest({ ...refillRequest, medication: e.target.value })}
  >
    <option value="">Select Medication</option>
    <option value="Walgreens">Walgreens</option>
<option value="Walmart Pharmacy">Walmart Pharmacy</option>
<option value="Rite Aid">Rite Aid</option>
  </Form.Control>
</Form.Group>

<Form.Group controlId="formDosage" className="form-group">
  <Form.Label>Dosage</Form.Label>
  <Form.Control
    as="select"
    className="form-input"
    value={refillRequest.dosage}
    required
    onChange={(e) => setRefillRequest({ ...refillRequest, dosage: e.target.value })}
  >
    <option value="50 mg">50 mg</option>
<option value="100 mg">100 mg</option>
<option value="250 mg">250 mg</option>
<option value="500 mg">500 mg</option>
<option value="1 g">1 g</option>
<option value="5 mL">5 mL</option>
<option value="10 mL">10 mL</option>
<option value="1 tablet">1 tablet</option>
<option value="2 tablets">2 tablets</option>
<option value="1 injection">1 injection</option>

  </Form.Control>
</Form.Group>

<Form.Group controlId="formPharmacy" className="form-group">
  <Form.Label>Preferred Pharmacy</Form.Label>
  <Form.Control
    as="select"
    className="form-input"
    value={refillRequest.preferredPharmacy}
    required
    onChange={(e) => setRefillRequest({ ...refillRequest, preferredPharmacy: e.target.value })}
  >
    <option value="">Select Pharmacy</option>
    <option value="Walgreens">Walgreens</option>
<option value="Rite Aid">Rite Aid</option>
<option value="Walmart Pharmacy">Walmart Pharmacy</option>
<option value="Kroger Pharmacy">Kroger Pharmacy</option>
<option value="Safeway Pharmacy">Safeway Pharmacy</option>
<option value="Costco Pharmacy">Costco Pharmacy</option>
<option value="Target Pharmacy">Target Pharmacy</option>
<option value="Publix Pharmacy">Publix Pharmacy</option>
<option value="Albertsons Pharmacy">Albertsons Pharmacy</option>
  </Form.Control>
</Form.Group>


        <Form.Group controlId="formPickupDate" className="form-group">
          <Form.Label>Preferred Pickup Date</Form.Label>
          <Form.Control
            type="date"
            className="form-input"
            min={today}
            value={refillRequest.pickupDate}
            required
            onChange={(e) => setRefillRequest({ ...refillRequest, pickupDate: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formVet" className="form-group">
  <Form.Label>Select Veterinarian</Form.Label>
  <Form.Control
    as="select"
    required
    value={selectedVet ? selectedVet.name : ''}
    onChange={(e) => {
      const selectedVetName = e.target.value;
      const vet = vets.find((v) => v.name === selectedVetName); // Find the vet by name
      setSelectedVet(vet); // Set the selected vet object
    }}
  >
  <option value="">Select Vet</option>
    {vets.map((vet) => (
      <option key={vet.id} value={vet.name}>{vet.name}</option> // Use vet name as the value
    ))}
  </Form.Control>
</Form.Group>


        <Button className="submit-btn" onClick={handleSubmit} disabled={!selectedPet}>
          Proceed To Payment
        </Button>
      </Form>
    </div>

{/* Payment Method Selection Modal */}
{showPaymentMethodModal && (
  <div className="modal">
    <div className="modal-content payment-method-modal">
      <h3>Select Payment Method</h3>
      <div className="payment-options">
        <div className="payment-option" onClick={() => {
          setShowPaymentMethodModal(false);
          setShowPaymentModal(true);
        }}>
          <i className="fa fa-credit-card" aria-hidden="true"></i>
          <p>Credit/Debit Card</p>
        </div>

        <div className="vertical-line"></div>

        <div className="paypal-button-container">
          <PayPalScriptProvider
            options={{
              'client-id': 'AZn8taJF_Ktmts23FNW52kiR-RsyxG45Ps-vyDWgs2hje7Jv9EYFbpytQpUlyDndo_egQkb-IzD0p4jP',
              currency: 'AUD',
              intent: 'capture',
              'disable-funding': 'card',
            }}
          >
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={(data, actions) => actions.order.create({
                purchase_units: [{ amount: { value: '50.00' } }],
              })}
              onApprove={(data, actions) => actions.order.capture().then(async (details) => {
                if (!user || !selectedPet) {
                  alert('User or pet information is missing.');
                  return;
                }
                try {
                  const response = await fetch(`http://localhost:8080/api/payment/paypal?userId=${user.id}&petId=${selectedPet}&serviceType=Prescription+Refill`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: data.orderID, amount: 50.00 }),
                  });
                  if (response.ok) {
                      // Proceed to submit the prescription request
                    const prescriptionSuccess = await submitPrescriptionRequest();
                    if (prescriptionSuccess) {
                        // Only show confirmation modal if prescription request succeeds
                        setShowPaymentMethodModal(false);
                        setShowPayPalButtons(false);
                        setShowConfirmationModal(true);
                  }
                  else {
                    // Prescription submission failed
                    alert('Failed to submit the prescription request.');
                  }
                  } else {
                    alert('Payment failed. Please try again.');
                  }
                } catch (error) {
                    console.error('Error during payment or prescription submission:', error);
                alert(`An error occurred: ${error.message || 'Please try again later.'}`);
                }
              })}
              onCancel={() => {
                setShowPayPalButtons(false);
                setShowPaymentMethodModal(true);
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>

      <div className="button-group">
        {!showPayPalButtons ? (
          <button
            onClick={() => setShowPaymentMethodModal(false)}
            className="cancel-btn"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => {
              setShowPayPalButtons(false);
              setShowPaymentMethodModal(true);
            }}
            className="back-btn"
          >
            Back
          </button>
        )}
      </div>
    </div>
  </div>
)}

    {/* Payment Modal */}
    {showPaymentModal && (
      <div className="modal">
        <div className="modal-content payment-modal">
          <h3>Payment Details</h3>
          <form onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number:</label>
              <div className="input-icon">
                <i className="fa fa-credit-card" aria-hidden="true"></i>
                <input type="text" id="cardNumber" name="cardNumber" className="form-input"
                  value={paymentDetails.cardNumber} onChange={handlePaymentChange} placeholder="1234-5678-9012-3456"
                  maxLength="19" required />
              </div>
              {errors.cardNumberError && <div className="error">{errors.cardNumberError}</div>}
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="expiryDate">Expiry Date (MM/YY):</label>
                <div className="input-icon">
                  <i className="fa fa-calendar" aria-hidden="true"></i>
                  <input type="text" id="expiryDate" name="expiryDate" className="form-input"
                    value={paymentDetails.expiryDate} onChange={handlePaymentChange} placeholder="MM/YY" required />
                </div>
                {errors.expiryDateError && <div className="error">{errors.expiryDateError}</div>}
              </div>
              <div className="form-group half-width">
                <label htmlFor="cvv">CVV:</label>
                <div className="input-icon">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                  <input type="text" id="cvv" name="cvv" className="form-input"
                    value={paymentDetails.cvv} onChange={handlePaymentChange} placeholder="123" maxLength="3" required />
                </div>
                {errors.cvvError && <div className="error">{errors.cvvError}</div>}
              </div>
            </div>
            <div className="button-row two-buttons">
              <button type="submit" className="submit-btn">Pay $50</button>
              <button onClick={() => { setShowPaymentModal(false); setShowPaymentMethodModal(true); }} className="back-btn">Back</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Confirmation Modal */}
    {showConfirmationModal && (
      <div className="modal">
        <div className="modal-content confirmation-modal">
          <h3>Payment Successful!</h3>
          <img src={successfulPaymentCheck} alt="payment successful" className="checkmark" />
          <p>Thank you for your submission and payment!</p>
          <p>Here is a summary of your request:</p>
          <ul>
            <li><strong>Pet:</strong> {petData.find((pet) => pet.id === selectedPet)?.name || 'N/A'}</li>
            <li><strong>Medication:</strong> {refillRequest.medication || 'N/A'}</li>
            <li><strong>Dosage:</strong> {refillRequest.dosage || 'N/A'}</li>
            <li><strong>Preferred Pharmacy:</strong> {refillRequest.preferredPharmacy || 'N/A'}</li>
            <li><strong>Preferred Pickup Date:</strong> {refillRequest.pickupDate || 'N/A'}</li>
          </ul>
          <button onClick={handleCloseConfirmationModal} className="close-btn">Close</button>
        </div>
      </div>
    )}
  </Container>
);
}
export default PrescriptionRefill;
