package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Payment;
import au.edu.rmit.sept.webapp.model.Transaction;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.service.PaymentService;
import au.edu.rmit.sept.webapp.service.UserService;
import au.edu.rmit.sept.webapp.service.PetService;
import au.edu.rmit.sept.webapp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Autowired
    private PetService petService;

    @Autowired
    private TransactionService transactionService;

    // Handle PayPal Payment
    @PostMapping("/paypal")
    public ResponseEntity<Map<String, String>> handlePayPalPayment(@RequestBody Map<String, Object> paymentData, 
            @RequestParam Long userId, @RequestParam Long petId, @RequestParam String serviceType) {

        // Validate serviceType
        if (!serviceType.equals("Prescription Refill") && !serviceType.equals("Appointment Booking")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid service type"));
        }

        String orderId = (String) paymentData.get("orderId");
        // Handle the amount conversion from Integer, Double, or String
        double amount;
        Object amountObj = paymentData.get("amount");

        if (amountObj instanceof Integer) {
            amount = ((Integer) amountObj).doubleValue();
        } else if (amountObj instanceof Double) {
            amount = (Double) amountObj;
        } else if (amountObj instanceof String) {
            try {
                amount = Double.parseDouble((String) amountObj);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount format"));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount format"));
        }

        if (orderId != null) {
            // Record successful PayPal transaction
            Payment transaction = paymentService.recordPayment("PayPal", orderId, amount);
            User currentUser = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Pet pet = petService.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));

            // Save the transaction in the transaction history
            Transaction newTransaction = new Transaction();
            newTransaction.setAmount(amount);
            newTransaction.setPetId(pet.getId()); // Store pet's ID
            newTransaction.setDateTime(LocalDateTime.now()); // Store date and time
            newTransaction.setUser(currentUser);
            newTransaction.setPaymentMethod("PayPal"); // Set payment method
            newTransaction.setServiceType(serviceType); // Save the service type
            transactionService.saveTransaction(newTransaction); // Save the transaction

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
    public ResponseEntity<Map<String, String>> handleCreditCardPayment(@RequestBody Map<String, Object> paymentDetails,
            @RequestParam Long userId, @RequestParam Long petId, @RequestParam String serviceType) {
        
        // Validate serviceType
        if (!serviceType.equals("Prescription Refill") && !serviceType.equals("Appointment Booking")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid service type"));
        }

        // Validate the amount
        double amount;
        if (paymentDetails.get("amount") instanceof Integer) {
            amount = ((Integer) paymentDetails.get("amount")).doubleValue();
        } else if (paymentDetails.get("amount") instanceof Double) {
            amount = (Double) paymentDetails.get("amount");
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount format"));
        }
        
        if (amount <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));
        }
        
            // Simulate successful payment
            Payment transaction = paymentService.recordPayment("Credit/Debit Card", "mock-transaction-id", amount);
            // Fetch the user and pet information
            User currentUser = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Pet pet = petService.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));

            // Save the transaction in the transaction history
            Transaction newTransaction = new Transaction();
            newTransaction.setAmount(amount);
            newTransaction.setPetId(pet.getId()); // Store pet's ID
            newTransaction.setDateTime(LocalDateTime.now()); // Store date and time
            newTransaction.setUser(currentUser);
            newTransaction.setPaymentMethod("Credit/Debit Card"); // Set payment method
            newTransaction.setServiceType(serviceType); // Save the service type

            transactionService.saveTransaction(newTransaction); // Save the transaction

            Map<String, String> response = new HashMap<>();
            response.put("message", "Credit/Debit card payment successful");
            response.put("transactionId", transaction.getTransactionId());
            return ResponseEntity.ok(response);
        }
}
