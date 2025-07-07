import React, { useState } from 'react';
import './Orders.css';

function Orders({ token }) {
  const [orders, setOrders] = useState([]);

  const createOrder = async () => {
    try {
      const response = await fetch('https://adaptnxt-backend-79vr.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create order');
      setOrders([...orders, data]);
      alert('Order created');
    } catch (error) {
      alert(error.message || 'Error');
    }
  };

  return (
    <div className="orders-section">
      <h2>Your Orders</h2>
      <button onClick={createOrder} className="orders-button">Create Order</button>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <h3>Order Total: ${order.total}</h3>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.productId} className="order-item-detail">
                  {item.productId.name} - Qty: {item.quantity} - ${item.price}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;