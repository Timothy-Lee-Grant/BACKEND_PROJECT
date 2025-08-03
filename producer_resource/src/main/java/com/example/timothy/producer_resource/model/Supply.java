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
}
