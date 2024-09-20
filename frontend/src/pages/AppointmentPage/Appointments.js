import React, { useState, useEffect } from "react";
import './Appointments.css';

function Appointments() {
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userPets = user.pets || [];
      setPetData(userPets);
    } else {
      setPetData([]);
    }

    // Load appointments from local storage
    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || {};
    setAppointments(storedAppointments);
  }, []);

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
  
    const key = `${selectedPet.id}-${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}-${selectedTime}-${selectedClinic.id}`;
  
    setAppointments((prevAppointments) => {
      const updatedAppointments = { ...prevAppointments };
  
      if (!updatedAppointments[key]) {
        updatedAppointments[key] = { petId: selectedPet.id, clinicId: selectedClinic.id, time: selectedTime, day: selectedDay };
        localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
      }
  
      return updatedAppointments;
    });
  
    // Highlight the day on the calendar after booking
    setHighlightedDays((prev) => ({
      ...prev,
      [selectedDay]: true
    }));
  
    setShowModal(false);
  };
  
  const cancelAppointment = (time) => {
    const keyToRemove = `${selectedPet.id}-${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}-${time}-${selectedClinic.id}`;
  
    setAppointments((prevAppointments) => {
      const updatedAppointments = { ...prevAppointments };
      delete updatedAppointments[keyToRemove]; // Remove the appointment from state
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments)); // Update local storage
  
      // Check if there are any remaining appointments on the selected day
      const hasAppointmentsLeft = Object.values(updatedAppointments).some(
        (app) =>
          app.day === selectedDay && app.petId === selectedPet.id && app.clinicId === selectedClinic.id
      );
  
      // Update highlightedDays state based on remaining appointments
      setHighlightedDays((prev) => {
        const updatedHighlightedDays = { ...prev };
        if (!hasAppointmentsLeft) {
          delete updatedHighlightedDays[selectedDay]; // Remove the highlight if no appointments are left
        }
        return updatedHighlightedDays;
      });
  
      return updatedAppointments;
    });
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
                <img src={pet.profilePicture} alt={pet.name} />
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
                      // Toggle the selected time for booking
                      setSelectedTimeSlot(prev => (prev === time ? "" : time));
                      setSelectedTime(prev => (prev === time ? "" : time));
                    } else if (existingAppointments.length > 0) {
                      // Cancel the appointment if it's already booked
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
    </>
  );
}

export default Appointments;
