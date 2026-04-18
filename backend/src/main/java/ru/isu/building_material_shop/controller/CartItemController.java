package ru.isu.building_material_shop.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.isu.building_material_shop.model.CartItem;
import ru.isu.building_material_shop.service.CartItemService;

@RestController
@RequestMapping("/api/cart-items")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @PostMapping("/")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody CartItem cartItem) {
        CartItem addedItem = cartItemService.addItemToCart(cartItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedItem);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long itemId, @RequestBody CartItem updatedItem) {
        // Примерный вызов сервиса для обновления
        CartItem item = cartItemService.updateCartItem(itemId, updatedItem);

        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Если товар не найден
        }

        return ResponseEntity.ok(item); // Возвращаем обновленный товар
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItem>> getCartItemsByUserId(@PathVariable Long userId) {
        List<CartItem> cartItems = cartItemService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable Long itemId) {
        cartItemService.removeItemFromCart(itemId);
        return ResponseEntity.noContent().build();
    }
}
