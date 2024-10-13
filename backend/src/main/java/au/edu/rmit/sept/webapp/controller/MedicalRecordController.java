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

    // Fetch medical records by pet ID
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByPet(@PathVariable Long petId) {
        // Find the pet by ID
        Pet pet = petService.findById(petId).orElse(null); // Fetch pet, handle null case

        if (pet == null) {
            return ResponseEntity.notFound().build(); // Return 404 if pet not found
        }

        // Fetch medical records associated with the pet
        List<MedicalRecord> records = medicalRecordService.getMedicalRecordsByPet(pet);

        return ResponseEntity.ok(records); // Return records with 200 OK
    }
    
    @GetMapping("/getRecordsByIds")
    public List<MedicalRecord> getRecordsByIds(@RequestParam List<Long> recordIds) {
        return medicalRecordService.getRecordsByIds(recordIds);
    }

    @PostMapping("/pet/{petId}")
    public ResponseEntity<MedicalRecord> createMedicalRecord(
            @PathVariable Long petId,
            @RequestBody Map<String, Object> requestBody) {
        
        Optional<Pet> pet = petService.findById(petId);
        if (pet.isPresent()) {
            System.out.println("Received requestBody: " + requestBody); // Add this line to log the incoming data

            MedicalRecord medicalRecord = new MedicalRecord();
            medicalRecord.setPet(pet.get());
            
            // Parse fields from the requestBody
            String description = (String) requestBody.get("description");
            String service = (String) requestBody.get("service");
            String weight = (String) requestBody.get("weight");
            String healthStatus = (String) requestBody.get("healthStatus");
            String diet = (String) requestBody.get("diet");
            String allergies = (String) requestBody.get("allergies");
            String medications = (String) requestBody.get("medications");
            Integer vetId = (Integer) requestBody.get("vetId"); // Assuming vetId is still passed as an ID

            // Fetch Vet by ID
            Optional<Vet> vet = vetService.findById(Long.valueOf(vetId));
            if (vet.isPresent()) {
                medicalRecord.setVet(vet.get());
            } else {
                return ResponseEntity.badRequest().body(null); // Return 400 if vet not found
            }

            // Optionally handle the recordDate
            LocalDate recordDate = requestBody.get("recordDate") != null 
                    ? LocalDate.parse((String) requestBody.get("recordDate")) 
                    : LocalDate.now();

            medicalRecord.setAllergies(allergies);
            medicalRecord.setHealthStatus(healthStatus);
            medicalRecord.setMedications(medications);
            medicalRecord.setWeight(weight);
            medicalRecord.setDiet(diet);
            medicalRecord.setDescription(description);
            medicalRecord.setRecordDate(recordDate);
            medicalRecord.setService(service);

            // Save the record and return response
            MedicalRecord savedRecord = medicalRecordService.saveMedicalRecord(medicalRecord);
            return ResponseEntity.ok(savedRecord);
        }

        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{recordId}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(
            @PathVariable Long recordId,
            @RequestBody Map<String, Object> requestBody,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "weight", required = false) String weight,
            @RequestParam(value = "diet", required = false) String diet,
            @RequestParam(value = "medications", required = false) String medications,
            @RequestParam(value = "healthStatus", required = false) String healthStatus,
            @RequestParam(value = "allergies", required = false) String allergies,
            @RequestParam(value = "recordDate", required = false) LocalDate recordDate,
            @RequestParam(value = "service", required = false) String service) { // Vet can also be updated

        Optional<MedicalRecord> existingRecord = medicalRecordService.findById(recordId);
        if (existingRecord.isPresent()) {
            MedicalRecord record = existingRecord.get();

            if (description != null){
                record.setDescription(description);
            }
            if (allergies != null){
                record.setAllergies(allergies);
            }
            if (diet != null){
                record.setDiet(diet);
            }
            if (medications != null){
                record.setMedications(medications);
            }
            if (healthStatus != null){
                record.setHealthStatus(healthStatus);
                }
            if (healthStatus != null){
            record.setHealthStatus(healthStatus);
            }
            if (weight != null){
                record.setWeight(weight);
            }
            if (recordDate != null){
                record.setRecordDate(recordDate);
            }
            if (service != null){
                record.setService(service);
            }

            Integer vetId = (Integer) requestBody.get("vetId");

            if (vetId != null) {
                System.out.println("vetId update: "+vetId);
                Optional<Vet> vet = vetService.findById(Long.valueOf(vetId));
                if (vet.isPresent()) {
                    record.setVet(vet.get());
                } else {
                    return ResponseEntity.badRequest().body(null); // Return 400 if vet not found
                }
            }
            else{
                System.out.println("vetId is null: ");
            }
            System.out.println("record update"+record.getVet().getName());

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
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByUser(@PathVariable Long userId) {
        // Fetch all pets associated with the user
        List<Pet> pets = petService.findByUserId(userId);
        if (pets.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if no pets found for the user
        }

        // Fetch all medical records for the user's pets
        List<MedicalRecord> allRecords = medicalRecordService.getMedicalRecordsByPets(pets);

        return ResponseEntity.ok(allRecords); // Return records with 200 OK
    }


}
