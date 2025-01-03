const CartService = require("../services/cart-service");
const { auth } = require("./middlewares/auth");

cartRoutes = (app) => {
  const service = new CartService();

  app.get("/cart", auth, async (req, res) => {
    const userId = req.user._id;
    const { data } = await service.GetCart(userId);
    return res.status(200).json(data);
  });

  app.post("/cart/add", auth, async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const { data } = await service.AddToCart(userId, productId, quantity);
    return res.status(200).json(data);
  });

  app.post("/cart/remove", auth, async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const { data } = await service.RemoveFromCart(userId, productId, quantity);
    return res.status(200).json(data);
  });

  app.delete("/cart/clear", auth, async (req, res) => {
    const userId = req.user._id;
    const { data } = await service.ClearCart(userId);
    return res.status(200).json(data);
  });

  app.get("/cart/total", auth, async (req, res) => {
    const userId = req.user._id;
    const { data } = await service.GetCartTotal(userId);
    return res.status(200).json(data);
  });
};

module.exports = cartRoutes;
