package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true") // Establish a connection with the frontend
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody User user) {
        Optional<User> existingUser = userService.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(409).build(); // Email already exists
        }
        User savedUser = userService.signUp(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        Optional<User> user = userService.findByEmail(loginRequest.getEmail());
        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Update user profile
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture)
            throws IOException {

        Optional<User> existingUser = userService.findById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (profilePicture != null && !profilePicture.isEmpty()) {
                String base64Image = Base64.getEncoder().encodeToString(profilePicture.getBytes());
                user.setProfilePicture(base64Image); // Update profile picture
            }

            User savedUser = userService.signUp(user);
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{userId}/profilePicture")
    public ResponseEntity<User> removeProfilePicture(@PathVariable Long userId) {
        Optional<User> existingUser = userService.findById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setProfilePicture(null); // Remove the profile picture from the user
            User savedUser = userService.saveUser(user); // Save the updated user
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete user profile
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        Optional<User> existingUser = userService.findById(userId);
        if (existingUser.isPresent()) {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
