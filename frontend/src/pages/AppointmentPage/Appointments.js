import React, { useState, useEffect } from "react";
import './Appointments.css';

function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [appointments, setAppointments] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Helper function to get the number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to generate an array representing the days of the current month
  const generateCalendar = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(year, month);

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the days of the month
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
    if (typeof day === "number") {
      setSelectedDay(day);
      setShowModal(true);  // Show the modal when a day is clicked
    }
  };

  // Generate a unique key for an appointment using year, month, and day
  const getAppointmentKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
      {/* Pet Selection Section */}
      <section className="pet-selection">
        <h2>Select Pet Profile</h2>
        <div className="pet-profiles">
          <div className="pet-card">
            <img src="pet1.jpg" alt="Pet 1" />
            <p>Pet 1</p>
            <button>Select</button>
          </div>
          <div className="pet-card">
            <img src="pet2.jpg" alt="Pet 2" />
            <p>Pet 2</p>
            <button>Select</button>
          </div>
          <div className="pet-card">
            <img src="pet3.jpg" alt="Pet 3" />
            <p>Pet 3</p>
            <button>Select</button>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
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
          {/* Days of the Week Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} className="calendar-cell day-names">
              {day}
            </div>
          ))}

          {/* Days of the Month */}
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

      {/* Day Status Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Day: {selectedDay} {currentMonth} {currentYear}</h3>
            {appointments[getAppointmentKey(currentYear, currentDate.getMonth(), selectedDay)] ? (
              <div>
                <p>You have an appointment on this day.</p>
                <button onClick={cancelAppointment}>Cancel Appointment</button>
              </div>
            ) : (
              <div>
                <p>No appointment on this day.</p>
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
