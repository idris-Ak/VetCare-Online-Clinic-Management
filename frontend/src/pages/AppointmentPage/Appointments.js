import React, { useState, useEffect } from "react";
import './Appointments.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import successfulPaymentCheck from 'frontend/src/components/assets/check.png';

function Appointments({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [userAppointments, setUserAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [petData, setPetData] = useState([]);
  const [vets, setVets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [highlightedDays, setHighlightedDays] = useState({});
  const [buttonLabel, setButtonLabel] = useState("Book Appointment");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPayPalButtons, setShowPayPalButtons] = useState(false);

  
  const timeSlotKeys = {
    1: "09:00",
    2: "09:30",
    3: "10:00",
    4: "10:30",
    5: "11:00",
    6: "11:30",
    7: "12:00",
    8: "12:30",
    9: "13:00",
    10: "13:30",
    11: "14:00",
    12: "14:30",
    13: "15:00",
    14: "15:30",
    15: "16:00",
    16: "16:30"
  };  

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
  if (year < currentYear || (year === currentYear && month < currentMonth) || month > 12) {
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

  // LOAD PET DATA FROM DATABASE
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

  // SET CLINICS INTO A VARIABLE WHEN COMPONENT IS DEPLOYED.
  useEffect(() => {
    const defaultClinics = [
      { id: 1, name: 'Clinic 1', price: 80 },
      { id: 2, name: 'Clinic 2', price: 50 },
      { id: 3, name: 'Clinic 3', price: 60 },
      { id: 4, name: 'Clinic 4', price: 80 }
    ];
    setClinics(defaultClinics);
  }, []);

  // GET APPOINTMENTS AND VETS FROM DATABASE
  useEffect(() => {
    if (user) {
      getPetAppointments();
      setVetData();
    }
  }, [user]);

  const getPetAppointments = async () => {
    try {
      const [storedUserAppointments, storedAppointments] = await Promise.all([
        getUserAppointments(),
        getAllAppointments()
      ]);
  
      if (storedUserAppointments) {
        setUserAppointments(storedUserAppointments);
      }
  
      if (storedAppointments) {
        setAppointments(storedAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  
  const getUserAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments?userId=${user.id}`);
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      return null;
    }
  };
  
  const getAllAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments`);
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      return null;
    }
  };

  // SET VET DATA INTO STATE
  const setVetData = async () => {
    const data = await getVetsData();
    if (data){
      setVets(data)
    }
  }; 

  const getVetsData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/vets'); 
      return response.ok? response.json() : null; 
    } catch (error) {
      console.error("Error fetching Vet Data:", error);
    }
  };
  
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

  // FUNCTION CHECKS TO SEE IF THE SELECTED DATE IS IN THE FUTURE
  const isDateInFuture = (year, month, day) => {
    const today = new Date();
    const selectedDate = new Date(year, month, day);
    return selectedDate > today;
  };

  // OPEN DAY MODAL AND LOAD APPOINTMENT INFO IF HIGHLIGHTED
  const openDayModal = (day) => {
    if (selectedPet && isDateInFuture(currentDate.getFullYear(), currentDate.getMonth(), day)) {
      setSelectedDay(day);
  
      // Check if there's an appointment for the selected day
      const existingAppointment = appointments.find(appt => {
        const appointmentDate = new Date(appt.appointmentDate);
        return (
          appointmentDate.getFullYear() === currentDate.getFullYear() &&
          appointmentDate.getMonth() === currentDate.getMonth() &&
          appointmentDate.getDate() === day &&
          appt.petId === selectedPet.id
        );
      });
  
      if (existingAppointment) {
        // Pre-load the clinic and time slot
        setSelectedClinic(clinics.find(clinic => clinic.id === existingAppointment.clinicId));
        console.log(existingAppointment.clinicId)
        setSelectedTimeSlot(existingAppointment.appointmentTime);
        setButtonLabel("Reschedule Appointment");
        setSelectedAppointment(existingAppointment);
      } else {
        setButtonLabel("Book Appointment");
        setSelectedAppointment(null);
        setSelectedTimeSlot("");
      }
  
      setShowModal(true);
    } else {
      alert("Please select your pet.");
    }
  };  

  // CHANGE HIGHLIGHTED DAYS ON CALENDAR WHEN A PET IS SELECTED
  useEffect(() => {
    if (selectedPet) {
      const petAppointments = appointments.filter(appt => appt.petId === selectedPet.id);
      const highlighted = petAppointments.reduce((acc, appt) => {
        const appointmentDate = new Date(appt.appointmentDate);
        acc[appointmentDate.getDate()] = true;
        return acc;
      }, {});
      setHighlightedDays(highlighted);
    } else {
      setHighlightedDays({});
    }
  }, [selectedPet, appointments]);

  const handleAppointmentAction = () => {
    if (buttonLabel === "Reschedule Appointment") {
      rescheduleAppointment();
    } else {
      bookAppointment();
    }
  };

 // FUNCTION THAT HANDLES APPOINTMENT CANCELING 
const cancelAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Appointment canceled successfully.");
      await getPetAppointments(); // Refetch appointments after canceling
    } else {
      alert("Failed to cancel the appointment.");
    }
  } catch (error) {
    console.error("Error canceling appointment:", error);
    alert("An error occurred while canceling the appointment.");
  }
};

// FUNCTION THAT HANDLES BOOKED APPOINTMENTS
const bookAppointment = async () => {
  if (!selectedPet || !selectedClinic || !selectedTimeSlot || !selectedDay) {
    alert("Please complete all fields to book an appointment.");
    return;
  }

  setShowModal(false);
    // Show the payment method modal
  setShowPaymentMethodModal(true);
}


const finaliseAppointmentBooking = async() => {
  const appointmentData = {
    userId: user.id,
    petId: selectedPet.id,
    clinicId: selectedClinic.id,
    appointmentDate: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`,
    appointmentTimeId: selectedTimeSlot
  };

  try {
    const response = await fetch("http://localhost:8080/api/appointments/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || "Appointment booked successfully!");
      setHighlightedDays((prev) => ({
        ...prev,
        [selectedDay]: true,
      }));
      setShowModal(false);
      // Show the payment method modal
      setShowPaymentMethodModal(false);
      setShowConfirmationModal(true);
      await getPetAppointments(); // Refetch appointments after booking
    } else {
      alert(result.message || "Failed to book appointment.");
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    alert("An error occurred while booking the appointment.");
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
            const response = await fetch(`http://localhost:8080/api/payment/credit-card?userId=${user.id}&petId=${selectedPet.id}&serviceType=Appointment+Booking`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                 amount: selectedClinic?.price || 50, // Use the clinic price, default to 50 if unavailable
            }),
          });

      if (response.ok) {
        await finaliseAppointmentBooking(); // Finalise the booking after payment

        // Close the payment modal and show confirmation modal
        setShowPaymentModal(false);
        setShowConfirmationModal(true);
      } else {
        alert('Failed to process the payment.');
      }
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('An error occurred while processing the payment. Please try again.');
      }
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
  setSelectedTimeSlot('');
  setSelectedClinic(null);
  setSelectedPet(null);
};

// FUNCTION THAT HANDLES APPOINTMENT RESCHEDUALING
const rescheduleAppointment = async () => {
  if (!selectedAppointment || !selectedTimeSlot || !selectedDay) {
    alert("Please complete all fields to reschedule the appointment.");
    return;
  }

  const updatedAppointmentData = {
    ...selectedAppointment,
    appointmentDate: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`,
    appointmentTimeId: selectedTimeSlot
  };

  try {
    const response = await fetch(`http://localhost:8080/api/appointments/${selectedAppointment.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAppointmentData),
    });

    if (response.ok) {
      alert("Appointment rescheduled successfully!");
      setHighlightedDays((prev) => ({
        ...prev,
        [selectedDay]: true,
      }));
      setShowModal(false);
      await getPetAppointments(); // Refetch appointments after rescheduling
    } else {
      alert("Failed to reschedule appointment.");
    }
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    alert("An error occurred while rescheduling the appointment.");
  }
};


  const handleClinicSelection = (clinic) => {
    if (selectedClinic?.id === clinic.id) {
      setSelectedClinic(null); 
    } else {
      setSelectedClinic(clinic); 
    }
  };

  function renderTimeSlots(appointments, timeSlotKeys, selectedTimeSlot, setSelectedTimeSlot, userAppointments, currentUser, selectedClinic) {
    return Object.entries(timeSlotKeys).map(([key, time]) => {
      // Check if the time slot is booked by someone else in the selected clinic
      const isBookedBySomeoneInClinic = appointments.some(appointment => {
        return (
          String(appointment.appointmentTimeId) === key &&
          appointment.clinicId === selectedClinic?.id
        );
      });
  
      // Check if the time slot is booked by the current user in the selected clinic
      const isBookedByCurrentUserInClinic = userAppointments.some(userAppointment => {
        return (
          String(userAppointment.appointmentTimeId) === key &&
          userAppointment.userId === currentUser.id &&
          userAppointment.clinicId === selectedClinic?.id
        );
      });
  
      let buttonClass = selectedTimeSlot === key ? "selected" : "";
  
      if (isBookedByCurrentUserInClinic) {
        buttonClass += " booked";
      }
  
      if (!isBookedBySomeoneInClinic || isBookedByCurrentUserInClinic) {
        return (
          <button
            key={key}
            disabled={isBookedByCurrentUserInClinic}
            className={buttonClass}
            onClick={() => setSelectedTimeSlot(key === selectedTimeSlot ? "" : key)}
          >
            {time}
          </button>
        );
      }
  
      return null;
    });
  }
  
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
                <div className="pet-appointments">
                  <h4>Appointments:</h4>
                  {appointments.filter(appt => appt.petId === pet.id).map(appt => (
                    <div key={appt.id} className="appointment-details">
                      <p>{appt.appointmentDate} at {timeSlotKeys[appt.appointmentTimeId]} (Clinic {appt.clinicId})</p>
                      <button onClick={() => cancelAppointment(appt.id)}>Cancel</button>
                    </div>
                  ))}
                </div>
              </div>
            )))
            :
            (<h2>Please add your pets on the profile page.</h2>)
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
            <p>
              {currentDate.toLocaleString('default', { month: 'long' })} {selectedDay}, {currentDate.getFullYear()}
            </p>
            
            {selectedAppointment && (
              <div className="booked-appointment">
                <p><strong>Booked Appointment:</strong></p>
                <p>Time: {timeSlotKeys[selectedAppointment.appointmentTimeId]}</p>
                <p>Pet: {selectedPet.name}</p>
                
                {clinics.length > 0 && (
                  <p>
                    Clinic: {
                      clinics.find(clinic => clinic.id === selectedAppointment.clinicId)?.name || "Unknown Clinic"
                    }
                  </p>
                )}
              </div>
            )}

            <h3>Select A Clinic:</h3>
            <table>
              <thead>
                <tr>
                  <th>Clinic Name</th>
                  <th>Vets</th>
                  <th>Vet Specialties</th>
                  <th>Prices</th>
                  <th>Select Clinic</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic, clinicIndex) => {
                  const clinicVets = vets.filter(vet => vet.clinicName === clinic.name);
                  return (
                    <React.Fragment key={clinicIndex}>
                      <tr>
                       
                        <td rowSpan={clinicVets.length}>{clinic.name}</td>
                        <td>{clinicVets[0]?.name}</td>
                        <td>{clinicVets[0]?.title}</td>
                        <td rowSpan={clinicVets.length}>${clinic.price}</td>
                        <td rowSpan={clinicVets.length}>
                          <button
                            onClick={() => handleClinicSelection(clinic)}
                            className={selectedClinic?.id === clinic.id ? 'selected' : 'select'}
                          >
                            {selectedClinic?.id === clinic.id ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                      
                      {clinicVets.slice(1).map((vet, vetIndex) => (
                        <tr key={vetIndex}>
                          <td>{vet.name}</td>
                          <td>{vet.title}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {selectedClinic && (
            <>
              <h3>Available Times:</h3>
              <div className="appointment-time-slots">
                {renderTimeSlots(
                  appointments,
                  timeSlotKeys,
                  selectedTimeSlot,
                  setSelectedTimeSlot,
                  userAppointments,
                  user,
                  selectedClinic
                )}
              </div>

              <div className="appointment-modal-actions">
                {selectedAppointment?.clinicId === selectedClinic.id ? (
                  <button className="reschedule" onClick={handleAppointmentAction}>
                    Reschedule Appointment
                  </button>
                ) : (
                  <button className="book" onClick={handleAppointmentAction}>
                    Book Appointment
                  </button>
                )}
                <button className="appointment-close" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </>
          )}

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
                      'disable-funding': 'card', // Disable credit/debit card option
                    }}
                >
                    <PayPalButtons
                    style={{ layout: 'vertical' }}
                    createOrder={(data, actions) => {
                        // Format the amount as a number
                        const amount = parseFloat(selectedClinic?.price || 50).toFixed(2);
                        return actions.order.create({
                        purchase_units: [
                            {
                           amount: {
                           value: amount, // Send the amount as a string in the PayPal request
                            },
                            },
                        ],
                        });
                    }}
                    onApprove={(data, actions) => {
                         // Format the amount correctly to have two decimal places
                        const amount = parseFloat(selectedClinic?.price || 50).toFixed(2);
                        return actions.order.capture().then(async (details) => {
                            if (!user || !selectedPet) {
                                alert('User or pet information is missing.');
                                return;
                            }
                         // Send orderID and other details to the backend
                          try {
                              const response = await fetch(`http://localhost:8080/api/payment/paypal?userId=${user.id}&petId=${selectedPet.id}&serviceType=Appointment+Booking`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                orderId: data.orderID,
                                amount: amount // Pass the actual amount here after a amount variable has been made
                            }),
                        });
                            if (response.ok) {
                              await finaliseAppointmentBooking(); // Finalise the booking after payment
                              setShowConfirmationModal(true);
                              } 
                              else {
                              // Handle payment failure
                              const errorData = await response.json();
                              console.error('Payment failed:', errorData);
                              alert('Payment failed. Please try again.');
                            }
                          } catch (error) {
                            console.error('Error processing payment:', error);
                            alert('An error occurred while processing the payment. Please try again.');
                          }
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

          
          {showPaymentModal && (
            <div className="modal">
              <div className="modal-content payment-modal">
                <h3>Payment Details</h3>
                <p><strong>Total Price: </strong>${selectedClinic?.price}</p>
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
                  <button type="submit" className="submit-btn">Pay ${selectedClinic?.price}</button>
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
              <li><strong>Time:</strong> {timeSlotKeys[selectedTimeSlot]}</li>
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