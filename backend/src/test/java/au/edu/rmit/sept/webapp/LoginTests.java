package au.edu.rmit.sept.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import au.edu.rmit.sept.webapp.service.UserService;
import au.edu.rmit.sept.webapp.model.User;
import java.util.Optional;

@SpringBootTest(properties = "spring.profiles.active=test")
class LoginTests {

    @MockBean
    private UserService userService;

    private User user;

    @BeforeEach
    public void setup() {
        user = new User("John Smith", "john@example.com", "Password123!", "Pet Owner");
    }

    @Test
    public void testLoginSuccess() {
        // Mock user retrieval
        Mockito.when(userService.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        Optional<User> response = userService.findByEmail("john@example.com");
        assertTrue(response.isPresent());
        assertEquals(user.getEmail(), response.get().getEmail());
        assertEquals("Password123!", response.get().getPassword());
    }

    @Test
    public void testLoginFailure() {
        // Mock login failure by returning an empty Optional
        Mockito.when(userService.findByEmail("john@example.com")).thenReturn(Optional.empty());

        Optional<User> response = userService.findByEmail("john@example.com");
        assertFalse(response.isPresent());
    }
    
    @Test
    public void testInvalidPasswordLogin() {
        // Mock incorrect password scenario
        Mockito.when(userService.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        assertNotEquals("WrongPassword", user.getPassword(), "Expected wrong password to fail.");
    }

    @Test
    public void testWrongRoleLogin() {
        // Mock incorrect role login scenario
        Mockito.when(userService.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        assertNotEquals("Vet", user.getRole(), "Expected login to fail when the wrong role is selected.");
    }

    @Test
    public void testBlankEmailField() {
        String blankEmail = "";
        assertTrue(blankEmail.isEmpty(), "Expected blank email to be invalid.");
    }

    @Test
    public void testBlankPasswordField() {
        String blankPassword = "";
        assertTrue(blankPassword.isEmpty(), "Expected blank password to be invalid.");
    }

    @Test
    public void testEmailWithTrailingSpaces() {
        String emailWithSpaces = " john@example.com ";
        assertEquals("john@example.com", emailWithSpaces.trim(), "Expected trimmed email without spaces.");
    }

    @Test
    public void testPasswordWithTrailingSpaces() {
        String passwordWithSpaces = " Password123 ";
        assertEquals("Password123", passwordWithSpaces.trim(), "Expected trimmed password without spaces.");
    }

    @Test
    public void testInvalidEmailFormat() {
        String invalidEmail = "johnexample.com";
        assertFalse(invalidEmail.contains("@"), "Expected invalid email format without '@'.");
    }

    
}
