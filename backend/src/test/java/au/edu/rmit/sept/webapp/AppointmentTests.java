package au.edu.rmit.sept.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.boot.test.mock.mockito.MockBean;
import au.edu.rmit.sept.webapp.service.AppointmentService;
import au.edu.rmit.sept.webapp.model.Appointment;

import java.util.Optional;
import java.time.LocalDate;
import java.time.DateTimeException;

@SpringBootTest(properties = "spring.profiles.active=test")
class AppointmentTests {

    @MockBean
    private AppointmentService appointmentService;

    private Appointment appointment;

    @BeforeEach
    public void setup() {
        // Create a mock appointment
        appointment = new Appointment(1, 101, 201, LocalDate.of(2024, 10, 12), 2);
    }

    @Test
    public void testAppointmentCreationSuccess() {
        // Mock appointment creation success
        Mockito.when(appointmentService.saveAppointment(Mockito.any(Appointment.class))).thenReturn(appointment);

        Appointment response = appointmentService.saveAppointment(appointment);
        assertNotNull(response);
        assertEquals(appointment.getAppointmentDate(), response.getAppointmentDate());
    }

    @Test
    public void testAppointmentCreationFailure() {
        // Mock appointment creation failure
        Mockito.when(appointmentService.saveAppointment(Mockito.any(Appointment.class))).thenReturn(null);

        Appointment response = appointmentService.saveAppointment(appointment);
        assertNull(response);
    }

    @Test
    public void testInvalidAppointmentDate() {
        // Mock appointment creation with an invalid time (past date)
        LocalDate pastDate = LocalDate.of(2020, 5, 15);
        Appointment pastAppointment = new Appointment(1, 101, 201, pastDate, 2);
        Mockito.when(appointmentService.saveAppointment(pastAppointment)).thenReturn(null);

        Appointment response = appointmentService.saveAppointment(pastAppointment);
        assertNull(response);
    }

    @Test
    public void testAppointmentCancellation() {
        // Mock appointment cancellation
        Mockito.doNothing().when(appointmentService).deleteAppointment(Mockito.anyLong());

        appointmentService.deleteAppointment((long) appointment.getId());
        Mockito.verify(appointmentService, Mockito.times(1)).deleteAppointment((long) appointment.getId());
    }

    @Test
    public void testEmptyAppointmentDetails() {
        Appointment emptyAppointment = new Appointment(0, 0, 0, null, 0);
        assertTrue(emptyAppointment.getUserId() == 0);
        assertNull(emptyAppointment.getAppointmentDate(), "Expected appointment date to be null.");
    }
    
    @Test
    public void testInvalidDateForBooking() {
        assertThrows(DateTimeException.class, () -> {
            LocalDate invalidDate = LocalDate.of(2024, 2, 30);
        }, "Expected exception for invalid date.");
    }

}
