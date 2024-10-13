package au.edu.rmit.sept.webapp.service;

import au.edu.rmit.sept.webapp.model.MedicalRecord;
import au.edu.rmit.sept.webapp.model.Vet;
import au.edu.rmit.sept.webapp.repository.VetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VetService {

    @Autowired
    private VetRepository vetRepository;

    public List<Vet> getAllVets() {
        return vetRepository.findAll();
    }

    public Optional<Vet> findById(Long id) {
        return vetRepository.findById(id);
    }

    public Vet saveVet(Vet vet) {
        return vetRepository.save(vet);
    }

    public void deleteVet(Long vetId) {
        vetRepository.deleteById(vetId);
    }
    public Vet shareRecordWithVet(Long vetId, Long recordId) throws Exception {
        Optional<Vet> optionalVet = vetRepository.findById(vetId);

        if (optionalVet.isPresent()) {
            Vet vet = optionalVet.get();
            if (!vet.getSharedRecordIds().contains(recordId)) {
                vet.addRecordId(recordId);
                return vetRepository.save(vet);
            } else {
                throw new Exception("Record ID already shared with this vet.");
            }
        } else {
            throw new Exception("Vet not found.");
        }
    }
}
