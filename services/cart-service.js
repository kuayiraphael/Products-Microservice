const CartRepository = require("../database/repository/cart-repository");
const ProductRepository = require("../database/repository/product-repository");
const { FormatData } = require("../utils");

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async GetCart(userId) {
    const cart = await this.cartRepository.GetCart(userId);
    return FormatData(cart);
  }

  async AddToCart(userId, productId, quantity) {
    const product = await this.productRepository.FindById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const updatedCart = await this.cartRepository.AddToCart(userId, productId, quantity);
    return FormatData(updatedCart);
  }

  async RemoveFromCart(userId, productId, quantity) {
    const updatedCart = await this.cartRepository.RemoveFromCart(userId, productId, quantity);
    return FormatData(updatedCart);
  }

  async ClearCart(userId) {
    await this.cartRepository.ClearCart(userId);
    return FormatData({ success: true });
  }

  async GetCartTotal(userId) {
    const cart = await this.cartRepository.GetCart(userId);

    if (!cart) return FormatData({ subtotal: 0, shipping: 0, total: 0 });

    const subtotal = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5; // Example logic
    const total = subtotal + shipping;

    return FormatData({ subtotal, shipping, total });
  }
}

module.exports = CartService;
