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
