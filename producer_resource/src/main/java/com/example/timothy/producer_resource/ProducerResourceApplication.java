package com.example.timothy.producer_resource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ProducerResourceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProducerResourceApplication.class, args);
	}

}
