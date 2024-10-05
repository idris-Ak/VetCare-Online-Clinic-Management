package au.edu.rmit.sept.webapp;

import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.repository.UserRepository;
import au.edu.rmit.sept.webapp.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.profiles.active=test")
public class UserProfileTests {

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    private User user;

    @BeforeEach
    public void setup() {
        user = new User("John Doe", "john@example.com", "Password123!", "Pet Owner");
    }

    @Test
    public void testUserUpdateProfile() {
        // Mock user update
        Mockito.when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        Mockito.when(userRepository.save(user)).thenReturn(user);

        user.setName("Jane Doe");
        User updatedUser = userService.saveUser(user);

        assertEquals("Jane Doe", updatedUser.getName());
    }

    @Test
    public void testInvalidEmailForVet() {
        // Invalid email test for vet role
        user.setRole("Vet");
        user.setEmail("john@notvet.com");
        assertFalse(user.getEmail().endsWith("@vetcare.com"), "Expected vet email validation to fail.");
    }

    @Test
    public void testUserPasswordUpdate() {
        // Mock password update
        Mockito.when(passwordEncoder.encode("NewPassword123!")).thenReturn("hashedNewPassword");
        user.setPassword(passwordEncoder.encode("NewPassword123!"));
        Mockito.when(userRepository.save(user)).thenReturn(user);

        User updatedUser = userService.saveUser(user);
        assertEquals("hashedNewPassword", updatedUser.getPassword());
    }

    @Test
    public void testRemoveProfilePicture() {
        // Remove profile picture
        user.setProfilePicture("some-image-data");
        Mockito.when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        user.setProfilePicture(null);
        Mockito.when(userRepository.save(user)).thenReturn(user);

        User updatedUser = userService.saveUser(user);
        assertNull(updatedUser.getProfilePicture(), "Profile picture should be removed.");
    }

    @Test
    public void testDeleteUserAccount() {
        // Mock user deletion
        Mockito.when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        userService.deleteUser(user.getId());

        Mockito.verify(userRepository, Mockito.times(1)).deleteById(user.getId());
    }
}
