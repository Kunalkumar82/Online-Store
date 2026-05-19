package com.onlinestore.backend.controller;

import com.onlinestore.backend.model.Product;
import com.onlinestore.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort) {

        Sort sortObj = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equals(sort)) {
            sortObj = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equals(sort)) {
            sortObj = Sort.by(Sort.Direction.DESC, "price");
        }

        List<Product> products;
        
        if (search != null && !search.isEmpty()) {
            products = productRepository.searchProducts(search, sortObj);
        } else if (category != null && !category.isEmpty()) {
            products = productRepository.findByCategory(category, sortObj);
        } else {
            products = productRepository.findAll(sortObj);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("count", products.size());
        response.put("products", products);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        Optional<Product> productOpt;
        if (id.startsWith("PRD-")) {
            productOpt = productRepository.findByProductId(id);
        } else {
            productOpt = productRepository.findById(id);
        }

        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setViews(product.getViews() + 1);
            productRepository.save(product);
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Product not found"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") Double price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("description") String description,
            @RequestParam(value = "material", required = false) String material,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {

        List<String> imagePaths = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                try {
                    Files.createDirectories(Paths.get(UPLOAD_DIR));
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path path = Paths.get(UPLOAD_DIR + fileName);
                    Files.write(path, file.getBytes());
                    imagePaths.add("/uploads/" + fileName);
                } catch (IOException e) {
                    return ResponseEntity.status(500).body(Map.of("message", "File upload failed"));
                }
            }
        }

        String generatedId = "PRD-" + java.time.LocalDate.now().toString().replace("-", "") + "-" +
                UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Product product = new Product();
        product.setProductId(generatedId);
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setDescription(description);
        product.setMaterial(material);
        product.setSize(size);
        product.setImages(imagePaths);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        return ResponseEntity.status(201).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable String id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "stockQuantity", required = false) Integer stockQuantity,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "material", required = false) String material,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {

        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (name != null) product.setName(name);
            if (category != null) product.setCategory(category);
            if (price != null) product.setPrice(price);
            if (stockQuantity != null) product.setStockQuantity(stockQuantity);
            if (description != null) product.setDescription(description);
            if (material != null) product.setMaterial(material);
            if (size != null) product.setSize(size);

            if (files != null && files.length > 0) {
                List<String> newImages = new ArrayList<>();
                for (MultipartFile file : files) {
                    try {
                        Files.createDirectories(Paths.get(UPLOAD_DIR));
                        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                        Path path = Paths.get(UPLOAD_DIR + fileName);
                        Files.write(path, file.getBytes());
                        newImages.add("/uploads/" + fileName);
                    } catch (IOException e) {
                        return ResponseEntity.status(500).body(Map.of("message", "File upload failed"));
                    }
                }
                if (product.getImages() == null) {
                    product.setImages(newImages);
                } else {
                    product.getImages().addAll(newImages);
                }
            }

            product.setUpdatedAt(LocalDateTime.now());
            Product updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Product not found"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Product removed"));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Product not found"));
        }
    }

    @GetMapping("/recommendations/{category}")
    public ResponseEntity<?> getRecommendations(@PathVariable String category, @RequestParam(required = false) String exclude) {
        List<Product> products;
        if (exclude != null) {
            products = productRepository.findByCategoryAndIdNot(category, exclude);
        } else {
            products = productRepository.findByCategory(category, Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        
        if (products.size() > 4) {
            products = products.subList(0, 4);
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingProducts() {
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "views"));
        if (products.size() > 4) {
            products = products.subList(0, 4);
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentProducts() {
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        if (products.size() > 4) {
            products = products.subList(0, 4);
        }
        return ResponseEntity.ok(products);
    }
}
