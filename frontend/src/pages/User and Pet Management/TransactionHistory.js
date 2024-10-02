import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TransactionHistory({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return; // Ensure user is defined before making the API request

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/transactions/user/${user.id}`);
        if (!response.ok) {
          throw new Error('Error fetching transactions');
        }
         // Check if the response body is not empty before parsing
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          setTransactions(data);
        } else {
          setTransactions([]); // Empty array when no transactions exist
        }
      } catch (err) {
        setError('Failed to load transaction history. Please try again.');
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (!user) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="text-center">User not logged in. Please log in to view transaction history.</Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">{error}</Alert>
      </Container>
    );
  }

// Function to format date with local time
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  return (
    <Container style={{ marginTop: '100px', marginBottom: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: '700', color: '#333' }}>Transaction History</h2>
        <Button variant="outline-primary" onClick={() => navigate('/myprofile')} className="mb-3">
            Back To Profile
      </Button>
        </div>
      <hr />

      {transactions.length === 0 ? (
        <Alert variant="info" className="text-center">No transaction history available.</Alert>
      ) : (
        <div>
        {transactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="my-4 p-4"
              style={{
                borderRadius: '15px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                backgroundColor: '#f9f9f9',
                borderColor: '#ddd'
              }}
            >
               <Row className="align-items-center">
                <Col lg={4} md={6} sm={12} className="mb-3 mb-lg-0">
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#555' }}>
                    <span style={{ color: '#007bff' }}>Service:</span> {transaction.serviceType}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#888' }}>
                    <span>Pet: {transaction.petName}</span>
                  </div>
                </Col>

                <Col lg={4} md={6} sm={12} className="mb-3 mb-lg-0">
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#555' }}>
                    <span style={{ color: '#28a745' }}>Amount:</span> ${transaction.amount.toFixed(2)}
                  </div>
                </Col>

                <Col lg={4} md={6} sm={12} className="mb-3 mb-lg-0">
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#555' }}>
                    <span>Date & Time:</span> {formatDateTime(transaction.dateTime)}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#6f42c1' }}>
                    Payment Method: {transaction.paymentMethod}
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

export default TransactionHistory;
