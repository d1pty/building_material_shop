package ru.isu.building_material_shop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import ru.isu.building_material_shop.model.Category;
import ru.isu.building_material_shop.model.Product;
import ru.isu.building_material_shop.model.ProductCategory;
import ru.isu.building_material_shop.model.ProductVariant;
import ru.isu.building_material_shop.service.CategoryService;
import ru.isu.building_material_shop.service.ProductCategoryService;
import ru.isu.building_material_shop.service.ProductService;
import ru.isu.building_material_shop.service.ProductVariantService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductCategoryService productCategoryService;

    @Autowired
    private ProductVariantService productVariantService;

    @Value("${file.upload.directory}")
    private String uploadDirectory;

    // Загрузка фото для продукта
    @PostMapping("/{id}/upload")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return productService.uploadPhoto(id, file);
    }

    // Удаление фото для продукта
    @DeleteMapping("/{id}/deletePhoto")
    public ResponseEntity<String> deletePhoto(@PathVariable Long id) {
        return productService.deletePhoto(id);
    }

    // Получить все продукты
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Получить продукт по ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductWithCategoriesAndVariants(id);
    }

    // Создать новый продукт
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "variants", required = false) String variantsJson,
            @RequestParam(value = "categories", required = false) String categoriesJson) {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);

        try {
            // Создаем и сохраняем продукт с фото
            Product savedProduct = productService.createProduct(product, file);

            // Если были переданы варианты, обработаем их
            if (variantsJson != null && !variantsJson.isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                List<ProductVariant> variants = objectMapper.readValue(variantsJson,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, ProductVariant.class));

                for (ProductVariant variant : variants) {
                    variant.setProduct(savedProduct);
                    productVariantService.save(variant); // Сохраняем каждый вариант
                }
            }

            // Если были переданы категории, обработаем их
            if (categoriesJson != null && !categoriesJson.isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                // Преобразуем JSON строку в List<Long> (массив ID категорий)
                List<Long> categoryIds = objectMapper.readValue(categoriesJson,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, Long.class));

                if (!categoryIds.isEmpty()) {
                    // Получаем категорию из базы данных по ID
                    Optional<Category> optionalCategory = categoryService.findById(categoryIds.get(0)); // Предполагаем, что передан только один ID

                    // Извлекаем Category из Optional
                    Category category = optionalCategory.orElseThrow(() -> new RuntimeException("Категория не найдена"));

                    // Создаем связь между продуктом и категорией
                    ProductCategory productCategory = new ProductCategory();
                    productCategory.setProduct(savedProduct);
                    productCategory.setCategory(category);

                    // Сохраняем связь в таблице product_categories
                    productCategoryService.save(productCategory);
                }
            }

            return ResponseEntity.ok(savedProduct);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "variants", required = false) String variantsJson,
            @RequestParam(value = "categories", required = false) String categoriesJson) {

        try {
            // Обновляем продукт
            Product updatedProduct = productService.updateProduct(id, name, description, price, file);

            // Обработка обновленных вариантов
            if (variantsJson != null && !variantsJson.isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                List<ProductVariant> variants = objectMapper.readValue(variantsJson,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, ProductVariant.class));

                // Удаляем старые варианты продукта
                productVariantService.deleteByProductId(updatedProduct.getId());

                // Сохраняем новые варианты
                for (ProductVariant variant : variants) {
                    variant.setProduct(updatedProduct);
                    productVariantService.save(variant); // Сохраняем каждый новый вариант
                }
            }

            // Обработка обновленных категорий
            if (categoriesJson != null && !categoriesJson.isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                List<Long> categoryIds = objectMapper.readValue(categoriesJson,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, Long.class));

                // Удаляем старые категории
                productCategoryService.deleteByProductId(updatedProduct.getId());

                // Добавляем новые категории
                for (Long categoryId : categoryIds) {
                    Optional<Category> optionalCategory = categoryService.findById(categoryId);
                    Category category = optionalCategory.orElseThrow(() -> new RuntimeException("Категория не найдена"));

                    ProductCategory productCategory = new ProductCategory();
                    productCategory.setProduct(updatedProduct);
                    productCategory.setCategory(category);
                    productCategoryService.save(productCategory); // Сохраняем связь с категорией
                }
            }

            return ResponseEntity.ok(updatedProduct);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Удалить продукт
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    // Добавить категорию к продукту
    @PostMapping("/{productId}/categories/{categoryId}")
    public void addCategoryToProduct(@PathVariable Long productId, @PathVariable Long categoryId) {
        productService.addCategoryToProduct(productId, categoryId);
    }

    // Добавить вариант продукта
    @PostMapping("/{productId}/variants")
    public void addVariantToProduct(@PathVariable Long productId, @RequestBody ProductVariant productVariant) {
        productService.addVariantToProduct(productId, productVariant);
    }

    @GetMapping("/{productId}/variants")
    public List<ProductVariant> getVariantsByProduct(@PathVariable Long productId) {
        return productService.getVariantsByProductId(productId);
    }

    @GetMapping("/variant/{variantId}")
    public Product getProductByVariant(@PathVariable Long variantId) {
        return productService.getProductByVariantId(variantId);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }
}
