package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.model.Transaction;
import au.edu.rmit.sept.webapp.service.UserService;
import au.edu.rmit.sept.webapp.service.ImageService;
import au.edu.rmit.sept.webapp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ImageService imageService; // ImageService for processing images

    @Autowired
    private PasswordEncoder passwordEncoder; // Password encoder for hashing user passwords using Bcrypt

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody User user) {
        // Find the user by email to check it doesn't already exist when signing up
        Optional<User> existingUser = userService.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(409).build(); // Email already exists
        }
        // Save the new user in the database
        User savedUser = userService.signUp(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        // Find the user by email
        Optional<User> user = userService.findByEmail(loginRequest.getEmail());
        if (user.isPresent()) {
            // Compare the entered password with the hashed password in the database
            if (passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
                return ResponseEntity.ok(user.get());
            }
        }
        return ResponseEntity.status(401).build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        // Find the user by userId
        Optional<User> user = userService.findById(userId);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update user profile
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture)
            throws IOException {

        Optional<User> existingUser = userService.findById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            
            // Update user fields if they are provided
            if (name != null) {
                user.setName(name.trim()); // Update the name, even if it's an empty string
            }
            if (email != null) {
                user.setEmail(email.trim()); // Update the email, even if it's an empty string
            }
            if (password != null) {
                // Hash the new password before saving it
                user.setPassword(passwordEncoder.encode(password));
            }

            if (profilePicture != null && !profilePicture.isEmpty()) {
                try {
                    // Process the profile picture image to ensure the file size is as minimal as it can be
                    String base64Image = imageService.processImage(profilePicture);
                    user.setProfilePicture(base64Image); // Store the Base64 image string in the database
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }

            User savedUser = userService.saveUser(user); // Save the updated user in the database
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.status(404).build();
    }

    // Update user profile picture 
    @PutMapping("/{userId}/profilePicture")
    public ResponseEntity<User> updateUserProfilePicture(
            @PathVariable Long userId,
            @RequestParam("profilePicture") MultipartFile profilePicture) {

        Optional<User> existingUser = userService.findById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (profilePicture != null && !profilePicture.isEmpty()) {
                try {
                    // Process the profile picture image to ensure the file size is as minimal as it can be
                    String base64Image = imageService.processImage(profilePicture);
                    user.setProfilePicture(base64Image); // Store the Base64 image string in the database
                    userService.saveUser(user); // Save the updated user in the database

                    return ResponseEntity.ok(user);

                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }

            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Delete user profile picture 
    @DeleteMapping("/{userId}/profilePicture")
    public ResponseEntity<User> removeProfilePicture(@PathVariable Long userId) {
        Optional<User> existingUser = userService.findById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setProfilePicture(null); // Remove the profile picture from the user
            User savedUser = userService.saveUser(user); // Save the updated user
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Delete user profile
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        Optional<User> existingUser = userService.findById(userId);
        // Check the user is present by userId so that the user can be deleted
        if (existingUser.isPresent()) {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/vetId/{userId}")
    public ResponseEntity<User> updateVetId(@PathVariable Long userId, @RequestBody Map<String, Long> vetData) {
        Long vetId = vetData.get("vetId");
        Optional<User> existingUser = userService.findById(userId);
    
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setVetId(vetId);  // Set the vetId for the user
            User updatedUser = userService.saveUser(user);  // Save the updated user in the database
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.status(404).build();
    }
}
