import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./addproducts.css";

function AddProduct() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("Available");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ Please login to add items!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/addproduct",
        { itemName, category, sku, stock, price, availability },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Make sure the token is valid and sent correctly
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message || "✅ Item added successfully!");
      // Reset form fields
      setItemName("");
      setCategory("");
      setSku("");
      setStock("");
      setPrice("");
      setAvailability("Available");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Error adding item!");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Adding Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item Name"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="SKU"
          required
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />
        <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <button type="submit">Add Item</button>
      </form>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} theme="dark" />
    </div>
  );
}

export default AddProduct;
