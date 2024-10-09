package au.edu.rmit.sept.webapp.repository;

import au.edu.rmit.sept.webapp.model.Vet;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VetRepository extends JpaRepository<Vet, Long> {
    Optional<Vet> findByName(String name);
}
