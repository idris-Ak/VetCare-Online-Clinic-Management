import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from "react-router-dom";

function PaymentSuccess() {

  return (
    <Container className="text-center mt-5">
     <div className="summary-confirmation-message">
      {/*<a href="https://www.flaticon.com/free-icons/yes" title="yes icons">Yes icons created by hqrloveq - Flaticon</a> */}
        <img src="check.png" alt="order-complete" style={{height: '200px', width:'200px', margin: '20px auto'}}></img>
        <p style={{fontSize: '20px', color: '#495057', fontFamily: '"Open Sans", sans-serif', marginTop: '20px'}}>Your order is complete. Thank you for shopping with us!</p>
      </div>
      <Link style={{textDecoration: 'none'}} to="/" ><button className="summary-back-btn" >Back To Home</button></Link>
    </Container>
  );
}

export default PaymentSuccess;
