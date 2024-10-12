import React, { useState, useEffect } from "react";
import './Appointments.css';

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
      await getPetAppointments(); // Refetch appointments after booking
    } else {
      alert(result.message || "Failed to book appointment.");
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    alert("An error occurred while booking the appointment.");
  }
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
                  selectedClinic // Pass the selected clinic to the function
                )}
              </div>

              <div className="appointment-modal-actions">
                {/* Only show Reschedule button for the clinic where the user has a booked appointment */}
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

    </>
  );
}

export default Appointments;