import React, { useState, useEffect } from "react";
import './Appointments.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import successfulPaymentCheck from 'frontend/src/components/assets/check.png'; 

function Appointments({user}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointments, setAppointments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [petData, setPetData] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [highlightedDays, setHighlightedDays] = useState({});
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Payment States
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

  // Payment Validation
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

    // Validate CVV
    if (cvv.length !== 3) {
      newErrors.cvvError = "CVV must be 3 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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


  // LOAD PET DATA FROM DATABASE
  useEffect(() => {
    if (user) {
      async function getUserPets() {
        const storedUserPets = await getPetInfo();
        if (storedUserPets) {
          setPetData(storedUserPets);
        } else {
          setPetData([]);
        }
      }
      getUserPets();
    }
  }, [user]);

  const getPetInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/pets/user/${user.id}`);
      if (response.ok) {
        const petData = await response.json();
        return petData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching pets:', error);
      return null;
    }
  };

    // SET CLINICS INTO A VARAIBLE WHEN COMPONENT IS DEPLOYED. 
  useEffect(() => {
    const defaultClinics = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Clinic ${i + 1}`
    }));
    setClinics(defaultClinics);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const generateCalendar = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(year, month);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setDaysInMonth(generateCalendar(year, month));
  }, [currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSelect = () => {
    setCurrentDate(new Date(selectedYear, selectedMonth, 1));
    setShowSelector(false);
  };

  const handleGoToToday = () => setCurrentDate(new Date());

  const isDateInFuture = (year, month, day) => {
    const today = new Date();
    const selectedDate = new Date(year, month, day);
    return selectedDate >= today;
  };

  // FUNCTION THAT HANDLES MODAL STATE FOR CALANDER
  const openDayModal = (day) => {
    if (selectedPet && isDateInFuture(currentDate.getFullYear(), currentDate.getMonth(), day)) {
      setSelectedDay(day);
      setShowModal(true);
    } else {
      alert("Please select a Your pet.");
    }
  };

  const getExistingAppointments = (time) => {
    return Object.values(appointments).filter(
      (appointment) =>
        appointment.petId === selectedPet?.id &&
        appointment.day === selectedDay &&
        appointment.clinicId === selectedClinic?.id &&
        appointment.time === time
    );
  };
  

  const bookAppointment = () => {
    if (!selectedTime || !selectedClinic) {
      alert("Please select a time and clinic.");
      return;
    }

      setShowModal(false);
      // Show the payment method modal
      setShowPaymentMethodModal(true);
    }
    
    const finaliseAppointmentBooking = () => {
    const key = `${selectedPet.id}-${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}-${selectedTime}-${selectedClinic.id}`;
  
    setAppointments((prevAppointments) => {
      const updatedAppointments = { ...prevAppointments };
  
      if (!updatedAppointments[key]) {
        updatedAppointments[key] = { petId: selectedPet.id, clinicId: selectedClinic.id, time: selectedTime, day: selectedDay };
        localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
      }
  
      return updatedAppointments;
    });
  
    // HIHGLIGHT DAY ON CALANDER 
    setHighlightedDays((prev) => ({
      ...prev,
      [selectedDay]: true
    }));
  
    setShowModal(false);
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const handlePaymentSubmit = (e) => {
  e.preventDefault();
  if (validatePaymentForm()) {
    setShowPaymentModal(false); // Close the payment modal
    finaliseAppointmentBooking(); // Finalise the booking after payment
  }
};

const handleCloseConfirmationModal = () => {
  setShowConfirmationModal(false);
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
  setSelectedDay(null);
  setSelectedTime('');
  setSelectedClinic(null);
};
  
  const cancelAppointment = (time) => {
    const keyToRemove = `${selectedPet.id}-${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}-${time}-${selectedClinic.id}`;
  
    setAppointments((prevAppointments) => {
      const updatedAppointments = { ...prevAppointments };
      delete updatedAppointments[keyToRemove]; 
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments)); 
  
      // CHECK FOR APPOINTMENT AVAILABLITY ON SELECTED DAY
      const hasAppointmentsLeft = Object.values(updatedAppointments).some(
        (app) =>
          app.day === selectedDay && app.petId === selectedPet.id && app.clinicId === selectedClinic.id
      );
  
      // UPDATE HIGHLIGHTEDDAYS BASED ON REMAINING APPOINTMENTS
      setHighlightedDays((prev) => {
        const updatedHighlightedDays = { ...prev };
        if (!hasAppointmentsLeft) {
          delete updatedHighlightedDays[selectedDay]; 
        }
        return updatedHighlightedDays;
      });
  
      return updatedAppointments;
    });
  };
  

  const handlePayPalApprove = () => {
    setShowConfirmationModal(true);
    setShowPaymentMethodModal(false);
    // Book the appointment after PayPal payment is approved
    bookAppointment();
  };

  const timeSlots = Array.from({ length: 16 }, (_, i) => `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`);

  const isTimeSlotBooked = (time) => {
    return Object.values(appointments).some(appointment => appointment.day === selectedDay && appointment.time === time && appointment.clinicId === selectedClinic?.id);
  };

  return (
    <>
      <section className="appointment-pet-selection">
        <h2>Select Pet Profile</h2>
        <div className="appointment-pet-profiles">
          {petData.length > 0 ? 
            (petData.map((pet) => (
              <div key={pet.id} className="pet">
                <img src={`data:image/jpeg;base64,${pet.profilePicture}`} alt={pet.name} />
                <p className="pet-name">{pet.name}</p>
                <button
                  className={selectedPet === pet ? 'selected' : 'select'}
                  onClick={() => {
                    setSelectedPet(selectedPet === pet ? null : pet);
                  }}
                >
                  {selectedPet === pet ? 'Selected' : 'Select'}
                </button>
              </div>
            )))
            :
            (<h2>Please Add Your pets on the Profile Page</h2>)
          }
        </div>
      </section>

      <div className="calendar">
        <h1 className="title">Make OR Cancel Appointments</h1>
        <div className="calendar-header">
          <button onClick={handlePreviousMonth}>Previous</button>
          <span>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</span>
          <button onClick={handleNextMonth}>Next</button>
          <button onClick={() => setShowSelector(!showSelector)}>Select Month & Year</button>
          <button onClick={handleGoToToday}>Today</button>
        </div>

        {showSelector && (
          <div className="selector">
            <h3>Select Year and Month</h3>
            <label>
              Year:
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
            </label>
            <label>
              Month:
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index} value={index}>
                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={handleSelect}>Go</button>
          </div>
        )}

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} className="calendar-cell day-names">{day}</div>
          ))}

          {daysInMonth.map((day, index) => {
            const isFutureDate = isDateInFuture(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isHighlighted = highlightedDays[day];

            return (
              <div
                key={index}
                className={`calendar-cell ${day ? (isHighlighted ? "highlighted" : "") : "empty"} ${isFutureDate ? "future" : "past"}`}
                onClick={() => day && isFutureDate && openDayModal(day)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{getExistingAppointments().length > 0 ? "Cancel Appointment" : "Book Appointment"}</h2>
            <p>
              {currentDate.toLocaleString('default', { month: 'long' })} {selectedDay}, {currentDate.getFullYear()}
            </p>
            <label>
              Select Clinic:
              <select
                value={selectedClinic?.id || ""}
                onChange={(e) => {
                  const clinic = clinics.find(cl => cl.id === parseInt(e.target.value));
                  setSelectedClinic(clinic);
                }}
              >
                <option value="">Select a clinic</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </label>
            <h3>Available Times:</h3>
            <div className="appointment-time-slots">
            {timeSlots.map((time, index) => {
              const isBooked = isTimeSlotBooked(time);
              const existingAppointments = getExistingAppointments(time);
              const isSelected = selectedTimeSlot === time;

              return (
                <button
                  key={index}
                  className={isBooked ? "booked" : (isSelected ? "selected" : "")}
                  onClick={() => {
                    if (!isBooked) {
                      
                      setSelectedTimeSlot(prev => (prev === time ? "" : time));
                      setSelectedTime(prev => (prev === time ? "" : time));
                    } else if (existingAppointments.length > 0) {
                      
                      cancelAppointment(time);
                    }
                  }}
                  disabled={isBooked}
                >
                  {time}
                </button>
              );
            })}

            </div>
            <div className="appointment-modal-actions">
              {getExistingAppointments(selectedTime).length > 0 ? (
                <button className="appointment-cancel" onClick={() => cancelAppointment(selectedTime)}>
                  Cancel Appointment
                </button>
              ) : (
                <button className="appointment-book" onClick={bookAppointment}>
                  Book Appointment
                </button>
              )}
              <button className="appointment-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                      'disable-funding': 'card', 
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: 'vertical' }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: { value: '50.00' },  
                            },
                          ],
                        });
                      }}
                      onApprove={handlePayPalApprove}
                      onCancel={() => {
                        setShowPaymentMethodModal(true);
                      }}
                    />
                  </PayPalScriptProvider>
                  </div>
                </div>
          <div className="button-row two-buttons">
            <button
              onClick={() => {
                setShowPaymentMethodModal(false); 
                setShowModal(true); 
              }}
              className="back-btn"
            >
              Back
            </button>
            <button
              onClick={() => setShowPaymentMethodModal(false)}
              className="cancel-btn"
            >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

          
          {showPaymentModal && (
            <div className="modal">
              <div className="modal-content payment-modal">
                <h3>Payment Details</h3>
                <p><strong>Total Price: </strong>$50.00</p> 
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
                    <button type="submit" className="submit-btn">Pay $50.00</button> 
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setShowPaymentMethodModal(true);
                      }}
                      className="back-btn"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content confirmation-modal">
            <h3>Payment Successful!</h3>
            <img src={successfulPaymentCheck} alt="payment successful" className="checkmark" />
            <p>Thank you for your appointment booking!</p>
            <p>Here is a summary of your request:</p>
            <ul>
              <li><strong>Pet:</strong> {selectedPet?.name || 'N/A'}</li>
              <li><strong>Date:</strong> {currentDate.toLocaleString('default', { month: 'long' })} {selectedDay}, {currentDate.getFullYear()}</li>
              <li><strong>Time:</strong> {selectedTime}</li>
              <li><strong>Clinic:</strong> {selectedClinic?.name || 'N/A'}</li>
            </ul>
            <button onClick={handleCloseConfirmationModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Appointments;
