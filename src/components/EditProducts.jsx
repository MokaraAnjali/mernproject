import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./editproduct.css";

function EditProduct() {
    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(""); // Added stock field
    const [availability, setAvailability] = useState("");

    const { id } = useParams(); // Get product ID from URL

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://inventorybackend-j9l1.onrender.com/viewProducts/${id}`);
                const product = response.data;
                setItemName(product.itemName);
                setPrice(product.price);
                setCategory(product.category);
                setStock(product.stock); // Fetch stock value
                setAvailability(product.availability);
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error("Failed to load product data!");
            }
        };
        fetchProduct();
    }, [id]);

    // Handle form submission
    // Example of including Authorization header in PUT request
const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate itemName before submitting
    if (!itemName.trim()) {
        toast.error("Product Name is required!");
        return;
    }

    try {
        const token = localStorage.getItem("token"); // Get token from localStorage or sessionStorage
        const response = await axios.put(
            `https://inventorybackend-j9l1.onrender.com/editProduct/${id}`,
            {
                itemName,
                price,
                category,
                stock,
                availability
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in header
                },
            }
        );

        toast.success(response.data.message || "Product updated successfully!");
    } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product.");
    }
};

    return (
        <>
            <div className="container">
                <h3 className="heading">Update Product Details</h3>
                <Link to="/dashboard" className="back-link">Back</Link>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            value={itemName}
                            required
                            onChange={(e) => setItemName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            value={price}
                            required
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            value={category}
                            required
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            value={stock}
                            required
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Availability</label>
                        <select
                            value={availability}
                            required
                            onChange={(e) => setAvailability(e.target.value)}
                        >
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="submit-btn">Update Product</button>
                    </div>
                </form>
            </div>

            <ToastContainer 
                position="top-left" 
                autoClose={2000} 
                hideProgressBar={false} 
                closeOnClick 
                transition={Bounce} 
                theme="dark" 
            />
        </>
    );
}

export default EditProduct;
