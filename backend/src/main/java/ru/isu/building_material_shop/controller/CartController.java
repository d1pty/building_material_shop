package ru.isu.building_material_shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.isu.building_material_shop.model.Cart;
import ru.isu.building_material_shop.model.User;
import ru.isu.building_material_shop.service.CartService;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    @Autowired
    private CartService cartService;

    // Получить корзину пользователя или создать её, если не существует
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);

        if (cart == null) {
            // Если корзина не найдена, создаем её
            cart = new Cart();
            User user = new User(); // Предположим, что мы получаем пользователя по userId
            user.setId(userId.intValue());
            cart.setUser(user); // Привязываем корзину к пользователю
            cart = cartService.createCart(cart);
        }

        return ResponseEntity.ok(cart);
    }

    @PostMapping("/")
    public ResponseEntity<Cart> createCart(@RequestBody Cart cart) {
        if (cart.getUser() == null || cart.getUser().getId() == null) {
            System.out.println("Ошибка: Пользователь не указан.");
            return ResponseEntity.badRequest().body(null);
        }

        System.out.println("Создание корзины для пользователя с ID: " + cart.getUser().getId());
        Cart createdCart = cartService.createCart(cart);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCart);
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.noContent().build();
    }
}
