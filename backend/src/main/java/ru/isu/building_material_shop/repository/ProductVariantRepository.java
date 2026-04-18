package ru.isu.building_material_shop.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.building_material_shop.model.ProductVariant;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    // Запрос для получения вариантов по ID продукта
    List<ProductVariant> findByProductId(Long productId);
    void deleteByProductId(Long productId);  // Удаляет все варианты по ID продукта
}
