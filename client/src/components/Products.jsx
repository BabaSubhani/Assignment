import React, { useState, useEffect } from 'react';
import './Products.css';

function Products({ token, role }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [description, setDescription] = useState('');


  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://adaptnxt-backend-79vr.onrender.com/api/products?page=${page}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch products');
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      alert(error.message || 'Error fetching products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  const addProduct = async () => {
    try {
      const response = await fetch('https://adaptnxt-backend-79vr.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, price: Number(price), category: categoryInput, description })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add product');
      alert('Product added');
      fetchProducts();
      setName('');
      setPrice('');
      setCategoryInput('');
      setDescription('');
    } catch (error) {
      alert(error.message || 'Error');
    }
  };

  return (
    <div className="products-section">
      <h2>Products</h2>
      <div className="products-search">
        <div className="products-field">
          <label>Search Products</label>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="products-input"
          />
        </div>
        <div className="products-field">
          <label>Category</label>
          <input
            type="text"
            placeholder="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="products-input"
          />
        </div>
        <button onClick={fetchProducts} className="products-button">Search</button>
      </div>
      <div className="products-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <span>{product.name} - ${product.price} - {product.category}</span>
            <button onClick={() => navigator.clipboard.writeText(product._id)} className="products-action-button">
              Copy ID
            </button>
          </div>
        ))}
      </div>
      <div className="products-pagination">
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)} className="products-button">Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} className="products-button">Next</button>
      </div>
      {role === 'admin' && (
        <div className="products-add">
          <h3>Add New Product</h3>
          <div className="products-add-form">
            <div className="products-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="products-input"
              />
            </div>
            <div className="products-field">
              <label>Price</label>
              <input
                type="number"
                placeholder="Product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="products-input"
              />
            </div>
            <div className="products-field">
              <label>Category</label>
              <input
                type="text"
                placeholder="Product category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="products-input"
              />
            </div>
            <div className="products-field">
              <label>Description</label>
              <input
                type="text"
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="products-input"
              />
            </div>
            <button onClick={addProduct} className="products-button">Add Product</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;