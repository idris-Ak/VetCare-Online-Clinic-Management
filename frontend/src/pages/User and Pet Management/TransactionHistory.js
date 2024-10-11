import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card, Spinner, Alert, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TransactionHistory({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Pagination: current page
  const [itemsPerPage] = useState(10); // Number of transactions per page
  const [searchTerm, setSearchTerm] = useState(''); // Single search term state
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

  // Filter transactions based on the single search input
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.petName.toLowerCase().includes(searchLower) ||
      transaction.serviceType.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchTerm) ||
      formatDateTime(transaction.dateTime).toLowerCase().includes(searchLower) ||
      transaction.paymentMethod.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container style={{ marginTop: '100px', marginBottom: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: '700', color: '#333' }}>Transaction History</h2>
        <Button variant="outline-primary" onClick={() => navigate('/myprofile')} className="mb-3">
            Back To Profile
      </Button>
        </div>
      <hr />

      {/* Search Bar */}
      <Form className="mb-4">
        <Form.Group controlId="searchBar">
          <InputGroup>
            <InputGroup.Text>
                <i className="fas fa-search" aria-hidden="true"></i>
            </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search transactions (pet name, service, amount, date/time, payment method)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          </InputGroup>
        </Form.Group>
      </Form>

      {filteredTransactions.length === 0 ? (
        <Alert variant="info" className="text-center">No transaction history available.</Alert>
      ) : (
        <div>
        {currentTransactions.map((transaction) => (
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
                    <span style={{ color: '#28a745' }}>Amount:</span> A${transaction.amount.toFixed(2)}
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

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination size="lg">
              <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </div>
      )}
    </Container>
  );
}

export default TransactionHistory;
