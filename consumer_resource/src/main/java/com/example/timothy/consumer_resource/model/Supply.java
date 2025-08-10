package com.example.timothy.consumer_resource.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="supplies")
public class Supply {
    @Id
    private String id;
    private String name;
    private int quantity;

    public Supply(){}

    public Supply(String id, String name, int quantity)
    {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
    }

    public String getId(){return this.id;}
    public String getName(){return this.name;}
    public int getQuantity(){return this.quantity;}

    public void setId(String id){this.id = id;}
    public void setName(String name){this.name=name;}
    public void setQuantity(int quantity){this.quantity=quantity;}
}
