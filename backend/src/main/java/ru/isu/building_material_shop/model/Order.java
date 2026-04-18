package ru.isu.building_material_shop.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ссылка на пользователя, который создал заказ
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Статус заказа (например, "Ожидает обработки", "В процессе", "Доставлен", "Отменен")
    private String status;

    // Список товаров в заказе
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> orderItems = new ArrayList<>();

    // Дата создания заказа
    private LocalDateTime createdAt;

    // Дата последнего обновления заказа
    private LocalDateTime updatedAt;
}
