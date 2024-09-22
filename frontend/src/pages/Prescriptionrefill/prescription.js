import React, { useState } from 'react';
import './prescription.css';

import pet3Image from 'frontend/src/components/assets/about1.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet1Image from 'frontend/src/components/assets/blog3.jpg';
import successfulPaymentCheck from 'frontend/src/components/assets/check.png';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'; // PayPalButton Component

const Prescription = () => {
    const [selectedPet, setSelectedPet] = useState(null);
    const [prescriptionDetail, setPrescriptionDetail] = useState('');
    const [preferredPharmacy, setPreferredPharmacy] = useState('');
    const [preferredPickupDate, setPreferredPickupDate] = useState('');
    const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
    const [preferredPickupTime, setPreferredPickupTime] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control payment modal
    const [showPayPalButtons, setShowPayPalButtons] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State to control confirmation modal  
    
    // Pet images and names
    const pets = [
      { id: 1, name: 'Goatie', image: pet1Image },
      { id: 2, name: 'Pookie', image: pet2Image },
      { id: 3, name: 'Dogie', image: pet3Image },
    ];

     // Payment Form State
    const [paymentDetails, setPaymentDetails] = useState({
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });

    const [errors, setErrors] = useState({
      cardNumberError: '',
      expiryDateError: '',
      cvvError: ''
    });
  
    const handlePetSelect = (petId) => {
      const selectedPet = pets.find(pet => pet.id === petId); // Find the selected pet
      setSelectedPet(selectedPet); // Update the selected pet
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
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
  };

    // Validate credit card expiry date
    const validateExpiryDate = (expiryDate) => {
    const [month, year] = expiryDate.split('/').map(Number);
    if (!month || !year) return false;
  
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Last two digits of the year
    const currentMonth = currentDate.getMonth() + 1;

    // Expired if year is less than current or same year with month less than current month
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
    }
    return true;
  };

    // Validate Payment Form
    const validatePaymentForm = () => {
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

  // Handle Payment Submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePaymentForm()) {
      // Close payment modal and open confirmation modal
      setShowPaymentModal(false);
      setShowConfirmationModal(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    // Reset form or navigate to home page
    setShowConfirmationModal(false);
    setSelectedPet(null);
    setPrescriptionDetail('');
    setPreferredPharmacy('');
    setPreferredPickupDate('');
    setPreferredPickupTime('');
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    setErrors({
      cardNumberError: '',
      expiryDateError: '',
      cvvError: ''
    });
  };

    return (
      <div className="prescription-page">
        <h1>Request Prescription for Your Pet</h1>
        <div className="pet-selection">
          {pets.map((pet) => (
            <div key={pet.id} className="pet">
              <img src={pet.image} alt={pet.name} />
              <p className="pet-name">{pet.name}</p>
              <button
                className={selectedPet?.id === pet.id ? 'selected' : 'select'}
                onClick={() => handlePetSelect(pet.id)}
              >
                {selectedPet?.id === pet.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
  
        <div className="prescription-form">
          <h2>
            Prescription Request {selectedPet ? `for ${selectedPet.name}` : ''}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="prescriptionDetail">Prescription Detail:</label>
              <textarea
                id="prescriptionDetail"
                className="form-input"
                value={prescriptionDetail}
                onChange={(e) => setPrescriptionDetail(e.target.value)}
                placeholder="Enter details about the prescription"
                rows="4"
                required
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="preferredPharmacy">Preferred Pharmacy:</label>
              <select
                id="preferredPharmacy"
                className="form-input"
                value={preferredPharmacy}
                onChange={(e) => setPreferredPharmacy(e.target.value)}
                required
              >
                <option value="">Select a pharmacy</option>
                <option value="Pharmacy 1">Pharmacy 1</option>
                <option value="Pharmacy 2">Pharmacy 2</option>
                <option value="Pharmacy 3">Pharmacy 3</option>
                <option value="Pharmacy 4">Pharmacy 4</option>
                <option value="Pharmacy 5">Pharmacy 5</option>
              </select>
            </div>
  
            <div className="form-group">
              <label htmlFor="preferredPickupDate">Preferred Pickup Date:</label>
              <input
                type="date"
                id="preferredPickupDate"
                className="form-input"
                value={preferredPickupDate}
                onChange={(e) => setPreferredPickupDate(e.target.value)}
                required
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="preferredPickupTime">Preferred Pickup Time:</label>
              <input
                type="time"
                id="preferredPickupTime"
                className="form-input"
                value={preferredPickupTime}
                onChange={(e) => setPreferredPickupTime(e.target.value)}
                required
              />
            </div>
  
            <button type="submit" className="submit-btn">Proceed To Payment</button>
          </form>
        </div>
        
      {/* Payment Method Selection Modal */}
      {showPaymentMethodModal && (
        <div className="modal">
          <div className="modal-content payment-method-modal">
            <h3>Select Payment Method</h3>
            <div className="payment-options">
              <div
                className="payment-option"
                onClick={() => {
                  setShowPaymentMethodModal(false);
                  setShowPaymentModal(true);
                }}
              >
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
                      'disable-funding': 'card', // Disable credit/debit card option
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: 'vertical' }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: '50.00', // Set the amount here
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          setShowPaymentMethodModal(false);
                          setShowPayPalButtons(false);
                          setShowConfirmationModal(true);
                        });
                      }}
                      onCancel={() => {
                        setShowPayPalButtons(false);
                        setShowPaymentMethodModal(true);
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
            </div>
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
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    className="form-input"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234-5678-9012-3456"
                    maxLength="19"
                    required
                  />
                </div>
                {errors.cardNumberError && (
                  <div className="error">{errors.cardNumberError}</div>
                )}
              </div>

             <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="expiryDate">Expiry Date (MM/YY):</label>
                  <div className="input-icon">
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      className="form-input"
                      value={paymentDetails.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                {errors.expiryDateError && (
                  <div className="error">{errors.expiryDateError}</div>
                )}
              </div>

              <div className="form-group half-width">
                  <label htmlFor="cvv">CVV:</label>
                  <div className="input-icon">
                    <i className="fa fa-lock" aria-hidden="true"></i>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      className="form-input"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                  {errors.cvvError && (
                    <div className="error">{errors.cvvError}</div>
                  )}
                </div>
              </div>

              <div className="button-row two-buttons">
                <button type="submit" className="submit-btn">Pay Now</button>
                <button onClick={() => { setShowPaymentModal(false); setShowPaymentMethodModal(true);}} className="back-btn">Back</button>
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
            {/*<a href="https://www.flaticon.com/free-icons/yes" title="yes icons">Yes icons created by hqrloveq - Flaticon</a> */}
            <img src={successfulPaymentCheck} alt="payment successful" className="checkmark" />
            <p>Thank you for your submission and payment!</p>
            <p>Here is a summary of your request:</p>
            <ul>
              <li><strong>Pet:</strong> {selectedPet?.name || 'N/A'}</li>
              <li><strong>Prescription Detail:</strong> {prescriptionDetail}</li>
              <li><strong>Preferred Pharmacy:</strong> {preferredPharmacy}</li>
              <li><strong>Preferred Pickup Date:</strong> {preferredPickupDate}</li>
              <li><strong>Preferred Pickup Time:</strong> {preferredPickupTime}</li>
            </ul>
            <button onClick={handleCloseConfirmationModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
  
  export default Prescription;