package ru.isu.building_material_shop.service;

import jakarta.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
import ru.isu.building_material_shop.repository.CategoryRepository;
import ru.isu.building_material_shop.repository.ProductCategoryRepository;
import ru.isu.building_material_shop.repository.ProductRepository;
import ru.isu.building_material_shop.repository.ProductVariantRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Value("${file.upload.directory}")
    private String uploadDirectory; // Путь для загрузки

    // Метод для загрузки изображения
    public ResponseEntity<String> uploadPhoto(Long id, MultipartFile file) {
        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            try {
                // Создание пути для сохранения файла
                String projectPath = System.getProperty("user.dir");
                String uploadPath = projectPath + File.separator + uploadDirectory;
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) {
                    boolean dirCreated = uploadDir.mkdirs();
                    if (!dirCreated) {
                        throw new IOException("Не удалось создать директорию для загрузки.");
                    }
                }

                // Сохраняем файл
                String fileName = file.getOriginalFilename();
                Path filePath = Path.of(uploadPath, fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Сохраняем путь к файлу в базе данных
                product.setImagineUrl("/uploads/" + fileName);
                productRepository.save(product);

                return ResponseEntity.ok("Файл успешно загружен");

            } catch (IOException e) {
                e.printStackTrace();  // Логируем ошибку
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка загрузки файла: " + e.getMessage());
            }
        } else {
            return ResponseEntity.notFound().build();  // Если продукт не найден
        }
    }

    // Метод для удаления изображения
    public ResponseEntity<String> deletePhoto(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            String imagePath = product.getImagineUrl();

            if (imagePath != null && !imagePath.isEmpty()) {
                // Получаем путь к файлу и удаляем его
                String projectPath = System.getProperty("user.dir");
                String uploadPath = projectPath + File.separator + "uploads";
                File fileToDelete = new File(uploadPath, imagePath.substring(imagePath.lastIndexOf("/") + 1));

                if (fileToDelete.exists()) {
                    fileToDelete.delete();
                }

                // Обнуляем ссылку на изображение в базе данных
                product.setImagineUrl(null);
                productRepository.save(product);

                return ResponseEntity.ok("Фото успешно удалено");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Фото не найдено");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Продукт не найден");
        }
    }

    // Получить все продукты
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductWithCategoriesAndVariants(Long id) {
        // Получаем продукт по ID
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));

        // Загружаем категории через промежуточную сущность ProductCategory
        List<ProductCategory> productCategories = productCategoryRepository.findByProductId(id);
        product.setProductCategories(productCategories);

        // Загружаем варианты через промежуточную сущность ProductVariant
        List<ProductVariant> productVariants = productVariantRepository.findByProductId(id);
        product.setVariants(productVariants);

        return product;
    }

    // Создать новый продукт
    public Product createProduct(Product product, MultipartFile file) throws IOException {
        // Путь для сохранения файла
        String projectPath = System.getProperty("user.dir");
        String uploadPath = projectPath + File.separator + uploadDirectory;
        File uploadDir = new File(uploadPath);

        if (!uploadDir.exists()) {
            boolean dirCreated = uploadDir.mkdirs();
            if (!dirCreated) {
                throw new IOException("Failed to create upload directory");
            }
        }

        // Сохранение файла
        String fileName = file.getOriginalFilename();
        Path filePath = Path.of(uploadPath, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Устанавливаем путь к изображению
        product.setImagineUrl("/uploads/" + fileName);

        // Сохраняем продукт с путем к изображению в базу данных
        return productRepository.save(product);
    }

    // Обновить продукт
    public Product updateProduct(Long id, String name, String description, Double price, MultipartFile file) throws IOException {
        // Проверяем, существует ли продукт с данным id
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (!optionalProduct.isPresent()) {
            throw new RuntimeException("Product not found with id " + id);
        }

        Product product = optionalProduct.get();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);

        // Если файл был передан, сохраняем его
        if (file != null && !file.isEmpty()) {
            // Удаляем старое изображение, если оно было
            String oldImagePath = product.getImagineUrl();
            if (oldImagePath != null) {
                deleteOldImage(oldImagePath);  // Напишите логику для удаления старого файла
            }

            // Сохраняем новый файл
            String newImagePath = saveFile(file);
            product.setImagineUrl(newImagePath);
        }

        return productRepository.save(product);
    }

    private String saveFile(MultipartFile file) throws IOException {
        // Путь для сохранения файла
        String projectPath = System.getProperty("user.dir");
        String uploadPath = projectPath + File.separator + uploadDirectory;
        File uploadDir = new File(uploadPath);

        if (!uploadDir.exists()) {
            boolean dirCreated = uploadDir.mkdirs();
            if (!dirCreated) {
                throw new IOException("Failed to create upload directory");
            }
        }

        // Сохранение файла
        String fileName = file.getOriginalFilename();
        Path filePath = Path.of(uploadPath, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Возвращаем путь к изображению
        return "/uploads/" + fileName;
    }

    private void deleteOldImage(String oldImagePath) {
        // Логика для удаления старого изображения (если требуется)
        String projectPath = System.getProperty("user.dir");
        String filePath = projectPath + File.separator + oldImagePath;
        File oldFile = new File(filePath);
        if (oldFile.exists()) {
            oldFile.delete();
        }
    }

    // Удалить продукт
    public void deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        } else {
            throw new RuntimeException("Product not found with id " + id);
        }
    }

    // Добавить категорию к продукту
    public void addCategoryToProduct(Long productId, Long categoryId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));

        ProductCategory productCategory = new ProductCategory();
        productCategory.setProduct(product);
        productCategory.setCategory(category);
        productCategoryRepository.save(productCategory);
    }

    // Добавить вариант продукта
    public void addVariantToProduct(Long productId, ProductVariant productVariant) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        productVariant.setProduct(product);
        productVariantRepository.save(productVariant);
    }

    // Поиск всех вариантов у продукта
    public List<ProductVariant> getVariantsByProductId(Long productId) {
        return productVariantRepository.findByProductId(productId);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product getProductByVariantId(Long variantId) {
        return productVariantRepository.findById(variantId)
                .map(ProductVariant::getProduct) // Извлекаем продукт
                .orElseThrow(() -> new EntityNotFoundException("Вариант не найден"));
    }
}
