package au.edu.rmit.sept.webapp;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import au.edu.rmit.sept.webapp.model.Pet;
import au.edu.rmit.sept.webapp.model.Vet;
import au.edu.rmit.sept.webapp.service.PaymentService;
import au.edu.rmit.sept.webapp.service.PetService;
import au.edu.rmit.sept.webapp.service.VetService;

@SpringBootTest(properties = "spring.profiles.active=test")
class PrescriptionTests<PrescriptionService, Prescription> {

    @MockBean
    private PrescriptionService prescriptionService;

    @MockBean
    private PetService petService;

    @MockBean
    private VetService vetService;

    @MockBean
    private PaymentService paymentService;

    private Prescription prescription;
    private Pet pet;
    private Vet vet;

    @BeforeEach
    public void setup() {
        pet = new Pet();
        pet.setId(1L);
        pet.setName("Buddy");

        vet = new Vet();
        vet.setId(101L);
        vet.setName("Dr. Smith");

        prescription = new Prescription();
        prescription.setId(1L);
        prescription.setMedication("Antibiotics");
        prescription.setDosage("250mg");
        prescription.setPreferredPharmacy("Local Pharmacy");
        prescription.setPickupDate(LocalDate.of(2024, 10, 12));
        prescription.setPet(pet);
        prescription.setVet(vet);
    }

    @Test
    public void testPrescriptionCreationSuccess() {
        // Mock API response from the petService
        Mockito.when(petService.findById(1L)).thenReturn(Optional.of(pet));

        // Mock API response from the vetService
        Mockito.when(vetService.findById(101L)).thenReturn(Optional.of(vet));

        // Mock API response from the prescriptionService
        Mockito.when(prescriptionService.createPrescription(Mockito.anyLong(), Mockito.anyLong(), Mockito.any(Prescription.class)))
               .thenReturn(prescription);

        Prescription response = prescriptionService.createPrescription(1L, 101L, prescription);
        assertNotNull(response);
        assertEquals("Antibiotics", response.getMedication());
    }

    @Test
    public void testPaymentProcessingSuccess() {
        // Mock API response from the paymentService
        Mockito.when(paymentService.processPayment(Mockito.anyLong(), Mockito.anyLong(), Mockito.anyString(), Mockito.anyString()))
               .thenReturn(true);

        boolean paymentSuccess = paymentService.processPayment(1L, 1L, "50.00", "Credit Card");
        assertTrue(paymentSuccess);
    }
}
