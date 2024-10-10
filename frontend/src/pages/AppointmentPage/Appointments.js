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
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [petData, setPetData] = useState([]);
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
    const defaultClinics = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Clinic ${i + 1}`
    }));
    setClinics(defaultClinics);
  }, []);

  // GET APPOINTMENTS FROM DATABASE
  useEffect(() => {
    if (user) {
      getPetAppointments();
    }
  }, [user]);

  const getPetAppointments = async () => {
    const storedAppointments = await getAppointments();
    if (storedAppointments) {
      setAppointments(storedAppointments);
    }
  };

  const getAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments`);
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return null;
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
        await getPetAppointments();
      } else {
        alert(result.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking the appointment.");
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
        setAppointments(prev => prev.filter(appt => appt.id !== appointmentId));
      } else {
        alert("Failed to cancel the appointment.");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("An error occurred while canceling the appointment.");
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
        await getPetAppointments();
      } else {
        alert("Failed to reschedule appointment.");
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("An error occurred while rescheduling the appointment.");
    }
  };

  const isTimeSlotBooked = (timeSlotKey) => {
    for (let appointment of appointments) {
      const appointmentDate = new Date(appointment.appointmentDate);
      if (
        timeSlotKey == appointment.appointmentTimeId &&
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getDate() === selectedDay 
      ) {
        return appointment;
      }
    }
    return false;
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
              </div>
            )}

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
              {Object.entries(timeSlotKeys).map(([key, time]) => {
                const appointment = isTimeSlotBooked(key);
                const isBooked = !!appointment;
                const buttonClass = isBooked ? "booked" : (selectedTimeSlot === key ? "selected" : "");

                return (
                  <button
                    key={key}
                    className={buttonClass}
                    onClick={() => !isBooked && setSelectedTimeSlot(key === selectedTimeSlot ? "" : key)}
                    disabled={isBooked}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div className="appointment-modal-actions">
              <button className={buttonLabel == "Reschedule Appointment" ? "reschedule" : "book"} onClick={handleAppointmentAction}>
                {buttonLabel}
              </button>
              <button className="appointment-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Appointments;
