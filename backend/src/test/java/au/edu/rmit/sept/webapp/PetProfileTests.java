package au.edu.rmit.sept.webapp;

import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.repository.PetRepository;
import au.edu.rmit.sept.webapp.service.PetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.profiles.active=test")
public class PetProfileTests {

    @MockBean
    private PetRepository petRepository;

    @Autowired
    private PetService petService;

    private Pet pet;
    private User user;

    @BeforeEach
    public void setup() {
        user = new User("John Smith", "john@example.com", "Password123!", "Pet Owner");
        pet = new Pet();
        pet.setId(1L);
        pet.setName("Buddy");
        pet.setType("Dog");
        pet.setBreed("Golden Retriever");
        pet.setAge(5);
        pet.setUser(user);
    }

    @Test
    public void testCreatePet() {
        // Mock pet creation
        Mockito.when(petRepository.save(Mockito.any(Pet.class))).thenReturn(pet);

        // Save the created pet
        Pet createdPet = petService.savePet(pet);

        //Verify the pet has been created
        assertNotNull(createdPet);
        assertEquals("Buddy", createdPet.getName());
    }

    @Test
    public void testUpdatePetProfile() {
        // Mock pet update
        Mockito.when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        // Update the pet by setting a new name
        pet.setName("Max");
        Mockito.when(petRepository.save(pet)).thenReturn(pet);

        // Verify the pet's name has been updated
        Pet updatedPet = petService.savePet(pet);
        assertEquals("Max", updatedPet.getName());
    }

    @Test
    public void testDeletePetProfile() {
        // Mock pet deletion
        Mockito.when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        petService.deletePet(pet.getId());

        // Verify the pet has been deleted
        Mockito.verify(petRepository, Mockito.times(1)).deleteById(pet.getId());
    }

    @Test
    public void testUpdatePetProfilePicture() {
        // Mock pet profile picture update
        pet.setProfilePicture("some-image-data");
        Mockito.when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));
        
        // Update the pet profile picture
        pet.setProfilePicture("updated-image-data");
        Mockito.when(petRepository.save(pet)).thenReturn(pet);

        // Verify the pet profile picture has been updated
        Pet updatedPet = petService.savePet(pet);
        assertEquals("updated-image-data", updatedPet.getProfilePicture());
    }

    @Test
    public void testRemovePetProfilePicture() {
        // Mock pet profile picture removal
        pet.setProfilePicture("some-image-data");
        Mockito.when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        // Set the profile picture to null
        pet.setProfilePicture(null);
        Mockito.when(petRepository.save(pet)).thenReturn(pet);

        // Verify the profile picture has been removed
        Pet updatedPet = petService.savePet(pet);
        assertNull(updatedPet.getProfilePicture(), "Pet profile picture should be removed.");
    }

    @Test
    public void testPetWithoutAge() {
        // Test adding pet without age
        pet.setAge(null);
        Mockito.when(petRepository.save(pet)).thenReturn(pet);

        // Verify the null pet's age is saved
        Pet savedPet = petService.savePet(pet);
        assertNull(savedPet.getAge(), "Age should be optional.");
    }

    @Test
    public void testInvalidPetAge() {
        // Test invalid pet age by setting an age greater than the allowed limit
        pet.setAge(50); 
        boolean isValidAge = pet.getAge() <= 40;

        // Verify the pet's age does not exceed 40
        assertFalse(isValidAge, "Pet age should not exceed 40.");
    }

    @Test
    public void testPetWithoutBreed() {
        // Test adding pet without breed
        pet.setBreed(null);
        Mockito.when(petRepository.save(pet)).thenReturn(pet);

        // Verify the null pet's breed is saved
        Pet savedPet = petService.savePet(pet);
        assertNull(savedPet.getBreed(), "Breed should be optional.");
    }
}
