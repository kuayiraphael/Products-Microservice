const ProductService = require("../services/product-service");
const { PublishMessage } = require("../utils");
const { auth, isSeller } = require("./middlewares/auth");

productRoutes = (app, channel) => {
  const service = new ProductService();

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.post("/product/create", async (req, res, next) => {
    const { name, desc, img, type, unit, price, available, supplier } =
      req.body;
    console.log(req.body);
    const { data } = await service.CreateProduct({
      name,
      desc,
      img,
      type,
      unit,
      price,
      available,
      supplier,
    });
    return res.json(data);
  });

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.post("/ids", async (req, res, next) => {
    const { ids } = req.body;
    const products = await service.GetSelectedProducts(ids);
    return res.status(200).json(products);
  });

  app.put("/wishlist", auth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id },
      "ADD_TO_WISHLIST"
    );

    PublishMessage(
      channel,
      process.env.CUSTOMER_BINDING_KEY,
      JSON.stringify(data)
    );
    console.log(data)

    res.status(200).json(data.data.product);
    //data.data.product cos payload looks like this:
    // const payload = {
    //     event: event,
    //     data: { userId, product, qty}
    // };
  });

  app.delete("/wishlist/:id", auth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    const { data } = await service.GetProductPayload(
      _id,
      { productId },
      "REMOVE_FROM_WISHLIST"
    );

    PublishMessage(
      channel,
      process.env.CUSTOMER_BINDING_KEY,
      JSON.stringify(data)
    );
    // PublishMessage(
    //   channel,
    //   process.env.SHOPPING_BINDING_KEY,
    //   JSON.stringify(data)
    // );

    res.status(200).json(data.data.product);
  });

  app.put("/cart", auth, async (req, res, next) => {
    const { _id } = req.user;
    

    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id, qty: req.body.qty },
      "ADD_TO_CART"
    );
console.log(data)
    PublishMessage(
      channel,
      process.env.CUSTOMER_BINDING_KEY,
      JSON.stringify(data)
    );
    PublishMessage(
      channel,
      process.env.SHOPPING_BINDING_KEY,
      JSON.stringify(data)
    );

    const response = { product: data.data.product, unit: data.data.qty };

    res.status(200).json(response);
  });

  app.delete("/cart/:id", auth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    const { data } = await service.GetProductPayload(
      _id,
      { productId },
      "REMOVE_FROM_CART"
    );

    PublishMessage(
      channel,
      process.env.CUSTOMER_BINDING_KEY,
      JSON.stringify(data)
    );
    PublishMessage(
      channel,
      process.env.SHOPPING_BINDING_KEY,
      JSON.stringify(data)
    );

    const response = { product: data.data.product, unit: data.data.qty };

    res.status(200).json(response);
  });
};

module.exports = productRoutes;
