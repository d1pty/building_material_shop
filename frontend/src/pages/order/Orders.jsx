import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import http from "../../http-common";

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetchOrders(user.id);
    }
  }, [user]);

  const fetchOrders = async (userId) => {
    try {
      const response = await http.get(`/orders/user/${userId}`);
      let ordersData = response.data.map((order) => ({
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          variantId: item.variant.id,
          characteristicName: item.variant.characteristicName,
          characteristicValue: item.variant.characteristicValue,
        })),
        user: {
          id: order.user.id,
          username: order.user.username,
          role: order.user.role,
        },
      }));

      ordersData = await Promise.all(
        ordersData.map(async (order) => {
          const updatedOrderItems = await Promise.all(
            order.orderItems.map(async (item) => {
              const productResponse = await http.get(
                `/products/variant/${item.variantId}`
              );
              return {
                ...item,
                name: productResponse.data.name,
                price: productResponse.data.price,
                characteristicName: item.characteristicName,
                characteristicValue: item.characteristicValue,
              };
            })
          );
          return { ...order, orderItems: updatedOrderItems };
        })
      );

      setOrders(ordersData);
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Мои заказы</h1>
      {orders.length === 0 ? (
        <p className="text-center">У вас нет заказов.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Заказ №{order.id}</h4>
              <small>Статус: {order.status}</small>
            </div>
            <div className="card-body">
              <p>
                <strong>Дата создания:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Дата обновления:</strong>{" "}
                {new Date(order.updatedAt).toLocaleString()}
              </p>
              <h5>Товары:</h5>
              {order.orderItems && order.orderItems.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-1">
                            <strong>{item.name}</strong>
                          </p>
                          <p className="mb-1">
                            Цена: {item.price} руб. &nbsp;|&nbsp; Количество:{" "}
                            {item.quantity}
                          </p>
                          {(item.characteristicName !== "NONE" ||
                            item.characteristicValue !== "NONE") && (
                            <p className="mb-1 text-muted">
                              {item.characteristicName} -{" "}
                              {item.characteristicValue}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Нет товаров в этом заказе.</p>
              )}
              <p className="mt-3">
                <strong>Пользователь:</strong> {order.user.username}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Orders);
