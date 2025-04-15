const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

const User = require("./models/user");
const Product = require("./models/Products");
const authenticateToken = require("./middleware/authMiddleware"); // Import the middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("📦 Inventory Database Connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Register Route
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.json({ msg: "User Created! Please Login!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Protected Route to Add Product
app.post("/addproduct", authenticateToken, async (req, res) => {
  const { itemName, category, sku, stock, price, availability } = req.body;

  try {
    const newProduct = new Product({ itemName, category, sku, stock, price, availability });
    await newProduct.save();
    res.json({ message: "Item added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding item" });
  }
});

// View Products Route
app.get("/viewProducts", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
});
// Route to fetch product details by id
app.get("/viewProducts/:id", async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching product" });
  }
});


// Delete Product Route
app.delete("/deleteitem/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting item" });
  }
});

// Update Product Route
app.put("/editProduct/:id", authenticateToken, async (req, res) => {
  const { itemName, price, category, stock, availability } = req.body;

  try {
    // Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields
    product.itemName = itemName;
    product.price = price;
    product.category = category;
    product.stock = stock;
    product.availability = availability;

    // Save updated product
    await product.save();
    res.json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
});
