package au.edu.rmit.sept.webapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.time.LocalDate;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int userId;

    @Column(nullable = false)
    private int petId;

    @Column(nullable = false)
    private int clinicId;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private int appointmentTimeId; // Ensure this is an int to match the key system

    // Default constructor
    public Appointment() {}

    // Constructor
    public Appointment(int userId, int petId, int clinicId, LocalDate appointmentDate, int appointmentTimeId) {
        this.userId = userId;
        this.petId = petId;
        this.clinicId = clinicId;
        this.appointmentDate = appointmentDate;
        this.appointmentTimeId = appointmentTimeId; // Key for the time slot
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getPetId() {
        return petId;
    }

    public void setPetId(int petId) {
        this.petId = petId;
    }

    public int getClinicId() {
        return clinicId;
    }

    public void setClinicId(int clinicId) {
        this.clinicId = clinicId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public int getAppointmentTimeId() {
        return appointmentTimeId;
    }

    public void setAppointmentTimeId(int appointmentTimeId) {
        this.appointmentTimeId = appointmentTimeId; // Key for the time slot
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "id=" + id +
                ", userId=" + userId +
                ", petId=" + petId +
                ", clinicId=" + clinicId +
                ", appointmentDate=" + appointmentDate +
                ", appointmentTimeId=" + appointmentTimeId + // Key representation
                '}';
    }
}
