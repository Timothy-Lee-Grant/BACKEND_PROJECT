package com.example.timothy.consumer_resource;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import static org.mockito.Mockito.when; 
import java.util.Arrays;                
import java.util.List;                  

import com.example.timothy.consumer_resource.controller.Consumer_Controller;
import com.example.timothy.consumer_resource.model.Supply;
import com.example.timothy.consumer_resource.repository.SupplyRepository;

@SpringBootTest
class ConsumerResourceApplicationTests {

	@Test
	void contextLoads() {
	}

}


@ExtendWith(MockitoExtension.class)
public class Consumer_Controller_Test{
	@Mock 
	private SupplyRepository repository;

	@InjectMocks
	private Consumer_Controller consumer_Controller;

	@Test
	public void testFindAll(){
		// Arrange: create the mock data
		Supply supply1 = new Supply("12345", "Apples", 3);
		Supply supply2 = new Supply("3421", "cups", 10);
		List<Supply> mockSupplies = Arrays.asList(supply1, supply2);

		//Mock repository behavior
		// This should be where I tell what the result will be of a given operation of my 'fake' mocked funtion is called
		when(repository.findAll()).thenReturn(mockSupplies);

		//Act: call the method
		List<Supply> result = consumer_Controller.getAllSupplies();

		//Assert, verify the reslt is accurate.
		assertEquals(2, result.size());
		assertEquals("Apples", result.get(0).getName());
		assertEquals("cups", result.get(0).getName());
		assertEquals(3, result.get(0).getQuantity());
	}


}