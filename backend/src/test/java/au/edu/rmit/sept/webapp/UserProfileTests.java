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
        user = new User("John Smith", "john@example.com", "Password123!", "Pet Owner");
    }

    @Test
    public void testUserUpdateProfile() {
        // Mock user update
        Mockito.when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        Mockito.when(userRepository.save(user)).thenReturn(user);

        // Set a different name
        user.setName("Jane Smith");
        User updatedUser = userService.saveUser(user);

        // Verify the new name is set
        assertEquals("Jane Smith", updatedUser.getName());
    }

    @Test
    public void testUserPasswordUpdate() {
        // Mock password update
        Mockito.when(passwordEncoder.encode("NewPassword123!")).thenReturn("hashedNewPassword");

        // Set a new password and hash it
        user.setPassword(passwordEncoder.encode("NewPassword123!"));
        Mockito.when(userRepository.save(user)).thenReturn(user);

        // Verify the new password is hashed and has been updated
        User updatedUser = userService.saveUser(user);
        assertEquals("hashedNewPassword", updatedUser.getPassword());
    }

    @Test
    public void testRemoveProfilePicture() {
        // Remove profile picture
        user.setProfilePicture("some-image-data");
        Mockito.when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        // Set the profile picture to null
        user.setProfilePicture(null);
        Mockito.when(userRepository.save(user)).thenReturn(user);


        // Verify the profile picture is removed
        User updatedUser = userService.saveUser(user);
        assertNull(updatedUser.getProfilePicture(), "Profile picture should be removed.");
    }

    @Test
    public void testDeleteUserAccount() {
        // Mock user deletion
        Mockito.when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        userService.deleteUser(user.getId());

        // Verify the user has been deleted
        Mockito.verify(userRepository, Mockito.times(1)).deleteById(user.getId());
    }
}
