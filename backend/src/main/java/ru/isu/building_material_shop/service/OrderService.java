package ru.isu.building_material_shop.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.isu.building_material_shop.model.Cart;
import ru.isu.building_material_shop.model.CartItem;
import ru.isu.building_material_shop.model.Order;
import ru.isu.building_material_shop.model.OrderItem;
import ru.isu.building_material_shop.repository.CartItemRepository;
import ru.isu.building_material_shop.repository.CartRepository;
import ru.isu.building_material_shop.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    // Метод для создания заказа из корзины
    public Order createOrderFromCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Корзина пуста");
        }

        // Создаем новый заказ
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setStatus("Ожидает обработки");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        // Добавляем элементы в заказ
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setVariant(cartItem.getVariant());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);
            order.getOrderItems().add(orderItem);
        }

        // Сохраняем заказ
        order = orderRepository.save(order);

        // Очищаем корзину
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return order;
    }

    // Получение всех заказов пользователя
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // Обновление статуса заказа
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Заказ не найден"));
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();  // Или другая логика для получения всех заказов
    }
}
