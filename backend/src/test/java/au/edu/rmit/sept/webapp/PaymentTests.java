package au.edu.rmit.sept.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import au.edu.rmit.sept.webapp.model.Appointment;
import au.edu.rmit.sept.webapp.service.AppointmentService;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PaymentTests {

    @MockBean
    private Appointments appointments;
    private PaymentService paymentService;
    private Pet pet;
    private Clinic clinic;

    @BeforeEach
    public void setup() {
        appointments = new Appointments();
        paymentService = new PaymentService();
        pet = new Pet("Dog");
        clinic = new Clinic(1, "Test Clinic");

        appointments.setSelectedPet(pet);
        appointments.setSelectedClinic(clinic);
        appointments.setSelectedDay(21);
        appointments.setSelectedTime("10:00");
    }

    @Test
    public void successfulPaymentTest() {
        PaymentDetails paymentDetails = new PaymentDetails("1234567812345678", "12/25", "123");
        boolean paymentResult = paymentService.processPayment(paymentDetails, 50.00);
        assertTrue(paymentResult, "Payment should be processed successfully.");

        appointments.finalizeAppointmentBooking();
        assertTrue(appointments.getAppointments().containsKey("Dog-2024-9-21-10:00-1"), "Appointment should be booked after successful payment.");
    }

    @Test
    public void paymentWithInvalidCardDetailsTest() {
        PaymentDetails paymentDetails = new PaymentDetails("invalid-card", "12/25", "123");
        boolean paymentResult = paymentService.processPayment(paymentDetails, 50.00);
        assertFalse(paymentResult, "Payment should fail with invalid card details.");

        // Appointment should not be booked
        assertFalse(appointments.getAppointments().containsKey("Dog-2024-9-21-10:00-1"), "Appointment should not be booked when payment fails.");
    }

    @Test
    public void paymentWithExpiredCardTest() {
        PaymentDetails paymentDetails = new PaymentDetails("1234567812345678", "01/20", "123"); // Expired card
        boolean paymentResult = paymentService.processPayment(paymentDetails, 50.00);
        assertFalse(paymentResult, "Payment should fail with expired card.");

        // Appointment should not be booked
        assertFalse(appointments.getAppointments().containsKey("Dog-2024-9-21-10:00-1"));
    }

    @Test
    public void paymentWithInsufficientFundsTest() {
        PaymentDetails paymentDetails = new PaymentDetails("1234567812345678", "12/25", "123");
        paymentService.setCardBalance("1234567812345678", 30.00); // Set balance less than amount

        boolean paymentResult = paymentService.processPayment(paymentDetails, 50.00);
        assertFalse(paymentResult, "Payment should fail due to insufficient funds.");

        // Appointment should not be booked
        assertFalse(appointments.getAppointments().containsKey("Dog-2024-9-21-10:00-1"));
    }

    @Test
    public void paymentCancellationTest() {
        // Simulate payment cancellation
        PaymentDetails paymentDetails = new PaymentDetails("1234567812345678", "12/25", "123");
        boolean paymentResult = paymentService.processPayment(paymentDetails, 50.00, true); // 'true' indicates cancellation
        assertFalse(paymentResult, "Payment should be cancelled by the user.");

        // Appointment should not be booked
        assertFalse(appointments.getAppointments().containsKey("Dog-2024-9-21-10:00-1"));
    }

    @Test
    public void paypalPaymentSuccessTest() {
        // Simulate successful PayPal payment
        boolean paymentResult = paymentService.processPayPalPayment("PAYPAL_TRANSACTION_ID");
        assertTrue(paymentResult, "PayPal payment should be processed successfully.");

        appointments.finalizeAppointmentBooking();
        assertTrue(appointments.getAppointments().containsKey("Dog-2024-9-21-10:00-1"), "Appointment should be booked after successful PayPal payment.");
    }

    @Test
    public void paypalPaymentCancellationTest() {
        // Simulate PayPal payment cancellation
        boolean paymentResult = paymentService.processPayPalPayment("PAYPAL_TRANSACTION_ID", true); // 'true' indicates cancellation
        assertFalse(paymentResult, "PayPal payment should be cancelled by the user.");

        // Appointment should not be booked
        assertFalse(appointments.getAppointments().containsKey("Dog-2024-9-21-10:00-1"));
    }
}
