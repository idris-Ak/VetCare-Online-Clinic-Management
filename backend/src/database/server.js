const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 5001;

const path = require('path');
console.log('Using database file at:', path.resolve('../vetclinic.db'));


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('../vetclinic.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the vetclinic database.');
});

const seedDatabase = () => {
  const vets = [
    {
      name: "Dr. Sophie",
      title: "Veterinarian",
      short_description: "Specializing in dermatology, Dr. Sophie brings a wealth of experience to the VetCare team...",
      long_description: "Dr. Sophie is a dedicated veterinarian who graduated from the University of Melbourne's Veterinary School in 2019...",
      image_path: "../assets/vet1.jpg",
      detail_path: "/dr-sophie"
    },
    {
      name: "Dr. Liam",
      title: "Emergency Care Veterinarian",
      short_description: "Dr. Liam specializes in emergency and critical care at VetCare...",
      long_description: "Dr. Liam has carved a niche in emergency and critical care since his graduation from the Royal Veterinary College...",
      image_path: "../assets/vet2.jpg",
      detail_path: "/dr-liam"
    }
  ];

  vets.forEach(vet => {
    const sql = `INSERT INTO vets (name, title, short_description, long_description, image_path, detail_path)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [vet.name, vet.title, vet.short_description, vet.long_description, vet.image_path, vet.detail_path], 
      (err) => {
        if (err) {
          return console.error("Error inserting vet:", vet.name, err.message); // Log insertion errors
        }
        console.log(`Inserted vet: ${vet.name}`);
      });
  });
};


// Create vets table if it doesn't exist, then seed the database if needed
db.serialize(() => {
  // Create the vets table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS vets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      short_description TEXT,
      long_description TEXT,
      image_path TEXT,
      detail_path TEXT
    )
  `, (err) => {
    if (err) {
      return console.error(err.message);
    }

// Check if the table is empty and seed the database if needed
db.get("SELECT COUNT(*) AS count FROM vets", (err, row) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Forcing database seeding...");
    seedDatabase();  // Remove the condition to force re-seeding
  }
});

  });
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

// API to get all vets
app.get('/api/vets', (req, res) => {
  const sql = 'SELECT * FROM vets';
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

// API to get a vet by ID
app.get('/api/vets/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM vets WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Vet not found' });
    }
    res.json({
      message: 'success',
      data: row
    });
  });
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

// Close connection to the database to prevent memory leaks 
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});
  