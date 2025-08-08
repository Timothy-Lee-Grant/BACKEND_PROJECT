package com.example.timothy.consumer_resource.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consume_resource")
public class Consumer_Controller {
    
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
}
