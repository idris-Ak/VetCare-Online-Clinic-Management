package au.edu.rmit.sept.webapp.controller;

import au.edu.rmit.sept.webapp.model.Vet;
import au.edu.rmit.sept.webapp.service.VetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vets")
public class VetController {

    @Autowired
    private VetService vetService;

    @GetMapping
    public List<Vet> getAllVets() {
        return vetService.getAllVets();
    }

    @GetMapping("/{vetId}")
    public ResponseEntity<Vet> getVetById(@PathVariable Long vetId) {
        return vetService.findById(vetId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vet> createVet(@RequestBody Vet vet) {
        Vet savedVet = vetService.saveVet(vet);
        return ResponseEntity.ok(savedVet);
    }

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

    @DeleteMapping("/{vetId}")
    public ResponseEntity<Object> deleteVet(@PathVariable Long vetId) {
        return vetService.findById(vetId)
                .map(vet -> {
                    vetService.deleteVet(vetId);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
