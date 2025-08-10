package com.example.timothy.consumer_resource.repository;

import com.example.timothy.consumer_resource.model.Supply;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SupplyRepository extends MongoRepository<Supply, String>{
    
}
