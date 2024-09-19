import React, { useState, useEffect } from "react";
import './Appointments.css';

import pet3Image from 'frontend/src/components/assets/about1.jpg';
import pet2Image from 'frontend/src/components/assets/about2.jpg';
import pet1Image from 'frontend/src/components/assets/blog3.jpg';


function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [appointments, setAppointments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [petData, setPetData] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  // DEFAULT DATA FOR PETS
  useEffect(() => {
    const defaultPets = [
      { id: 1, name: 'Goatie', image: pet1Image },
      { id: 2, name: 'Pookie', image: pet2Image },
      { id: 3, name: 'Dogie', image: pet3Image },
    ];
    setPetData(defaultPets);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

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

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const openDayModal = (day) => {
    if (selectedPet) {
      if (typeof day === "number") {
        setSelectedDay(day);
        setShowModal(true); 
      }
    } else {
      alert("Please select a pet first.");
    }
  };

  const getAppointmentKey = (year, month, day) => {
    return `${selectedPet?.name || "no-pet"}-${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const bookAppointment = () => {
    const key = getAppointmentKey(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    setAppointments({ ...appointments, [key]: true });
    setShowModal(false);
  };

  const cancelAppointment = () => {
    const key = getAppointmentKey(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    const newAppointments = { ...appointments };
    delete newAppointments[key];
    setAppointments(newAppointments);
    setShowModal(false);
  };

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

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
          <span>
            {currentMonth} {currentYear}
          </span>
          <button onClick={handleNextMonth}>Next</button>
          <button onClick={() => setShowSelector(!showSelector)}>
            Select Month & Year
          </button>
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
            <div key={index} className="calendar-cell day-names">
              {day}
            </div>
          ))}

          {daysInMonth.map((day, index) => {
            const appointmentKey = getAppointmentKey(currentYear, currentDate.getMonth(), day);
            return (
              <div
                key={index}
                className={`calendar-cell ${
                  appointments[appointmentKey] ? "has-appointment" : ""
                }`}
                onClick={() => openDayModal(day)}
              >
                {day || ""}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Day: {selectedDay} {currentMonth} {currentYear}</h3>
            {appointments[getAppointmentKey(currentYear, currentDate.getMonth(), selectedDay)] ? (
              <div>
                <p>{selectedPet?.name} has an appointment on this day.</p>
                <button onClick={cancelAppointment}>Cancel Appointment</button>
              </div>
            ) : (
              <div>
                <p>No appointment on this day for {selectedPet?.name}.</p>
                <button onClick={bookAppointment}>Book Appointment</button>
              </div>
            )}
            <button className="close-modal" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Appointments;
