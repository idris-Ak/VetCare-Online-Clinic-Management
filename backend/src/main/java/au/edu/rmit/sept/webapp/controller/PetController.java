package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.service.PetService;
import au.edu.rmit.sept.webapp.service.UserService;
import au.edu.rmit.sept.webapp.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private UserService userService;

    @Autowired
    private ImageService imageService; // ImageService for processing images

    @GetMapping
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

    //Fetch user pets
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Pet>> getPetsByUserId(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // Return bad request without a body
        }
        Optional<User> user = userService.findById(userId);
        if (user.isPresent()) {
            List<Pet> pets = petService.getPetsByUser(user.get());
            return ResponseEntity.ok(pets);
        }
        return ResponseEntity.notFound().build();
    }

    // Add pet
    @PostMapping("/user/{userId}") 
    public ResponseEntity<Pet> createPet(
            @PathVariable Long userId,
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("breed") String breed,
            @RequestParam("age") int age,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) 
        throws IOException {
        
        Optional<User> user = userService.findById(userId);
        if (user.isPresent()) {
            Pet pet = new Pet();
            pet.setName(name);
            pet.setType(type);
            pet.setBreed(breed);
            pet.setAge(age);
            pet.setUser(user.get());

            try {
                if (profilePicture != null && !profilePicture.isEmpty()) {
                    // Process and resize the image if necessary
                    String base64Image = imageService.processImage(profilePicture);
                    pet.setProfilePicture(base64Image); // Store Base64 image string
                }
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            Pet savedPet = petService.savePet(pet);
            return ResponseEntity.ok(savedPet);
        }
        return ResponseEntity.status(404).build(); // Return 404 if user not found
    }

    // Update pet
    @PutMapping("/{petId}")
    public ResponseEntity<Pet> updatePet(
            @PathVariable Long petId,
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("breed") String breed,
            @RequestParam("age") Integer age,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture)
            throws IOException {

        Optional<Pet> existingPet = petService.findById(petId);
        if (existingPet.isPresent()) {
            Pet pet = existingPet.get();
            if (name != null)
                pet.setName(name);
            if (type != null)
                pet.setType(type);
            if (breed != null)
                pet.setBreed(breed);
            if (age != null)
                pet.setAge(age);

            if (profilePicture != null && !profilePicture.isEmpty()) {
                try {
                    String base64Image = imageService.processImage(profilePicture);
                    pet.setProfilePicture(base64Image);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }

            Pet savedPet = petService.savePet(pet);
            return ResponseEntity.ok(savedPet);
        }
        return ResponseEntity.status(404).build(); // Return 404 if pet not found
    }

    // Delete pet
    @DeleteMapping("/{petId}")
    public ResponseEntity<Void> deletePet(@PathVariable Long petId) {
        petService.deletePet(petId);
        return ResponseEntity.noContent().build();
    }
    
    // Update pet profile picture
    @PutMapping("/{petId}/profilePicture")
    public ResponseEntity<Pet> updatePetProfilePicture(
            @PathVariable Long petId,
            @RequestParam("profilePicture") MultipartFile profilePicture) {
        Optional<Pet> existingPet = petService.findById(petId);
        if (existingPet.isPresent()) {
            Pet pet = existingPet.get();

            if (profilePicture != null && !profilePicture.isEmpty()) {
                try {
                    String base64Image = imageService.processImage(profilePicture);
                    pet.setProfilePicture(base64Image);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }

            Pet savedPet = petService.savePet(pet);
            return ResponseEntity.ok(savedPet);
        }
        return ResponseEntity.status(404).build();
    }

    // Delete pet profile picture
    @DeleteMapping("/{petId}/profilePicture")
    public ResponseEntity<Pet> removePetProfilePicture(@PathVariable Long petId) {
        Optional<Pet> existingPet = petService.findById(petId);
        if (existingPet.isPresent()) {
            Pet pet = existingPet.get();
            pet.setProfilePicture(null); // Remove the profile picture from the pet

            Pet savedPet = petService.savePet(pet); // Save the updated pet
            return ResponseEntity.ok(savedPet);
        }
        return ResponseEntity.status(404).build(); // Return 404 if pet not found
    }

}
