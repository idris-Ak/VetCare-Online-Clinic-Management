package au.edu.rmit.sept.webapp;

import au.edu.rmit.sept.webapp.model.Payment;
import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.Transaction;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.service.PaymentService;
import au.edu.rmit.sept.webapp.service.PetService;
import au.edu.rmit.sept.webapp.service.TransactionService;
import au.edu.rmit.sept.webapp.service.UserService;
import au.edu.rmit.sept.webapp.controller.PaymentController;
import au.edu.rmit.sept.webapp.controller.TransactionController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = "spring.profiles.active=test")
class PaymentTests {

    @InjectMocks
    private PaymentController paymentController;

    @InjectMocks
    private TransactionController transactionController; 

    @Mock
    private PaymentService paymentService;

    @Mock
    private UserService userService;

    @Mock
    private PetService petService;

    @Mock
    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testHandlePayPalPaymentSuccess() {
        // Set the PayPal payment data
        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("orderId", "valid-order-id");
        paymentData.put("amount", 50.00);

        User user = new User();
        user.setId(1L); // Set userId
        Pet pet = new Pet();
        pet.setId(1L); // Set petId
        pet.setName("Goatie");

        Payment mockPayment = new Payment(); // Mock Payment model constructor
        mockPayment.setTransactionId("valid-order-id"); // Ensure transactionId is set
        mockPayment.setAmount(50.00); // Set other fields

        Transaction mockTransaction = new Transaction(); // Mock Transaction model constructor
        mockTransaction.setId(1001L); // Set a valid transaction ID
        mockTransaction.setAmount(50.00);

        when(userService.findById(1L)).thenReturn(Optional.of(user));
        when(petService.findById(1L)).thenReturn(Optional.of(pet));
        when(paymentService.recordPayment(anyString(), anyString(), anyDouble())).thenReturn(mockPayment);
        when(transactionService.saveTransaction(any(Transaction.class))).thenReturn(mockTransaction);

        // Handle PayPal payment
        ResponseEntity<Map<String, String>> response = paymentController.handlePayPalPayment(paymentData, 1L, 1L, "prescription");

        // Verify the right messages are outputted and the transaction is saved
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().containsKey("message"));
        assertEquals("PayPal payment successful", response.getBody().get("message"));
        verify(transactionService, times(1)).saveTransaction(any(Transaction.class));
    }

    @Test
    public void testHandlePayPalPaymentMissingOrderId() {
        // Set no orderId
        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("amount", 50.00);

        // Handle PayPal payment
        ResponseEntity<Map<String, String>> response = paymentController.handlePayPalPayment(paymentData, 1L, 1L, "prescription");

        // Verify a bad request is outputted and the transaction is not saved
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid PayPal payment details", response.getBody().get("error"));
        verify(transactionService, times(0)).saveTransaction(any(Transaction.class));
    }

    @Test
    public void testHandlePayPalPaymentInvalidServiceType() {
        // Set the PayPal payment data
        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("orderId", "valid-order-id");
        paymentData.put("amount", 50.00);

        // Enter an invalid service for the PayPal payment
        ResponseEntity<Map<String, String>> response = paymentController.handlePayPalPayment(paymentData, 1L, 1L, "invalid_service");

        // Verify that a bad request and error message is outputted
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid service type", response.getBody().get("error"));
    }

    @Test
    public void testHandleCreditCardPaymentSuccess() {
        // Set the Credit/Debit card payment data
        Map<String, Object> paymentDetails = new HashMap<>();
        paymentDetails.put("amount", 50.00);

        User user = new User();
        user.setId(1L); // Set userId
        Pet pet = new Pet();
        pet.setId(1L); // Set petId
        pet.setName("Goatie");

        Payment mockPayment = new Payment();
        mockPayment.setTransactionId("valid-order-id"); // Ensure transactionId is set
        mockPayment.setAmount(50.00); // Set other fields

        Transaction mockTransaction = new Transaction();
        mockTransaction.setId(1002L); // Set a valid ID
        mockTransaction.setAmount(50.00); // Ensure that the amount is set

        // Mock the functions to record the payment and save the transaction
        when(userService.findById(1L)).thenReturn(Optional.of(user));
        when(petService.findById(1L)).thenReturn(Optional.of(pet));
        when(paymentService.recordPayment(anyString(), anyString(), anyDouble())).thenReturn(mockPayment);
        when(transactionService.saveTransaction(any(Transaction.class))).thenReturn(mockTransaction);

        // Handle Credit/Debit card payment
        ResponseEntity<Map<String, String>> response = paymentController.handleCreditCardPayment(paymentDetails, 1L, 1L, "prescription");

        // Verify the payment is successful and the transaction has been saved
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().containsKey("message"));
        assertEquals("Credit/Debit card payment successful", response.getBody().get("message"));
        verify(transactionService, times(1)).saveTransaction(any(Transaction.class));
    }

    @Test
    public void testHandleCreditCardPaymentNegativeAmount() {
        // Set a negative amount
        Map<String, Object> paymentDetails = new HashMap<>();
        paymentDetails.put("amount", -50.00);

        // Handle Credit/Debit card payment
        ResponseEntity<Map<String, String>> response = paymentController.handleCreditCardPayment(paymentDetails, 1L, 1L, "prescription");

        // Verify a bad request and error message is outputted
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Amount must be greater than 0", response.getBody().get("error"));
    }

    @Test
    public void testHandleCreditCardPaymentInvalidAmountFormat() {
        // Set an invalid amount
        Map<String, Object> paymentDetails = new HashMap<>();
        paymentDetails.put("amount", "invalid-amount");

        // Handle Credit/Debit card payment
        ResponseEntity<Map<String, String>> response = paymentController.handleCreditCardPayment(paymentDetails, 1L, 1L, "prescription");

        // Verify a bad request and error message is outputted
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid amount format", response.getBody().get("error"));
    }

    @Test
    public void testGetTransactionsByUserIdSuccess() {
        User user = new User();
        user.setId(1L); // Set userId

        Transaction transaction = new Transaction();
        transaction.setAmount(50.00);
        transaction.setPetName("Goatie");

        // Fetch the list of transactions
        when(transactionService.getTransactionsByUserId(1L)).thenReturn(List.of(transaction));

        // Get the response
        ResponseEntity<List<Transaction>> response = transactionController.getTransactionsByUserId(1L);
                                                                                                
        // Verify the transaction is fetched
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(50.00, response.getBody().get(0).getAmount());
    }

    @Test
    public void testGetTransactionsByUserIdNoTransactionsFound() {
        // Fetch an empty list
        when(transactionService.getTransactionsByUserId(1L)).thenReturn(List.of());

        // Get the response
        ResponseEntity<List<Transaction>> response = transactionController.getTransactionsByUserId(1L);
                                                                                                
        // Verify there is no content
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}
