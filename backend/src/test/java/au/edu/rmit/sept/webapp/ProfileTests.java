package au.edu.rmit.sept.webapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.service.UserService;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProfileTests {

    @MockBean
    private UserService userService;

    private User user;

    @BeforeEach
    public void setup() {
        user = new User("Jane Smith", "jane@example.com", "Password123", "Pet Owner");
        user.setProfilePicture("frontend/src/components/assets/profilepic.png");
    }

    @Test
    public void testProfilePictureUpdate() {
        // Simulate a profile picture update
        user.setProfilePicture("newprofilepic.png");
        Mockito.when(userService.updateUser(user)).thenReturn(user);

        User updatedUser = userService.updateUser(user);
        assertEquals("newprofilepic.png", updatedUser.getProfilePicture(), "Profile picture should be updated.");
    }

    @Test
    public void testAddNewPetProfile() {
        // Simulate adding a new pet profile
        user.addPet("Buddy", "Dog", "Labrador", 2, "dogpic.png");
        Mockito.when(userService.updateUser(user)).thenReturn(user);

        User updatedUser = userService.updateUser(user);
        assertEquals(1, updatedUser.getPets().size(), "User should have one pet.");
        assertEquals("Buddy", updatedUser.getPets().get(0).getName(), "Pet name should be Buddy.");
    }

    @Test
    public void testDeleteAccount() {
        // Simulate account deletion
        Mockito.doNothing().when(userService).deleteUser("jane@example.com");
        userService.deleteUser("jane@example.com");

        Mockito.verify(userService, Mockito.times(1)).deleteUser("jane@example.com");
    }
}
