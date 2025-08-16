package com.example.timothy.producer_resource.controller;

import org.springframework.web.bind.annotation.*;

import com.example.timothy.producer_resource.model.Supply;
import com.example.timothy.producer_resource.repository.SupplyRepository;

import java.util.List;

@RestController
@RequestMapping("/api/supplies")
public class SupplyController {

    private final SupplyRepository repository;

    public SupplyController(SupplyRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Supply> getAllSupplies() {
        return repository.findAll();
    }

    @PostMapping
    public Supply addSupply(@RequestBody Supply supply) {
        System.out.println("Controller method hit with: " + supply.getName());
        return repository.save(supply);
    }
}
