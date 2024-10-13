package au.edu.rmit.sept.webapp.service;

import au.edu.rmit.sept.webapp.model.MedicalRecord;
import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.User;
import au.edu.rmit.sept.webapp.repository.MedicalRecordRepository;
import au.edu.rmit.sept.webapp.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public List<MedicalRecord> getMedicalRecordsByPet(Pet pet) {
        return medicalRecordRepository.findByPet(pet);
    }

    public List<MedicalRecord> getMedicalRecordsByPets(List<Pet> pets) {
        return medicalRecordRepository.findByPetIn(pets); // Use a repository method to fetch records by a list of pets
    }

    public Optional<MedicalRecord> findById(Long id) {
        return medicalRecordRepository.findById(id);
    }

    public MedicalRecord saveMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    public List<MedicalRecord> getRecordsByIds(List<Long> recordIds) {
        return medicalRecordRepository.findAllById(recordIds);
    }
    
}
