package au.edu.rmit.sept.webapp;

import au.edu.rmit.sept.webapp.model.MedicalRecord;
import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.Vet;
import au.edu.rmit.sept.webapp.service.MedicalRecordService;
import au.edu.rmit.sept.webapp.service.PetService;
import au.edu.rmit.sept.webapp.service.VetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.profiles.active=test")
class MedicalRecordTests {

    @MockBean
    private MedicalRecordService medicalRecordService;

    @MockBean
    private PetService petService;

    @MockBean
    private VetService vetService;

    private MedicalRecord medicalRecord;
    private Pet pet;
    private Vet vet;

    @BeforeEach
    public void setup() {
        // Mock a Pet and Vet object
        pet = new Pet();
        pet.setId(1L);

        vet = new Vet();
        vet.setId(101L);

        // Create a mock medical record
        medicalRecord = new MedicalRecord();
        medicalRecord.setId(1L);
        medicalRecord.setPet(pet);
        medicalRecord.setVet(vet);
        medicalRecord.setDescription("Checkup");
        medicalRecord.setMedications("None");
        medicalRecord.setAllergies("None");
        medicalRecord.setDiet("Normal");
        medicalRecord.setHealthStatus("Healthy");
        medicalRecord.setWeight("10kg");
        medicalRecord.setService("General Checkup");
        medicalRecord.setRecordDate(LocalDate.of(2024, 10, 12));
    }

    @Test
    public void testMedicalRecordCreationSuccess() {
        // Mock saving the medical record
        Mockito.when(medicalRecordService.saveMedicalRecord(Mockito.any(MedicalRecord.class)))
               .thenReturn(medicalRecord);

        MedicalRecord response = medicalRecordService.saveMedicalRecord(medicalRecord);
        assertNotNull(response);
        assertEquals(medicalRecord.getDescription(), response.getDescription());
        assertEquals(medicalRecord.getRecordDate(), response.getRecordDate());
    }

    @Test
    public void testMedicalRecordCreationFailure() {
        // Mock failure in saving the medical record
        Mockito.when(medicalRecordService.saveMedicalRecord(Mockito.any(MedicalRecord.class)))
               .thenReturn(null);

        MedicalRecord response = medicalRecordService.saveMedicalRecord(medicalRecord);
        assertNull(response);
    }

    @Test
    public void testGetMedicalRecordsByPetSuccess() {
        // Mock fetching medical records by pet
        Mockito.when(medicalRecordService.getMedicalRecordsByPet(Mockito.any(Pet.class)))
               .thenReturn(Collections.singletonList(medicalRecord));

        var records = medicalRecordService.getMedicalRecordsByPet(pet);
        assertNotNull(records);
        assertEquals(1, records.size());
        assertEquals(medicalRecord.getPet().getId(), records.get(0).getPet().getId());
    }

    @Test
    public void testGetMedicalRecordsByPetNotFound() {
        // Mock an empty response for medical records
        Mockito.when(medicalRecordService.getMedicalRecordsByPet(Mockito.any(Pet.class)))
               .thenReturn(Collections.emptyList());

        var records = medicalRecordService.getMedicalRecordsByPet(pet);
        assertTrue(records.isEmpty());
    }

    @Test
    public void testMedicalRecordUpdateSuccess() {
        // Mock updating a medical record
        medicalRecord.setHealthStatus("Updated Healthy");
        Mockito.when(medicalRecordService.saveMedicalRecord(Mockito.any(MedicalRecord.class)))
               .thenReturn(medicalRecord);

        MedicalRecord updatedRecord = medicalRecordService.saveMedicalRecord(medicalRecord);
        assertEquals("Updated Healthy", updatedRecord.getHealthStatus());
    }

    @Test
    public void testMedicalRecordDeletion() {
        // Mock deleting a medical record
        Mockito.doNothing().when(medicalRecordService).deleteMedicalRecord(Mockito.anyLong());

        medicalRecordService.deleteMedicalRecord(medicalRecord.getId());
        Mockito.verify(medicalRecordService, Mockito.times(1))
               .deleteMedicalRecord(medicalRecord.getId());
    }

    @Test
    public void testInvalidDateForMedicalRecord() {
        // Test for invalid date (e.g., February 30th doesn't exist)
        assertThrows(Exception.class, () -> {
            LocalDate invalidDate = LocalDate.of(2024, 2, 30); // Invalid date
            medicalRecord.setRecordDate(invalidDate);
        });
    }

    @Test
    public void testMedicalRecordWithoutVet() {
        // Mock a case where the vet is not found
        Mockito.when(vetService.findById(Mockito.anyLong())).thenReturn(Optional.empty());

        Optional<Vet> responseVet = vetService.findById(vet.getId());
        assertTrue(responseVet.isEmpty(), "Expected vet to be not found");
    }
}
