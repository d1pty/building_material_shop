import React, { useEffect, useState } from "react";
import http from "../../http-common";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await http.get(`/orders/`);
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await http.put(
        `/orders/status/${orderId}?status=${newStatus}`
      );
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: response.data.status } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Админ: Все заказы</h1>
      {orders.length === 0 ? (
        <p className="text-center">Заказов пока нет.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h4 className="mb-0">Заказ №{order.id}</h4>
              <small>Пользователь: {order.user.username}</small>
            </div>
            <div className="card-body">
              <p>
                <strong>Статус:</strong> {order.status}
              </p>
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
                              {item.characteristicName} - {item.characteristicValue}
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
              <div className="mt-3">
                <label htmlFor={`status-select-${order.id}`} className="form-label me-2">
                  Изменить статус:
                </label>
                <select
                  id={`status-select-${order.id}`}
                  className="form-select d-inline-block w-auto me-2"
                  defaultValue={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                >
                  <option value="Ожидает обработки">Ожидает обработки</option>
                  <option value="В процессе">В процессе</option>
                  <option value="Отправлен">Отправлен</option>
                  <option value="Доставлен">Доставлен</option>
                  <option value="Отменен">Отменен</option>
                </select>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
