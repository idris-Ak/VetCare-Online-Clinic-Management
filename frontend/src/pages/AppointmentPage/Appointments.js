import React, { useState, useEffect } from "react";
import './Appointments.css';

import pet3Image from 'frontend/src/components/assets/about1.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet1Image from 'frontend/src/components/assets/blog3.jpg';

// Import statements and other components remain the same
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


  useEffect(() => {
    const defaultPets = [
      { id: 1, name: 'Goatie', image: pet1Image },
      { id: 2, name: 'Pookie', image: pet2Image },
      { id: 3, name: 'Dogie', image: pet3Image },
    ];
    setPetData(defaultPets);
  }, []);

  useEffect(() => {
  const defaultClinics = [
    { id: 1, name: 'Healthy Paws Clinic' },
    { id: 2, name: 'Animal Care Center' },
    { id: 3, name: 'Paw Patrol Vet' },
    { id: 4, name: 'Furry Friends Hospital' },
    { id: 5, name: 'Best Care Veterinary' },
  ];
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
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleSelect = () => {
    setCurrentDate(new Date(selectedYear, selectedMonth, 1));
    setShowSelector(false);
  };

  const handleGoToToday = () => setCurrentDate(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const openDayModal = (day) => {
    if (selectedPet && isDateInFuture(currentDate.getFullYear(), currentDate.getMonth(), day)) {
      if (typeof day === "number") {
        setSelectedDay(day);
        setShowModal(true);
      }
    } else {
      alert("Please select a valid pet and future date.");
    }
  };

  const getAppointmentKey = (year, month, day, time) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}-${time}`;
  };

  const bookAppointment = () => {
    if (!selectedTime) {
      alert("Please select a time.");
      return;
    }

    const key = getAppointmentKey(currentDate.getFullYear(), currentDate.getMonth(), selectedDay, selectedTime);

    setAppointments(prevAppointments => {
      const updatedAppointments = { ...prevAppointments };

      if (!updatedAppointments[selectedPet.id]) {
        updatedAppointments[selectedPet.id] = {};
      }

      if (!updatedAppointments[selectedPet.id][selectedDay]) {
        updatedAppointments[selectedPet.id][selectedDay] = [];
      }

      updatedAppointments[selectedPet.id][selectedDay].push(selectedTime);

      return updatedAppointments;
    });

    setShowModal(false);
  };

  const cancelAppointment = () => {
    const key = getAppointmentKey(currentDate.getFullYear(), currentDate.getMonth(), selectedDay, selectedTime);

    setAppointments(prevAppointments => {
      const updatedAppointments = { ...prevAppointments };
      const petAppointments = updatedAppointments[selectedPet.id] || {};
      const dayAppointments = petAppointments[selectedDay] || [];

      const index = dayAppointments.indexOf(selectedTime);
      if (index > -1) {
        dayAppointments.splice(index, 1);
        if (dayAppointments.length === 0) {
          delete petAppointments[selectedDay];
        } else {
          updatedAppointments[selectedPet.id][selectedDay] = dayAppointments;
        }
        if (Object.keys(petAppointments).length === 0) {
          delete updatedAppointments[selectedPet.id];
        }
      }

      return updatedAppointments;
    });

    setShowModal(false);
  };

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 9; hour < 17; hour++) {
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  const isTimeSlotBooked = (day, time) => {
    if (!selectedPet) return false;

    const petAppointments = appointments[selectedPet.id] || {};
    const dayAppointments = petAppointments[day] || [];
    return dayAppointments.includes(time);
  };

  const isDateInFuture = (year, month, day) => {
    const today = new Date();
    const selectedDate = new Date(year, month, day);
    return selectedDate >= today;
  };

  const isTimeSlotBookedForPet = (day, time, petId) => {
    const petAppointments = appointments[petId] || {};
    const dayAppointments = petAppointments[day] || [];
    return dayAppointments.includes(time);
  };

  return (
    <>
      <section className="appointment-pet-selection">
        <h2>Select Pet Profile</h2>
        <div className="appointment-pet-profiles">
          {petData.map((pet) => (
            <div key={pet.id} className="pet">
              <img src={pet.image} alt={pet.name} />
              <p className="pet-name">{pet.name}</p>
              <button
                className={selectedPet === pet ? 'selected' : 'select'}
                onClick={() => setSelectedPet(pet)}
              >
                {selectedPet === pet ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="calendar">
        <h1 className="title">Make OR Cancel Appointments</h1>
        <div className="calendar-header">
          <button onClick={handlePreviousMonth}>Previous</button>
          <span>{currentMonth} {currentYear}</span>
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
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
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
            return (
              <div
                key={index}
                className={`calendar-cell ${day && isTimeSlotBooked(day, selectedTime) ? "has-appointment" : ""} ${!isFutureDate ? "past-date" : ""}`}
                onClick={() => isFutureDate && openDayModal(day)}
              >
                {day || ""}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
          <h3>Select a Clinic and Time Slot for {selectedDay} {currentMonth} {currentYear}</h3>
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
            <label>
              Select Time Slot:
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time} {isTimeSlotBooked(selectedDay, time) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </label>

            {isTimeSlotBookedForPet(selectedDay, selectedTime, selectedPet?.id) ? (
              <div>
                <button onClick={cancelAppointment}>Cancel Appointment</button>
              </div>
            ) : (
              <div>
                <button onClick={bookAppointment}>Book Appointment</button>
              </div>
            )}

            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Appointments;
