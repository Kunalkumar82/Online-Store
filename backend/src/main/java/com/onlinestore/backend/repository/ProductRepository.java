package com.onlinestore.backend.repository;

import com.onlinestore.backend.model.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findByProductId(String productId);
    
    @Query("{$or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'productId': { $regex: ?0, $options: 'i' } } ] }")
    List<Product> searchProducts(String search, Sort sort);

    List<Product> findByCategory(String category, Sort sort);

    @Query("{ 'category': ?0, '_id': { $ne: ?1 } }")
    List<Product> findByCategoryAndIdNot(String category, String id);

    List<Product> findByStockQuantityLessThanOrderByStockQuantityAsc(int quantity);
}
