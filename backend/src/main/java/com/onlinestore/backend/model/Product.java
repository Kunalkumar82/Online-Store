package com.onlinestore.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "products")
public class Product {
    @Id
    @JsonProperty("_id")
    private String id;
    
    private String productId;
    private String name;
    private String category;
    private Double price = 0.0;
    private Integer stockQuantity = 0;
    private String description;
    private String material;
    private String size;
    private List<String> images;
    private Integer views = 0;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
