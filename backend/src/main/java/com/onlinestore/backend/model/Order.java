package com.onlinestore.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    @JsonProperty("_id")
    private String id;
    
    private String orderId;
    private String productId; // storing id or full product depending on ref
    private String productName;
    private Integer quantity;
    private String buyerName;
    private String phone;
    private String city;
    private String message;
    private String status = "Pending";
    
    private Product productDetails; // to be populated
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
