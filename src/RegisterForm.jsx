import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InventoryForm() {
  const [sku, setSku] = useState(""); // Added SKU state
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("Available");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://inventorybackend-j9l1.onrender.com/addproduct", {
        sku, // Include SKU in API request
        itemName,
        category,
        stock,
        price,
        availability,
      });

      toast.success(response.data.message || "Item added successfully!");
      
      // Reset form fields
      setSku("");
      setItemName("");
      setCategory("");
      setStock("");
      setPrice("");
      setAvailability("Available");
    } catch (error) {
      toast.error("Failed to add item. Please try again.");
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add Inventory Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* SKU Field */}
        <div>
          <label className="block font-medium">SKU (Stock Keeping Unit)</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Item Name */}
        <div>
          <label className="block font-medium">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block font-medium">Stock Quantity</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium">Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block font-medium">Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={2000} transition={Bounce} theme="colored" />
    </div>
  );
}

export default InventoryForm;
