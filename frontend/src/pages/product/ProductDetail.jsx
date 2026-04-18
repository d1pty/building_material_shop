import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import http from "../../http-common";
import { connect } from "react-redux";

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [hasVariants, setHasVariants] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = () => {
    http.get(`/products/${id}`)
      .then((response) => {
        const productData = response.data;
        setProduct(productData);

        if (!productData.variants || productData.variants.length === 0) {
          setSelectedVariant({ characteristicName: "NONE", characteristicValue: "NONE" });
          setHasVariants(false);
        } else {
          const filteredVariants = productData.variants.filter(
            (v) => v.characteristicName !== "NONE"
          );
          if (filteredVariants.length > 0) {
            setSelectedVariant(filteredVariants[0]);
            setHasVariants(true);
          } else {
            setSelectedVariant({ characteristicName: "NONE", characteristicValue: "NONE" });
            setHasVariants(false);
          }
        }
      })
      .catch((e) => console.log("Ошибка при загрузке товара:", e));
  };

  const addToCart = async () => {
    if (quantity <= 0 || !selectedVariant) {
      alert("Выберите корректное количество товара.");
      return;
    }

    if (!user) {
      alert("Пожалуйста, войдите в систему.");
      return;
    }

    try {
      const cartResponse = await http.get(`/carts/${user.id}`);
      const cart = cartResponse.data;

      const variantId = selectedVariant.id || product.variants[0].id;
      const existingItem = cart.cartItems.find((item) => item.variant.id === variantId);

      if (existingItem) {
        // Если товар с таким variantId найден, увеличиваем его количество
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };
        await http.put(`/cart-items/${existingItem.id}`, updatedItem); // Обновляем количество
        alert("Количество товара в корзине обновлено!");
      } else {
        // Если товара с таким variantId нет, добавляем новый товар
        const cartItem = {
          cart: { id: cart.id },
          variant: { id: variantId },
          quantity,
        };
        await http.post("/cart-items/", cartItem); // Добавляем новый товар
        alert("Товар добавлен в корзину!");
      }

      setQuantity(1); // Сброс количества товара после добавления
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Корзина не найдена.");
      } else {
        console.error("Ошибка при добавлении товара в корзину:", error);
        alert("Ошибка при добавлении товара.");
      }
    }
  };

  if (!product) {
    return (
      <div className="container text-center mt-5">
        <h3>Загрузка...</h3>
      </div>
    );
  }

  return (
    <div
      className="container mt-4"
      style={{ background: "#d2b48c", padding: "20px", borderRadius: "10px" }}
    >
      <div className="card mx-auto" style={{ maxWidth: "600px" }}>
        <div
          style={{
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#e5d4a1",
          }}
        >
          {product.imagineUrl ? (
            <img
              src={`http://localhost:8080${product.imagineUrl}`}
              alt={product.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          ) : (
            <div style={{ color: "#704214", fontSize: "18px" }}>
              Без изображения
            </div>
          )}
        </div>

        <div className="card-body text-center">
          <h4 className="card-title">{product.name}</h4>
          <p className="card-text">{product.description}</p>
          <p className="card-text">
            <strong>{product.price} руб.</strong>
          </p>

          {hasVariants ? (
            <div>
              <h5>Выберите вариант:</h5>
              <select
                className="form-select mb-3"
                value={selectedVariant?.characteristicName || ""} // Обратите внимание, что тут мы правильно связываем значение
                onChange={(e) => {
                  // Ищем выбранный вариант в списке и обновляем состояние
                  const variant = product.variants.find(
                    (v) => v.characteristicName === e.target.value
                  );
                  if (variant) {
                    setSelectedVariant(variant); // Обновляем выбранный вариант
                  }
                }}
              >
                {product.variants
                  .filter((v) => v.characteristicName !== "NONE")
                  .map((variant, index) => (
                    <option key={index} value={variant.characteristicName}>
                      {variant.characteristicName}: {variant.characteristicValue}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <p></p>
          )}

          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Количество:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="form-control"
            />
          </div>

          <button className="btn btn-success" onClick={addToCart}>
            Добавить в корзину
          </button>

          <Link to="/listProducts" className="btn btn-secondary mt-3">
            Назад к товарам
          </Link>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProductDetail);
