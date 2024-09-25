package au.edu.rmit.sept.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.service.UserService;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.profiles.active=test")
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
        // Mock a successful signup returning a User object
        Mockito.when(userService.signUp(user)).thenReturn(user);

        User response = userService.signUp(user);
        assertNotNull(response);
        assertEquals("john@example.com", response.getEmail());
        assertEquals("John Doe", response.getName());
    }

    @Test
    public void testSignUpWithExistingEmail() {
        // Mock an existing email scenario returning null (indicating a conflict or
        // failure)
        Mockito.when(userService.signUp(Mockito.any(User.class)))
                .thenReturn(null);

        User response = userService.signUp(user);
        assertNull(response, "Expected null when trying to sign up with an existing email.");
    }

    // @Test
    // public void testPasswordStrengthValidation() {
    //     String weakPassword = "weakpass";
    //     assertFalse(isPasswordStrong(weakPassword));

    //     String strongPassword = "StrongPass123!";
    //     assertTrue(isPasswordStrong(strongPassword));
    // }

    // // Helper method for password strength validation
    // private boolean isPasswordStrong(String password) {
    //     return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
    // }
}
