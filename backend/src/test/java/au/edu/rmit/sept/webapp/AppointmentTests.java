package au.edu.rmit.sept.webapp;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.HashMap;
import java.util.Map;

@SpringBootTest
public class AppointmentTests {

    private Appointments appointments;

    @BeforeEach
    public void setup() {
        appointments = new Appointments();
    }

    @Test
    public void isDateInFutureTest() {
        assertTrue(appointments.isDateInFuture(2025, 5, 1), "2025-05-01 should be in the future");
        assertFalse(appointments.isDateInFuture(2023, 5, 1), "2023-05-01 should not be in the future");
        assertTrue(appointments.isDateInFuture(2024, 11, 1), "2024-11-01 should be in the future");
    }

    @Test
    public void clickCalendarWithPetSelectedTest() {
        appointments.setSelectedPet(new Pet("Dog"));
        appointments.setCurrentDate(new Date(2024, 9, 20));

        appointments.openDayModal(21);
        assertTrue(appointments.isShowModal(), "Modal should be shown for valid future dates with a pet selected");

        appointments.openDayModal(19);
        assertFalse(appointments.isShowModal(), "Modal should not be shown for past dates even with a pet selected");
    }

    @Test
    public void clickCalendarWithoutPetSelectedTest() {
        appointments.setSelectedPet(null);

        appointments.openDayModal(21);
        assertFalse(appointments.isShowModal(), "Modal should not be shown if no pet is selected");
    }

    @Test
    public void bookAppointmentWithNoClinicAndDateTest() {
        appointments.setSelectedTime("");
        appointments.setSelectedClinic(null);

        appointments.bookAppointment();
        assertFalse(appointments.isShowPaymentMethodModal(), "Payment modal should not be shown if time and clinic are not selected");
    }

    @Test
    public void bookAppointmentTest() {
        appointments.setSelectedPet(new Pet("Dog"));
        appointments.setSelectedDay(21);
        appointments.setSelectedClinic(new Clinic(1, "Test Clinic"));
        appointments.setSelectedTime("10:00");

        appointments.bookAppointment();
        assertTrue(appointments.isShowPaymentMethodModal(), "Payment modal should be shown if all booking details are valid");
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

        assertNull(appointments.getAppointments().get("Dog-2024-9-21-10:00-1"), "Appointment should be removed after cancellation");
        assertFalse(appointments.getHighlightedDays().containsKey(21), "Day should not be highlighted after appointment cancellation");
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

        assertEquals(1, appointments.getExistingAppointments("10:00").size(), "Should fetch existing appointment at 10:00");
        assertEquals(0, appointments.getExistingAppointments("11:00").size(), "Should not find any appointment at 11:00");
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
}
