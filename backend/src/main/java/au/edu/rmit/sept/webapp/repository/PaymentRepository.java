package au.edu.rmit.sept.webapp.repository;

import au.edu.rmit.sept.webapp.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
