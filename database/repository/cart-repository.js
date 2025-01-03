const Cart = require("../models/Cart");

class CartRepository {
  async GetCart(userId) {
    return await Cart.findOne({ userId }).populate("items.productId");
  }

  async AddToCart(userId, productId, quantity) {
    const cart =
      (await Cart.findOne({ userId })) || new Cart({ userId, items: [] });
    const item = cart.items.find((item) => item.productId.equals(productId));

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    return await cart.save();
  }

  async RemoveFromCart(userId, productId, quantity) {
    const cart = await Cart.findOne({ userId });

    if (!cart) return null;

    const item = cart.items.find((item) => item.productId.equals(productId));

    if (item) {
      if (quantity >= item.quantity) {
        cart.items = cart.items.filter(
          (item) => !item.productId.equals(productId)
        );
      } else {
        item.quantity -= quantity;
      }
    }

    return await cart.save();
  }

  //   async ClearCart(userId) {
  //     return await Cart.findOneAndDelete({ userId });
  //   }
  async ClearCart(userId) {
    // Ensure that userId is an ObjectId
    const objectIdUserId = mongoose.Types.ObjectId(userId);

    return await Cart.findOneAndDelete({ userId: objectIdUserId });
  }
}

module.exports = CartRepository;
