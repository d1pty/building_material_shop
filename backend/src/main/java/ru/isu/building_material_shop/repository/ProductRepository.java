package ru.isu.building_material_shop.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.isu.building_material_shop.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p JOIN p.productCategories pc WHERE pc.category.id = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
}
