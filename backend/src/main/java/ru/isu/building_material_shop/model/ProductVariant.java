package ru.isu.building_material_shop.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    private String characteristicName;

    private String characteristicValue;

    public ProductVariant() {}

    public ProductVariant(String characteristicName, String characteristicValue) {
        this.characteristicName = characteristicName;
        this.characteristicValue = characteristicValue;
    }

    @Override
    public String toString() {
        return "ProductVariant{id=" + id + ", characteristicName='" + characteristicName + "', characteristicValue='" + characteristicValue + "'}";
    }
}
