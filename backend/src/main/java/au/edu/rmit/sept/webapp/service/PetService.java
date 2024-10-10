package au.edu.rmit.sept.webapp.service;

import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    // Method to fetch pets by user ID
    public List<Pet> findByUserId(Long userId) {
        return petRepository.findByUser(new User(userId)); // Assuming User object with just an ID works
    }
    
    public List<Pet> getPetsByUser(User user) {
        return petRepository.findByUser(user);
    }

    public Optional<Pet> findById(Long id) {
        return petRepository.findById(id); 
    }

    public Pet savePet(Pet pet) {
        return petRepository.save(pet);
    }

    public void deletePet(Long petId) {
        petRepository.deleteById(petId);
    }
}
