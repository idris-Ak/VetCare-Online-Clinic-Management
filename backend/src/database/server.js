const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./vetclinic.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the vetclinic database.');
});

// API to get pets
app.get('/api/pets', (req, res) => {
  const sql = 'SELECT * FROM pets';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// API to get prescription details
app.get('/api/prescriptions', (req, res) => {
  const sql = 'SELECT * FROM prescriptions';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// API to get clinics
app.get('/api/clinics', (req, res) => {
  const sql = 'SELECT * FROM clinics';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add Prescription to Medical History
app.post('/api/medical-history', (req, res) => {
    const { userId, petName, prescriptionDetail, pharmacy, pickupDate, pickupTime } = req.body;
    const sql = `
      INSERT INTO medical_history (user_id, pet_name, prescription_detail, pharmacy, pickup_date, pickup_time)
      VALUES (?, ?, ?, ?, ?, ?)`;
  
    db.run(sql, [userId, petName, prescriptionDetail, pharmacy, pickupDate, pickupTime], function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: 'Prescription added to medical history', id: this.lastID });
    });
  });
  
  // Get Medical History for a User
  app.get('/api/medical-history/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = 'SELECT * FROM medical_history WHERE user_id = ?';
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: 'success', data: rows });
    });
  });

  // API call to get appointments
  app.get('/api/appointments', (req, res) => {
    const sql = 'SELECT * FROM appointments';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// API to add an appointment
app.post('/api/appointments', (req, res) => {
    const { petId, clinicId, time, day, month, year } = req.body;
    const sql = `INSERT INTO appointments (petId, clinicId, time, day, month, year)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [petId, clinicId, time, day, month, year], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Appointment booked', id: this.lastID });
    });
});

// API to delete an appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM appointments WHERE id = ?';
  
  db.run(sql, [id], function (err) {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json({ message: 'Appointment cancelled' });
  });
});
  