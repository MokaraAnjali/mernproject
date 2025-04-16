import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://inventorybackend-j9l1.onrender.com/viewProducts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data);
    } catch (err) {
      setError('Error fetching products: ' + err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://inventorybackend-j9l1.onrender.com/deleteitem/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      setError('Error deleting product: ' + err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.replace('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Inventory System</h1>
        <button onClick={logout} className="dashboard-button">Logout</button>
      </header>

      <main className="dashboard-main">
        <h2>Dashboard</h2>
        {error && <p className="error-msg">{error}</p>}

        <h3>Stock Details</h3>
        <div className="products-table-container">
          <div className="flex justify-between items-center mb-6">
            <h4>Products List</h4>
            <Link to="/addProduct" className="dashboard-table-link">
              Add Product
            </Link>
          </div>

          <table>
            <thead>
              <tr>
                <th>Si.No</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Price ($)</th>
                <th>Stock Status</th>
                <th colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.itemName}</td>
                    <td>{product.category}</td>
                    <td>{product.sku}</td>
                    <td>{product.price}</td>
                    <td>{product.availability}</td>
                    <td>
                      <Link to={`/editProduct/${product._id}`} className="dashboard-table-link">
                        Edit
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => deleteProduct(product._id)} className="dashboard-table-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-products">No products available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
