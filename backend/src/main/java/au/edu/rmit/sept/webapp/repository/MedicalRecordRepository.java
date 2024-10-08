package au.edu.rmit.sept.webapp.repository;

import au.edu.rmit.sept.webapp.model.MedicalRecord;
import au.edu.rmit.sept.webapp.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPet(Pet pet);
}
