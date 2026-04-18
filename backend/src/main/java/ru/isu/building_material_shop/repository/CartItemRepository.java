
package ru.isu.building_material_shop.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.building_material_shop.model.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartUserId(Long userId);
    List<CartItem> findByCartId(Long cartId);
    
}
