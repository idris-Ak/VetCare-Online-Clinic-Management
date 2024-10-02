package au.edu.rmit.sept.webapp.service;

import au.edu.rmit.sept.webapp.model.Payment;
import au.edu.rmit.sept.webapp.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // Record a successful payment
    public Payment recordPayment(String paymentMethod, String transactionId, double amount) {
        Payment transaction = new Payment(paymentMethod, transactionId, "SUCCESS", amount,
                new Date());
        return paymentRepository.save(transaction);
    }

    // Record a failed payment
    public Payment recordFailedPayment(String paymentMethod, String transactionId, double amount) {
        Payment transaction = new Payment(paymentMethod, transactionId, "FAILED", amount,
                new Date());
        return paymentRepository.save(transaction);
    }
}
