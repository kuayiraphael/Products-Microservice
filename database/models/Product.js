const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String },
  type: {
    type: String,
    enum: [
      "Electronics",
      "Fashion",
      "Home and Kitchen",
      "Health and Personal Care",
      "Books and Stationery",
      "Sports and Outdoors",
      "Toys and Games",
      "Beauty and Cosmetics",
      "Automotive",
      "Jewelry and Accessories",
      "Groceries and Food",
      "Baby Products",
      "Pet Supplies",
      "Tools and Hardware",
      "Office Supplies",
      "Musical Instruments",
      "Furniture",
      "Art and Craft",
      "Industrial and Scientific",
      "Video Games and Consoles",
      "Music",
    ],
  },
  unit: Number,
  price: { type: Number, required: true },
  available: Boolean,
  supplier: { type: String, required: true },
  userId: { type: String, required: true }, // Add userId as a string
});

module.exports = mongoose.model("product", ProductSchema);
