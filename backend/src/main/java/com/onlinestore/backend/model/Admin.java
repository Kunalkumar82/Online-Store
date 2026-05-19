package com.onlinestore.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@Document(collection = "admins")
public class Admin {
    @Id
    @JsonProperty("_id")
    private String id;
    
    private String username;
    private String password;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
