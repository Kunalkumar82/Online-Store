package com.onlinestore.backend.controller;

import com.onlinestore.backend.model.Admin;
import com.onlinestore.backend.repository.AdminRepository;
import com.onlinestore.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authAdmin(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);

        if (adminOpt.isPresent() && passwordEncoder.matches(password, adminOpt.get().getPassword())) {
            Admin admin = adminOpt.get();
            String token = jwtUtil.generateToken(admin.getUsername(), admin.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("_id", admin.getId());
            response.put("username", admin.getUsername());
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, String> registerData) {
        String username = registerData.get("username");
        String password = registerData.get("password");

        if (adminRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Admin already exists"));
        }

        Admin newAdmin = new Admin();
        newAdmin.setUsername(username);
        newAdmin.setPassword(passwordEncoder.encode(password));
        newAdmin.setCreatedAt(LocalDateTime.now());
        newAdmin.setUpdatedAt(LocalDateTime.now());
        
        Admin savedAdmin = adminRepository.save(newAdmin);
        
        String token = jwtUtil.generateToken(savedAdmin.getUsername(), savedAdmin.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("_id", savedAdmin.getId());
        response.put("username", savedAdmin.getUsername());
        response.put("token", token);
        
        return ResponseEntity.status(201).body(response);
    }
}
