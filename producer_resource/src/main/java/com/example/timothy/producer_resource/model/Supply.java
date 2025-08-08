package com.example.timothy.producer_resource.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "supplies")
public class Supply {
    @Id
    private String id;
    private String name;
    private int quantity;

    // Getters and setters

    // Constructors
    public Supply() {}

    public Supply(String name, int quantity) {
        this.name = name;
        this.quantity = quantity;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity;}
    
}
