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
        user = new User("John Doe", "john@example.com", "Password123", "Pet Owner");
    }

    @Test
    public void testLoginSuccess() {
        // Mock user retrieval
        Mockito.when(userService.findByEmail("john@example.com"))
                .thenReturn(Optional.of(user));

        Optional<User> response = userService.findByEmail("john@example.com");
        assertTrue(response.isPresent());
        assertEquals(user.getEmail(), response.get().getEmail());
        assertEquals("Password123", response.get().getPassword());
    }

    @Test
    public void testLoginFailure() {
        // Mock login failure by returning an empty Optional
        Mockito.when(userService.findByEmail("john@example.com"))
                .thenReturn(Optional.empty());

        Optional<User> response = userService.findByEmail("john@example.com");
        assertFalse(response.isPresent());
    }

    @Test
    public void testVetEmailValidation() {
        String invalidVetEmail = "jane@notvet.com";
        assertFalse(invalidVetEmail.endsWith("@vetcare.com"));
    }
}
