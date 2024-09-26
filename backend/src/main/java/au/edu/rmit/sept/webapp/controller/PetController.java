package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.service.PetService;
import au.edu.rmit.sept.webapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:3000") // Establish a connection with the frontend
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

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

    @PostMapping("/user/{userId}") // Added @PostMapping for the create/update method
    public ResponseEntity<Pet> createOrUpdatePet(
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

            if (profilePicture != null && !profilePicture.isEmpty()) {
                String base64Image = Base64.getEncoder().encodeToString(profilePicture.getBytes());
                pet.setProfilePicture(base64Image);
            }

            Pet savedPet = petService.savePet(pet);
            return ResponseEntity.ok(savedPet);
        }
        return ResponseEntity.status(404).build(); // Return 404 if user not found
    }

    @DeleteMapping("/{petId}")
    public ResponseEntity<Void> deletePet(@PathVariable Long petId) {
        petService.deletePet(petId);
        return ResponseEntity.noContent().build();
    }
}
