package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Payment;
import au.edu.rmit.sept.webapp.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Handle PayPal Payment
    @PostMapping("/paypal")
    public ResponseEntity<Map<String, String>> handlePayPalPayment(@RequestBody Map<String, Object> paymentData) {
        String orderId = (String) paymentData.get("orderId");
        // Handle the amount conversion from Integer or Double
        double amount;
        if (paymentData.get("amount") instanceof Integer) {
            amount = ((Integer) paymentData.get("amount")).doubleValue();
        } else if (paymentData.get("amount") instanceof Double) {
            amount = (Double) paymentData.get("amount");
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount format"));
        }

        if (orderId != null) {
            // Record successful PayPal transaction
            Payment transaction = paymentService.recordPayment("PayPal", orderId, amount);
            Map<String, String> response = new HashMap<>();
            response.put("message", "PayPal payment successful");
            response.put("transactionId", transaction.getTransactionId());
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid PayPal payment details");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Simulate Credit/Debit Card Payment
    @PostMapping("/credit-card")
    public ResponseEntity<Map<String, String>> handleCreditCardPayment(@RequestBody Map<String, Object> paymentDetails) {
        String cardNumber = (String) paymentDetails.get("cardNumber");
        String expiryDate = (String) paymentDetails.get("expiryDate");
        String cvv = (String) paymentDetails.get("cvv");
        // Handle the amount conversion from Integer or Double
        double amount;
        if (paymentDetails.get("amount") instanceof Integer) {
            amount = ((Integer) paymentDetails.get("amount")).doubleValue();
        } else if (paymentDetails.get("amount") instanceof Double) {
            amount = (Double) paymentDetails.get("amount");
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount format"));
        }

        // Simulate validation
        if (cardNumber.length() == 19 && expiryDate.matches("\\d{2}/\\d{2}") && cvv.length() == 3) {
            // Simulate successful payment
            Payment transaction = paymentService.recordPayment("CreditCard", "mock-transaction-id", amount);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Credit/Debit card payment successful");
            response.put("transactionId", transaction.getTransactionId());
            return ResponseEntity.ok(response);
        } else {
            // Return error as JSON
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid payment details");
            return ResponseEntity.badRequest().body(errorResponse);        }
    }
}
