package ru.isu.building_material_shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.isu.building_material_shop.model.ProductCategory;
import ru.isu.building_material_shop.repository.ProductCategoryRepository;

@Service
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;
    
    @Transactional
    public void save(ProductCategory productCategory) {
        productCategoryRepository.save(productCategory); 
    }
    
     // Метод для удаления категорий по ID продукта
    @Transactional
    public void deleteByProductId(Long productId) {
        productCategoryRepository.deleteByProductId(productId);
    }
}
