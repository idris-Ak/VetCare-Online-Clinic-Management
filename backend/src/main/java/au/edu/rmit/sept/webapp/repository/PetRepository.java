package au.edu.rmit.sept.webapp.repository;

import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByUser(User user);
}
