// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const CartSchema = new Schema({
//   userId: { type: String, required: true }, // Assuming each user has a unique ID
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("cart", CartSchema);
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
