package ru.isu.building_material_shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ru.isu.building_material_shop.model.ProductVariant;
import ru.isu.building_material_shop.repository.ProductVariantRepository;

@Service
public class ProductVariantService {
    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Transactional
    public void save(ProductVariant variant) {
        productVariantRepository.save(variant);
    }

    // Метод для удаления вариантов по ID продукта
    @Transactional
    public void deleteByProductId(Long productId) {
        productVariantRepository.deleteByProductId(productId);
    }
}