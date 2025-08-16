package com.example.timothy.producer_resource.controller;

import com.example.timothy.producer_resource.model.Supply;
import com.example.timothy.producer_resource.repository.SupplyRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;




@WebMvcTest(SupplyController.class)
public class SupplyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SupplyRepository repository;

    @Test 
    public void testAddSupply() throws Exception{
        Supply supply = new Supply("Apples", 100);

        when(repository.save(any(Supply.class))).thenReturn(supply);
    
        mockMvc.perform(post("/api/supplies")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Apples\",\"quantity\":100}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Apples"))
            .andExpect(jsonPath("$.quantity").value(100));
            
    }

}
