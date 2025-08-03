package com.example.timothy.producer_resource.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.timothy.producer_resource.model.Supply;

public interface SupplyRepository extends MongoRepository<Supply, String> {
    // Custom query methods if needed
}
