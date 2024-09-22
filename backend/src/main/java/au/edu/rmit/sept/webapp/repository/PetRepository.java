package au.edu.rmit.sept.webapp.repository;

import au.edu.rmit.sept.webapp.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {
}
