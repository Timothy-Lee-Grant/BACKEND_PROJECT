package com.example.timothy.consumer_resource.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.example.timothy.consumer_resource.repository.SupplyRepository;

import com.example.timothy.consumer_resource.model.Supply;

@RestController
@RequestMapping("/consume_resource")
public class Consumer_Controller {
    
    private final SupplyRepository repository;

    public Consumer_Controller(SupplyRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String homePage()
    {
        return "This is the home page";
    }

    @GetMapping("/test")
    public String testPage()
    {
        return "This is the test page";
    }

    @GetMapping("/findAll")
    public List<Supply> getAllSupplies() {
        return repository.findAll();
    }

    @PostMapping("/")
    public ResponseEntity<String> consumePage(@RequestBody Supply supply)
    {
        //find element by name 
        List<Supply> items = repository.findAll();
        for (Supply item : items) {
            //if (item.getName().equalsIgnoreCase(supply.getName()) )
            if (supply.getName() != null && supply.getName().equalsIgnoreCase(item.getName()))
            {
                if (item.getQuantity() < supply.getQuantity())
                {
                    repository.deleteById(item.getId());
                    return ResponseEntity.status(HttpStatus.OK).body("Not enough inventory");
                }
                item.setQuantity(item.getQuantity()-supply.getQuantity());
                repository.save(item);
                return ResponseEntity.status(HttpStatus.OK).body("Items deleted");
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Item not found");
    }
}
