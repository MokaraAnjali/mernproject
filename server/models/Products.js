// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  sku: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  availability: { type: String, required: true, enum: ["Available", "Out of Stock"] },
});

module.exports = mongoose.model("Product", productSchema);
