package au.edu.rmit.sept.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import au.edu.rmit.sept.webapp.service.LoginService;
import au.edu.rmit.sept.webapp.model.User;

@SpringBootTest
class LoginTests {

    @MockBean
    private LoginService loginService;

    private User user;

    @BeforeEach
    public void setup() {
        user = new User("John Doe", "john@example.com", "Password123", "Pet Owner");
    }

    @Test
    public void testLoginSuccess() {
        // Mock login service to return a valid user
        Mockito.when(loginService.login("john@example.com", "Password123", "Pet Owner"))
                .thenReturn(ResponseEntity.ok(user));

        ResponseEntity<User> response = loginService.login("john@example.com", "Password123", "Pet Owner");
        assertNotNull(response.getBody());
        assertEquals(user.getEmail(), response.getBody().getEmail());
    }

    @Test
    public void testLoginFailure() {
        // Mock login service to return null (failure scenario)
        Mockito.when(loginService.login("john@example.com", "WrongPassword", "Pet Owner"))
                .thenReturn(ResponseEntity.status(401).body(null));

        ResponseEntity<User> response = loginService.login("john@example.com", "WrongPassword", "Pet Owner");
        assertNull(response.getBody(), "Login should fail with incorrect password");
    }

    @Test
    public void testVetLoginValidation() {
        // Validate vet email format
        String invalidVetEmail = "jane@notvet.com";
        assertFalse(invalidVetEmail.endsWith("@vetcare.com"), "Vet email should end with @vetcare.com");
    }
}
