import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.HashMap;
import java.util.Map;

public class AppointmentTests {

    private Appointments appointments;
    
    @BeforeEach
    public void setup() {
        appointments = new Appointments();
    }

    @Test
    public void isDateInFutureTest() {
        assertTrue(appointments.isDateInFuture(2025, 5, 1));  
        assertFalse(appointments.isDateInFuture(2023, 5, 1)); 
        assertTrue(appointments.isDateInFuture(2024, 11, 1)); 
    }

    @Test
    public void clickCalanderWithPetSelectedTest() {
       
        appointments.setSelectedPet(new Pet("Dog"));
        appointments.setCurrentDate(new Date(2024, 9, 20));
        
       
        appointments.openDayModal(21); 
        assertTrue(appointments.isShowModal());  

       
        appointments.openDayModal(19);  
        assertFalse(appointments.isShowModal());
    }

    @Test
    public void clickCalanderWithoutPetSelectedTest() {
        
        appointments.setSelectedPet(null);
        
       
        appointments.openDayModal(21);  
        assertFalse(appointments.isShowModal()); 
    }

    @Test
    public void bookAppointmentWithNoClinicAndDateTest() {
        appointments.setSelectedTime("");
        appointments.setSelectedClinic(null);
        
       
        appointments.bookAppointment();
        assertFalse(appointments.isShowPaymentMethodModal()); 
    }

    @Test
    public void bookAppointmentTest() {
        appointments.setSelectedPet(new Pet("Dog"));
        appointments.setSelectedDay(21);
        appointments.setSelectedClinic(new Clinic(1, "Test Clinic"));
        appointments.setSelectedTime("10:00");

        
        appointments.bookAppointment();
        assertTrue(appointments.isShowPaymentMethodModal()); 
    }

    @Test
    public void cancelAppointmentTest() {
        Pet pet = new Pet("Dog");
        appointments.setSelectedPet(pet);
        appointments.setSelectedClinic(new Clinic(1, "Test Clinic"));
        appointments.setSelectedDay(21);

        Map<String, Object> initialAppointments = new HashMap<>();
        initialAppointments.put("Dog-2024-9-21-10:00-1", new Appointment(pet, 1, "10:00", 21));

        appointments.setAppointments(initialAppointments);
        
       
        appointments.cancelAppointment("10:00");

       
        assertNull(appointments.getAppointments().get("Dog-2024-9-21-10:00-1"));

       
        assertFalse(appointments.getHighlightedDays().containsKey(21));
    }

    @Test
    public void fetchExistingAppointmentsTest() {
        Pet pet = new Pet("Dog");
        appointments.setSelectedPet(pet);
        appointments.setSelectedDay(21);
        appointments.setSelectedClinic(new Clinic(1, "Test Clinic"));
        
        Map<String, Object> initialAppointments = new HashMap<>();
        initialAppointments.put("Dog-2024-9-21-10:00-1", new Appointment(pet, 1, "10:00", 21));
        appointments.setAppointments(initialAppointments);

        
        assertEquals(1, appointments.getExistingAppointments("10:00").size());
        
   
        assertEquals(0, appointments.getExistingAppointments("11:00").size());
    }
}

public class PaymentTests {

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
