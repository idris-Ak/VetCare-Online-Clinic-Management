package au.edu.rmit.sept.webapp.model;

import javax.persistence.*;

@Entity
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private String breed;
    private int age;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters here
}
