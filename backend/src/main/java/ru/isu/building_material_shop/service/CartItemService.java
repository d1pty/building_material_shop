package ru.isu.building_material_shop.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.isu.building_material_shop.model.CartItem;
import ru.isu.building_material_shop.repository.CartItemRepository;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public CartItem addItemToCart(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public void removeItemFromCart(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    public List<CartItem> getCartItemsByUserId(Long userId) {
        return cartItemRepository.findByCartUserId(userId);
    }

    public CartItem updateCartItem(Long itemId, CartItem updatedItem) {
        // Ищем товар в корзине по ID
        Optional<CartItem> existingItemOptional = cartItemRepository.findById(itemId);
        if (!existingItemOptional.isPresent()) {
            return null; // Если товар не найден
        }

        CartItem existingItem = existingItemOptional.get();

        // Обновляем количество товара
        existingItem.setQuantity(updatedItem.getQuantity());

        // Сохраняем изменения
        return cartItemRepository.save(existingItem);
    }
}
