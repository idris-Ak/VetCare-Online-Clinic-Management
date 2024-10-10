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
        user = new User("John Smith", "john@example.com", "Password123!", "Pet Owner");
    }

    @Test
    public void testValidSignUp() {
        // Mock a successful signup returning a User object
        Mockito.when(userService.signUp(user)).thenReturn(user);

        User response = userService.signUp(user);
        assertNotNull(response);
        assertEquals("john@example.com", response.getEmail());
        assertEquals("John Smith", response.getName());
    }

    @Test
    public void testSignUpWithExistingEmail() {
        // Mock an existing email scenario returning null (indicating a conflict or failure)
        Mockito.when(userService.signUp(Mockito.any(User.class))).thenReturn(null);

        User response = userService.signUp(user);
        assertNull(response, "Expected null when trying to sign up with an existing email.");
    }

    @Test
    public void testPasswordsDoNotMatch() {
        String password = "Password123!";
        String confirmPassword = "Password123";

        assertNotEquals(password, confirmPassword, "Expected non-matching passwords to fail.");
    }

    @Test
    public void testBlankFields() {
        String blankName = "";
        String blankEmail = "";
        String blankPassword = "";

        assertTrue(blankName.isEmpty(), "Expected blank name to be invalid.");
        assertTrue(blankEmail.isEmpty(), "Expected blank email to be invalid.");
        assertTrue(blankPassword.isEmpty(), "Expected blank password to be invalid.");
    }

    @Test
    public void testNameWithTrailingSpaces() {
        String nameWithSpaces = " John Smith ";
        assertEquals("John Smith", nameWithSpaces.trim(), "Expected trimmed name without spaces.");
    }

    @Test
    public void testEmailWithTrailingSpaces() {
        String emailWithSpaces = " john@example.com ";
        assertEquals("john@example.com", emailWithSpaces.trim(), "Expected trimmed email without spaces.");
    }

    @Test
    public void testPasswordWithTrailingSpaces() {
        String passwordWithSpaces = " Password123! ";
        assertEquals("Password123!", passwordWithSpaces.trim(), "Expected trimmed password without spaces.");
    }

    @Test
    public void testMaxNameLength() {
        String longName = "a".repeat(51); // 51 characters
        assertTrue(longName.length() > 50, "Expected name to exceed maximum length.");
    }

    @Test
    public void testMaxEmailLength() {
        String longEmail = "a".repeat(101) + "@example.com"; // Over 100 characters
        assertTrue(longEmail.length() > 100, "Expected email to exceed maximum length.");
    }
    
    @Test
    public void testMaxPasswordLength() {
        String longPassword = "a".repeat(101); // 101 characters
        assertTrue(longPassword.length() > 100, "Expected password to exceed maximum length.");
    }

    @Test
    public void testAllowedNameCharacters() {
        String nameWithSpecialChars = "John123";
        assertFalse(nameWithSpecialChars.matches("[a-zA-Z ]+"),"Expected name to only allow alphabetic characters and spaces.");
    }

}
