package au.edu.rmit.sept.webapp.repository;

import au.edu.rmit.sept.webapp.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
}
