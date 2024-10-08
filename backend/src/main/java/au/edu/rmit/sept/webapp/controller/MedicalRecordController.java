package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.MedicalRecord;
import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.Vet; // Import Vet

import au.edu.rmit.sept.webapp.service.MedicalRecordService;
import au.edu.rmit.sept.webapp.service.PetService;
import au.edu.rmit.sept.webapp.service.VetService; // Import VetService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicalRecords")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private PetService petService;

    @Autowired
    private VetService vetService; // Add VetService

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByPet(@PathVariable Long petId) {
        Optional<Pet> pet = petService.findById(petId);
        if (pet.isPresent()) {
            List<MedicalRecord> records = medicalRecordService.getMedicalRecordsByPet(pet.get());
            return ResponseEntity.ok(records);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{recordId}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long recordId) {
        Optional<MedicalRecord> record = medicalRecordService.findById(recordId);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/pet/{petId}")
    public ResponseEntity<MedicalRecord> createMedicalRecord(
            @PathVariable Long petId,
            @RequestBody Map<String, Object> requestBody) {
        
        Optional<Pet> pet = petService.findById(petId);
        if (pet.isPresent()) {
            MedicalRecord medicalRecord = new MedicalRecord();
            medicalRecord.setPet(pet.get());
            
            // Parse fields from the requestBody
            String description = (String) requestBody.get("description");
            String diagnosis = (String) requestBody.get("diagnosis");
            String treatment = (String) requestBody.get("treatment");
            String vetId = (String) requestBody.get("vetId");
            
            // Optionally handle the recordDate
            LocalDate recordDate = requestBody.get("recordDate") != null 
                    ? LocalDate.parse((String) requestBody.get("recordDate")) 
                    : LocalDate.now();
    
            medicalRecord.setDescription(description);
            medicalRecord.setDiagnosis(diagnosis);
            medicalRecord.setTreatment(treatment);
            medicalRecord.setRecordDate(recordDate);
    
            // Save the record and return response
            MedicalRecord savedRecord = medicalRecordService.saveMedicalRecord(medicalRecord);
            return ResponseEntity.ok(savedRecord);
        }
    
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{recordId}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(
            @PathVariable Long recordId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "diagnosis", required = false) String diagnosis,
            @RequestParam(value = "treatment", required = false) String treatment,
            @RequestParam(value = "recordDate", required = false) LocalDate recordDate) {

        Optional<MedicalRecord> existingRecord = medicalRecordService.findById(recordId);
        if (existingRecord.isPresent()) {
            MedicalRecord record = existingRecord.get();

            if (description != null)
                record.setDescription(description);
            if (diagnosis != null)
                record.setDiagnosis(diagnosis);
            if (treatment != null)
                record.setTreatment(treatment);
            if (recordDate != null)
                record.setRecordDate(recordDate);

            MedicalRecord updatedRecord = medicalRecordService.saveMedicalRecord(record);
            return ResponseEntity.ok(updatedRecord);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long recordId) {
        medicalRecordService.deleteMedicalRecord(recordId);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/share")
    public ResponseEntity<String> shareMedicalRecord(@RequestBody Map<String, Long> shareRequest) {
        Long recordId = shareRequest.get("recordId");
        Long vetId = shareRequest.get("vetId");

        // Find the vet and the medical record
        Optional<Vet> vet = vetService.findById(vetId);
        Optional<MedicalRecord> medicalRecord = medicalRecordService.findById(recordId);

        if (vet.isPresent() && medicalRecord.isPresent()) {
            // Add the record to the vet's shared records
            vet.get().getSharedRecords().add(medicalRecord.get());
            vetService.saveVet(vet.get()); // Save the vet with updated shared records
            return ResponseEntity.ok("Medical record shared with vet ID: " + vetId);
        }

        return ResponseEntity.notFound().build();
    }

}
