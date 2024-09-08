import React, { useState, useEffect } from "react";
import './Appointments.css';

function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

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

      {/* Appointment Buttons */}
      <div className="appointment-buttons">
        <button className="book-appointment">Book Appointment</button>
        <button className="cancel-appointment">Cancel Appointment</button>
      </div>

      {/* Calendar Section */}
      <div className="calendar">
        <h1 className="title">Interactive Calendar</h1>
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
                onChange={(e) => setSelectedYear(e.target.value)}
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

          {daysInMonth.map((day, index) => (
            <div key={index} className="calendar-cell">
              {day ? day : ""}
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

export default Appointments;
