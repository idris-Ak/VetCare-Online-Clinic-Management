import React, { useState } from 'react';
import { Button, Table, Container, Modal, Alert, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";


function VetCareDashboard() {
  // State for switching between views (Medical Records vs. Prescription Refills)
  const [activeView, setActiveView] = useState('medicalRecords'); // 'medicalRecords' or 'prescriptions'

  // Medical Records State
  const [records] = useState([
    { date: '01/01/2023', service: 'Annual Check-up', vet: 'Dr. Doofenshmirtz', id: 1 },
    { date: '01/06/2023', service: 'Vaccination', vet: 'Dr. Perry', id: 2 },
  ]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Prescription Refills State
  const [prescriptions] = useState([
    { name: 'Flea Prevention', status: 'Available', id: 1, price: 50.00 },
    { name: 'Heartworm Prevention', status: 'Available', id: 2, price: 75.00},
  ]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const navigate = useNavigate();

  //Payment Form State
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


  // Handle Download Record
  const handleDownload = (record) => {
    const content = JSON.stringify(record, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-record-${record.id}.pdf`;
    a.click();
  };

  // Handle Email Record
  const handleEmail = (record) => {
    // This is a simple mock. In real use case, an email service would be integrated.
    alert(`Record of ${record.service} sent via email.`);
  };

  // Handle Refill Request and Payment
  const handleRequestRefill = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  // Handle form changes
  const handlePaymentChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  //Validate the payment form
  const validatePaymentForm = () => {
    const { cardNumber, expiryDate, cvv } = paymentDetails;
    let isValid = true;
    let newErrors = {
      cardNumberError: '',
      expiryDateError: '',
      cvvError: ''
    };

    //Validate card number (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumberError = "Card number must be 16 digits.";
      isValid = false;
    }

    //Validate expiry date (MM/YY)
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      newErrors.expiryDateError = "Invalid expiry date. Use MM/YY format.";
      isValid = false;
    }

    //Validate CVV (3 digits)
    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvvError = "CVV must be 3 digits.";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  // Handle payment submission
  const handlePayment = () => {
     if (validatePaymentForm()) {
        navigate('/payment-success'); // Navigate to the success page
    }
  };

  return (
    <Container>
      <h1>VetCare Dashboard</h1>

      {/* Navigation Buttons to Switch Between Views */}
      <div className="mb-4">
        <Button variant="primary" onClick={() => setActiveView('medicalRecords')} className="mr-2">
          Medical Records
        </Button>
        <Button variant="secondary" onClick={() => setActiveView('prescriptions')}>
          Prescription Refills
        </Button>
      </div>

      {/* Medical Records View */}
      {activeView === 'medicalRecords' && (
        <div>
          <h2>Pet Medical Records</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type of Service</th>
                <th>Veterinarian</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.service}</td>
                  <td>{record.vet}</td>
                  <td>
                    <Button variant="primary" onClick={() => { setSelectedRecord(record); setShowRecordModal(true); }}>
                      View
                    </Button>
                    <Button variant="success" onClick={() => handleDownload(record)}>
                      Download
                    </Button>
                    <Button variant="warning" onClick={() => handleEmail(record)}>
                      Share via Email
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Prescription Refills View */}
      {activeView === 'prescriptions' && (
        <div>
          <h2>Prescription Refills</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Prescription</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td>{prescription.name}</td>
                  <td>{prescription.status}</td>
                  <td>${prescription.price.toFixed(2)}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleRequestRefill(prescription)}>
                      Request Refill
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal for Viewing Medical Record */}
      {selectedRecord && (
        <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Record Details for {selectedRecord.service}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info">Contact Us: {selectedRecord.vet}</Alert>
            <h5>Report</h5>
            <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRecordModal(false)}>
              Close
            </Button>
            <Button variant="success" onClick={() => handleDownload(selectedRecord)}>
              Download PDF
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal for Prescription Refill */}
      {selectedPrescription && (
        <Modal show={showPrescriptionModal} size="lg" centered style={{maxHeight: '80vh', overflowY: 'auto', margin: 'auto' }} onHide={() => setShowPrescriptionModal(false)}>
        <Modal.Header closeButton style={{ borderBottom: "none", paddingBottom: "0" }}>
        <Modal.Title style={{ fontWeight: "bold", fontSize: "1.8rem", color: "#343a40", marginBottom: "0.5rem" }}>
            Refill Prescription: <span className="text-info">{selectedPrescription.name}</span>
        </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Select Pharmacy</Form.Label>
              <Form.Control as="select" className="rounded border border-info" style={{ padding: "0.6rem", fontSize: "1rem" }}>
                  <option>Pharmacy 1</option>
                  <option>Pharmacy 2</option>
                </Form.Control>
              </Form.Group>
              <h4 className="mt-4" style={{ fontWeight: "bold", color: "#495057" }}>Payment Details</h4>
              <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="Enter your 16-digit card number"
                  maxLength="16"
                  required
                  className="rounded border border-info"
                  style={{ padding: "0.6rem", fontSize: "1rem" }}
                />
                 {errors.cardNumberError && (
                <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {errors.cardNumberError}
                </div>
                  )}
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Expiry Date (MM/YY)</Form.Label>
                    <Form.Control
                      type="text"
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      required
                      className="rounded border border-info"
                      style={{ padding: "0.6rem", fontSize: "1rem" }}
                    />
                      {errors.expiryDateError && (
                    <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {errors.expiryDateError}
                    </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>CVV</Form.Label>
                    <Form.Control
                      type="text"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentChange}
                      placeholder="Enter 3-digit CVV"
                      maxLength="3"
                      required
                      className="rounded border border-info"
                      style={{ padding: "0.6rem", fontSize: "1rem" }}
                    />
                    {errors.cvvError && (
                    <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {errors.cvvError}
                    </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body> 
          <Modal.Footer className="d-flex justify-content-between" style={{ borderTop: "none", paddingTop: "0" }}>
          <Button variant="outline-secondary" className="rounded-pill" style={{ padding: "0.5rem 1.5rem", fontSize: "1rem" }} onClick={() => setShowPrescriptionModal(false)}>
              Cancel
            </Button>
          <Button variant="outline-success" className="rounded-pill" style={{ padding: "0.5rem 1.5rem", fontSize: "1rem", borderColor: "#28a745" }} onClick={handlePayment}>
              Pay ${selectedPrescription.price.toFixed(2)}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default VetCareDashboard;
