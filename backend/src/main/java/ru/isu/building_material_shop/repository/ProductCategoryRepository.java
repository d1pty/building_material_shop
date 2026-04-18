package ru.isu.building_material_shop.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.building_material_shop.model.ProductCategory;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

    // Запрос для получения категорий по ID продукта
    List<ProductCategory> findByProductId(Long productId);
    void deleteByProductId(Long productId);  // Удаляет все связи продукта с категориями
}
