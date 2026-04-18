package ru.isu.building_material_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.building_material_shop.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}