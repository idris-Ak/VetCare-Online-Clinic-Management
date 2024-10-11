package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Transaction;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.service.TransactionService;
import au.edu.rmit.sept.webapp.service.UserService;
import au.edu.rmit.sept.webapp.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @Autowired
    private PetService petService;

    @GetMapping("/user/{userId}")
    // Get the list of transactions by userId
    public ResponseEntity<List<Map<String, Object>>> getTransactionsByUserId(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
        // If there are no transactions, don't build the response entity
        if (transactions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Prepare a list to hold transaction data with updated pet names
        List<Map<String, Object>> transactionList = new ArrayList<>();
        for (Transaction transaction : transactions) {
            Map<String, Object> transactionData = new HashMap<>();
            transactionData.put("id", transaction.getId());
            transactionData.put("amount", transaction.getAmount());
            transactionData.put("dateTime", transaction.getDateTime());
            transactionData.put("paymentMethod", transaction.getPaymentMethod());
            transactionData.put("serviceType", transaction.getServiceType());

            // Fetch the pet's current name using petId
            String petName = "Unknown Pet";
            if (transaction.getPetId() != null) {
                Optional<Pet> petOptional = petService.findById(transaction.getPetId());
                if (petOptional.isPresent()) {
                    petName = petOptional.get().getName();
                }
            }
            transactionData.put("petName", petName);

            transactionList.add(transactionData);
        }

        return ResponseEntity.ok(transactionList);
    }
}
