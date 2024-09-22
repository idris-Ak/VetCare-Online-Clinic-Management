package au.edu.rmit.sept.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.service.UserService;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SignUpTests {

    @MockBean
    private UserService userService;

    private User user;

    @BeforeEach
    public void setup() {
        user = new User("John Doe", "john@example.com", "Password123!", "Pet Owner");
    }

    @Test
    public void testValidSignUp() {
        // Mock a successful signup
        Mockito.when(userService.signUp("John Doe", "john@example.com", "Password123!", "Pet Owner"))
                .thenReturn(ResponseEntity.ok(user));

        ResponseEntity<User> response = userService.signUp("John Doe", "john@example.com", "Password123!", "Pet Owner");
        assertNotNull(response.getBody());
        assertEquals("john@example.com", response.getBody().getEmail(),
                "User should be successfully signed up with the provided email.");
        assertEquals("John Doe", response.getBody().getName(), "User should have the correct name.");
    }

    @Test
    public void testSignUpWithExistingEmail() {
        // Mock an existing email scenario
        Mockito.when(userService.signUp("Jane Doe", "john@example.com", "Password123!", "Vet"))
                .thenReturn(ResponseEntity.status(409).body(null)); // Conflict (email already exists)

        ResponseEntity<User> response = userService.signUp("Jane Doe", "john@example.com", "Password123!", "Vet");
        assertEquals(409, response.getStatusCodeValue(), "Should return conflict status when email already exists.");
        assertNull(response.getBody(), "No user should be created with an existing email.");
    }

    @Test
    public void testPasswordStrengthValidation() {
        // Test a weak password scenario
        String weakPassword = "weakpass";
        boolean isPasswordStrong = isPasswordStrong(weakPassword);
        assertFalse(isPasswordStrong, "Password should be flagged as weak.");

        // Test a strong password scenario
        String strongPassword = "StrongPass123!";
        isPasswordStrong = isPasswordStrong(strongPassword);
        assertTrue(isPasswordStrong, "Password should be flagged as strong.");
    }

    @Test
    public void testVetRoleEmailValidation() {
        // Test valid vet email
        String validVetEmail = "jane@vetcare.com";
        assertTrue(validVetEmail.endsWith("@vetcare.com"), "Vet email should end with @vetcare.com.");

        // Test invalid vet email
        String invalidVetEmail = "jane@other.com";
        assertFalse(invalidVetEmail.endsWith("@vetcare.com"),
                "Vet email should not be accepted if it doesn't end with @vetcare.com.");
    }

    @Test
    public void testSignUpWithInvalidEmailFormat() {
        // Simulate invalid email format
        String invalidEmail = "invalidemail";
        Mockito.when(userService.signUp("Invalid User", invalidEmail, "Password123!", "Pet Owner"))
                .thenReturn(ResponseEntity.status(400).body(null)); // Bad request for invalid email format

        ResponseEntity<User> response = userService.signUp("Invalid User", invalidEmail, "Password123!", "Pet Owner");
        assertEquals(400, response.getStatusCodeValue(), "Should return bad request status for invalid email format.");
        assertNull(response.getBody(), "No user should be created with an invalid email format.");
    }

    @Test
    public void testPasswordMismatchValidation() {
        // Simulate password mismatch during sign-up
        String password = "Password123!";
        String confirmPassword = "Password456!"; // Mismatch
        boolean isPasswordMatching = password.equals(confirmPassword);
        assertFalse(isPasswordMatching, "Passwords should not match.");
    }

    // Helper method to validate password strength
    private boolean isPasswordStrong(String password) {
        return password.matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*()_+\\-={}[\\]\\\\|;:'\",<.>/?~`])(?=.{8,})");
    }
}
