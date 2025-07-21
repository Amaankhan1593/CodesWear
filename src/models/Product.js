// src/models/Product.js

import mongoose from "mongoose";

// Define the Product Schema
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    category: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    price: { type: Number },
    availableQty: { type: Number, required: true },
  },
  { timestamps: true } // Correct the `timestamp` option to `timestamps`
);

// Avoid model redefinition by checking if the model already exists
mongoose.models = {}

export default mongoose.model("Product",ProductSchema);
