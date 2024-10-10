package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Transaction;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.service.TransactionService;
import au.edu.rmit.sept.webapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    // Get the list of transactions by userId
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
        // If there are no transactions, don't build the response entity
        if (transactions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(transactions);
    }
}
