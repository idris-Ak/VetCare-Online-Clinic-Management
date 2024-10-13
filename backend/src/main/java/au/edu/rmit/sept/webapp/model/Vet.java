package au.edu.rmit.sept.webapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vets")
public class Vet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String title;

    @Column(length = 1024)
    private String shortDescription;

    @Column(length = 4096)
    private String longDescription;

    

    private String imagePath;
    private String detailPath;

    private String clinicName;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Long> sharedRecordIds = new HashSet<>(); // Store record IDs in a Set

    // Default constructor
    public Vet() {
    }

    // Getters and Setters for sharedRecordIds
    public Set<Long> getSharedRecordIds() {
        return sharedRecordIds;
    }

    public void setSharedRecordIds(Set<Long> sharedRecordIds) {
        this.sharedRecordIds = sharedRecordIds;
    }

    public void addRecordId(Long recordId) {
        this.sharedRecordIds.add(recordId);
    }

    // Constructor with parameters
    public Vet(long l, String name, String title, String shortDescription, String longDescription, String imagePath, String detailPath, String clinicName) {
        this.id = l;
        this.name = name;
        this.title = title;
        this.shortDescription = shortDescription;
        this.longDescription = longDescription;
        this.imagePath = imagePath;
        this.detailPath = detailPath;
        this.clinicName = clinicName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getLongDescription() {
        return longDescription;
    }

    public void setLongDescription(String longDescription) {
        this.longDescription = longDescription;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getDetailPath() {
        return detailPath;
    }

    public void setDetailPath(String detailPath) {
        this.detailPath = detailPath;
    }

    public String getClinicName() {
        return clinicName; 
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName; 
    }

}
