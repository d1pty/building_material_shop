import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import http from "../../http-common";

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [productData, setProductData] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems, productData]);

  const fetchCartItems = async () => {
    try {
      const response = await http.get(`/cart-items/user/${user.id}`);
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
        response.data.forEach((item) => {
          fetchProductData(item.variant.id);
        });
      } else {
        console.error("Некорректный формат данных:", response.data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке элементов корзины:", error);
    }
  };

  const fetchProductData = async (variantId) => {
    try {
      const response = await http.get(`/products/variant/${variantId}`);
      setProductData((prevData) => ({
        ...prevData,
        [variantId]: response.data,
      }));
    } catch (error) {
      console.error("Ошибка при загрузке данных о товаре:", error);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await http.delete(`/cart-items/${cartItemId}`);
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error("Ошибка при удалении элемента из корзины:", error);
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      const product = productData[item.variant.id];
      if (product) {
        total += product.price * item.quantity;
      }
    });
    setTotalPrice(total);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Ваша корзина пуста. Добавьте товары в корзину для оформления заказа.");
      return;
    }

    const order = {
      items: cartItems.map((item) => {
        const product = productData[item.variant.id];
        return {
          product: { id: product?.id },
          quantity: item.quantity,
        };
      }),
      status: "PROCESSING",
    };

    try {
      const response = await http.post(`/orders/create/${user.id}`, order);
      if (response.status === 201) {
        setCartItems([]);
        alert("Заказ успешно оформлен!");
      }
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      alert("Ошибка при оформлении заказа. Попробуйте позже.");
    }
  };

  return (
    <div
      className="container mt-3"
      style={{ background: "#d2b48c", padding: "20px", borderRadius: "10px" }}
    >
      <h2 style={{ color: "#704214" }}>Корзина</h2>
      {cartItems.length === 0 ? (
        <p style={{ color: "#704214" }}>Ваша корзина пуста.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => {
              const product = productData[item.variant.id];
              return (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    background: "#fff8e1",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {product && product.imagineUrl && (
                    <div style={{ marginRight: "10px" }}>
                      <img
                        src={`http://localhost:8080${product.imagineUrl}`}
                        alt={product.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  )}
                  <div style={{ color: "#704214" }}>
                    <h4>{product?.name}</h4>
                    {(item.variant.characteristicName!== "NONE" ||
                            item.variant.characteristicValue !== "NONE") && (
                            <p className="mb-1 text-muted">
                              {item.variant.characteristicName} - {item.variant.characteristicValue}
                            </p>
                          )}
                    <p>Цена: {product?.price} руб.</p>
                    <p>Количество: {item.quantity}</p>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="btn btn-danger"
                      style={{
                        backgroundColor: "#704214",
                        borderColor: "#704214",
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <p style={{ color: "#704214" }}>
            <strong>Общая стоимость:</strong> {totalPrice} руб.
          </p>
          {/* Кнопка для оформления заказа */}
          <button
            onClick={handlePlaceOrder}
            className="btn btn-primary"
            style={{
              backgroundColor: "#704214",
              borderColor: "#704214",
              marginTop: "20px",
            }}
          >
            Совершить заказ
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Cart);
