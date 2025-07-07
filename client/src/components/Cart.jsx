import React, { useState, useEffect } from 'react';
import './Cart.css';

function Cart({ token }) {
  const [cart, setCart] = useState(null);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const fetchCart = async () => {
    try {
      const response = await fetch('https://adaptnxt-backend-79vr.onrender.com/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch cart');
      setCart(data);
    } catch (error) {
      alert(error.message || 'Error fetching cart');
    }
  };

  const addToCart = async () => {
    try {
      const response = await fetch('https://adaptnxt-backend-79vr.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: Number(quantity) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add to cart');
      alert('Added to cart');
      fetchCart();
      setProductId('');
      setQuantity(1);
    } catch (error) {
      alert(error.message || 'Error');
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await fetch(`https://adaptnxt-backend-79vr.onrender.com/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: Number(quantity) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update cart');
      alert('Cart updated');
      fetchCart();
    } catch (error) {
      alert(error.message || 'Error');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`https://adaptnxt-backend-79vr.onrender.com/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to remove from cart');
      alert('Removed from cart');
      fetchCart();
    } catch (error) {
      alert(error.message || 'Error');
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  return (
    <div className="cart-section">
      <h2>Your Cart</h2>
      <div className="cart-form">
        <div className="cart-field">
          <label>Product ID</label>
          <input
            type="text"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="cart-input"
          />
        </div>
        <div className="cart-field">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="cart-input"
          />
        </div>
        <button onClick={addToCart} className="cart-button">Add to Cart</button>
        <button onClick={fetchCart} className="cart-button cart-button-secondary">Refresh Cart</button>
      </div>
      {cart && (
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.productId._id} className="cart-item">
              <span>{item.productId.name} - Qty: {item.quantity} - ${item.productId.price * item.quantity}</span>
              <div className="cart-item-actions">
                <button onClick={() => updateCartItem(item.productId._id, item.quantity + 1)} className="cart-action-button">
                  +
                </button>
                <button onClick={() => updateCartItem(item.productId._id, Math.max(1, item.quantity - 1))} className="cart-action-button">
                  -
                </button>
                <button onClick={() => removeFromCart(item.productId._id)} className="cart-action-button cart-action-remove">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;