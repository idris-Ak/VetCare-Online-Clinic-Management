package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Appointment;
import au.edu.rmit.sept.webapp.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long appointmentId) {
        Optional<Appointment> appointment = appointmentService.findById(appointmentId);
        if (appointment.isPresent()) {
            return ResponseEntity.ok(appointment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/book")
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest appointmentRequest) {

        Appointment appointment = new Appointment(
            appointmentRequest.getUserId(),
            appointmentRequest.getPetId(),
            appointmentRequest.getClinicId(),
            LocalDate.parse(appointmentRequest.getAppointmentDate()),
            appointmentRequest.getAppointmentTimeId()
        );

        Appointment savedAppointment = appointmentService.saveAppointment(appointment);
        return ResponseEntity.ok(savedAppointment);
    }

    @PutMapping("/{appointmentId}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long appointmentId,
            @RequestBody AppointmentRequest appointmentRequest) {

        Optional<Appointment> existingAppointment = appointmentService.findById(appointmentId);
        if (existingAppointment.isPresent()) {
            Appointment appointment = existingAppointment.get();
            appointment.setAppointmentDate(LocalDate.parse(appointmentRequest.getAppointmentDate()));
            appointment.setAppointmentTimeId(appointmentRequest.getAppointmentTimeId()); 

            Appointment updatedAppointment = appointmentService.saveAppointment(appointment);
            return ResponseEntity.ok(updatedAppointment);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(params = "userId")
    public List<Appointment> getAppointmentsByUserId(@RequestParam int userId) {
        return appointmentService.getAppointmentsByUserId(userId);
    }

    // DEFINE DTO TO MAP PAYLOAD OF REQUEST
    public static class AppointmentRequest {
        private int userId;
        private int petId;
        private int clinicId;
        private int appointmentTimeId;
        private String appointmentDate;

        // DEFINED GETTERS AND SETTERS
        public int getUserId() {
            return userId;
        }

        public void setUserId(int userId) {
            this.userId = userId;
        }

        public int getPetId() {
            return petId;
        }

        public void setPetId(int petId) {
            this.petId = petId;
        }

        public int getClinicId() {
            return clinicId;
        }

        public void setClinicId(int clinicId) {
            this.clinicId = clinicId;
        }

        public String getAppointmentDate() {
            return appointmentDate;
        }

        public void setAppointmentDate(String appointmentDate) {
            this.appointmentDate = appointmentDate;
        }

        public int getAppointmentTimeId() {
            return appointmentTimeId;
        }

        public void setAppointmentTimeId(int appointmentTimeId) { 
            this.appointmentTimeId = appointmentTimeId;
        }
    }
}
