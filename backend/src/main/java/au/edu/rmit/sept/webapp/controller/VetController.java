package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Vet;
import au.edu.rmit.sept.webapp.service.VetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Controller for handling all vet-related API requests
@RestController
@RequestMapping("/api/vets")
public class VetController {

    @Autowired
    private VetService vetService; // Auto-inject the VetService

    // Get all vets from the database
    @GetMapping
    public List<Vet> getAllVets() {
        return vetService.getAllVets();
    }

    // Fetch a single vet by their ID
    @GetMapping("/{vetId}")
    public ResponseEntity<Vet> getVetById(@PathVariable Long vetId) {
        System.out.println("Fetching vet with ID: " + vetId);
        return vetService.findById(vetId)
                .map(vet -> {
                    System.out.println("Found vet: " + vet);
                    return ResponseEntity.ok(vet);
                })
                .orElseGet(() -> {
                    System.out.println("No vet found with ID: " + vetId);
                    return ResponseEntity.notFound().build();
                });
    }
    
    // Create a new vet and save it to the database
    @PostMapping
    public ResponseEntity<Vet> createVet(@RequestBody Vet vet) {
        Vet savedVet = vetService.saveVet(vet);
        return ResponseEntity.ok(savedVet);
    }

    // Update an existing vet's details
    @PutMapping("/{vetId}")
    public ResponseEntity<Vet> updateVet(@PathVariable Long vetId, @RequestBody Vet vet) {
        return vetService.findById(vetId)
                .map(existingVet -> {
                    existingVet.setName(vet.getName());
                    existingVet.setTitle(vet.getTitle());
                    existingVet.setShortDescription(vet.getShortDescription());
                    existingVet.setLongDescription(vet.getLongDescription());
                    existingVet.setImagePath(vet.getImagePath());
                    existingVet.setDetailPath(vet.getDetailPath());
                    Vet updatedVet = vetService.saveVet(existingVet);
                    return ResponseEntity.ok(updatedVet);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a vet from the database
    @DeleteMapping("/{vetId}")
    public ResponseEntity<Object> deleteVet(@PathVariable Long vetId) {
        return vetService.findById(vetId)
                .map(vet -> {
                    vetService.deleteVet(vetId);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/share/{vetId}")
    public ResponseEntity<?> shareRecordWithVet(@PathVariable Long vetId, @RequestBody Map<String, Long> requestBody) {
        Long recordId = requestBody.get("recordId");
        try {
            Vet updatedVet = vetService.shareRecordWithVet(vetId, recordId);
            return ResponseEntity.ok(updatedVet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
