package ru.isu.building_material_shop.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.isu.building_material_shop.model.Category;
import ru.isu.building_material_shop.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Получить все категории
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Получить категорию по ID
    public Category getCategoryById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            return category.get();
        } else {
            throw new RuntimeException("Category not found with id " + id);
        }
    }

    // Создать новую категорию
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Обновить категорию
    public Category updateCategory(Long id, Category category) {
        if (categoryRepository.existsById(id)) {
            category.setId(id);
            return categoryRepository.save(category);
        } else {
            throw new RuntimeException("Category not found with id " + id);
        }
    }

    // Удалить категорию
    public void deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("Category not found with id " + id);
        }
    }
    
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id); // Это стандартный метод JpaRepository
    }
}