package com.onlinestore.backend.controller;

import com.onlinestore.backend.model.Order;
import com.onlinestore.backend.model.Product;
import com.onlinestore.backend.repository.OrderRepository;
import com.onlinestore.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        Order order = new Order();
        
        String timestamp = String.valueOf(System.currentTimeMillis());
        timestamp = timestamp.substring(timestamp.length() - 6);
        String randomStr = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        
        order.setOrderId("ORD-" + timestamp + "-" + randomStr);
        order.setProductId((String) orderData.get("productId"));
        order.setProductName((String) orderData.get("productName"));
        order.setQuantity((Integer) orderData.get("quantity"));
        order.setBuyerName((String) orderData.get("buyerName"));
        order.setPhone((String) orderData.get("phone"));
        order.setCity((String) orderData.get("city"));
        order.setMessage((String) orderData.get("message"));
        order.setStatus("Pending");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(201).body(savedOrder);
    }

    @GetMapping
    public ResponseEntity<?> getOrders() {
        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        
        // Manual population of productDetails
        List<Order> populatedOrders = orders.stream().map(order -> {
            if (order.getProductId() != null) {
                Optional<Product> productOpt = productRepository.findById(order.getProductId());
                if (productOpt.isPresent()) {
                    Product p = productOpt.get();
                    Product trimmedProduct = new Product();
                    trimmedProduct.setId(p.getId());
                    trimmedProduct.setImages(p.getImages());
                    trimmedProduct.setCategory(p.getCategory());
                    trimmedProduct.setMaterial(p.getMaterial());
                    trimmedProduct.setSize(p.getSize());
                    trimmedProduct.setPrice(p.getPrice());
                    order.setProductDetails(trimmedProduct);
                }
            }
            return order;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(populatedOrders);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> statusData) {
        String status = statusData.get("status");

        if (!List.of("Pending", "Approved", "Rejected", "Completed").contains(status)) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid status value"));
        }

        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now());
            Order updatedOrder = orderRepository.save(order);
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Order not found"));
        }
    }
}
