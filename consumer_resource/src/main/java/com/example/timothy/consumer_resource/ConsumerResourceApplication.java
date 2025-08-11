package com.example.timothy.consumer_resource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ConsumerResourceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConsumerResourceApplication.class, args);
	}

}
