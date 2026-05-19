package com.onlinestore.backend.controller;

import com.onlinestore.backend.model.Product;
import com.onlinestore.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getInventoryStats() {
        List<Product> products = productRepository.findAll();

        int totalProducts = products.size();
        int totalStock = products.stream().mapToInt(p -> p.getStockQuantity() != null ? p.getStockQuantity() : 0).sum();
        double totalValue = products.stream()
                .mapToDouble(p -> (p.getPrice() != null ? p.getPrice() : 0.0) * (p.getStockQuantity() != null ? p.getStockQuantity() : 0))
                .sum();
        long lowStockCount = products.stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() > 0 && p.getStockQuantity() < 5)
                .count();
        long outOfStockCount = products.stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() == 0)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalStock", totalStock);
        stats.put("totalValue", totalValue);
        stats.put("lowStockCount", lowStockCount);
        stats.put("outOfStockCount", outOfStockCount);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<?> getLowStockProducts() {
        List<Product> lowStockProducts = productRepository.findByStockQuantityLessThanOrderByStockQuantityAsc(5);
        return ResponseEntity.ok(lowStockProducts);
    }
}
