const ProductRepository = require("../database/repository/product-repository");
const { FormatData } = require("../utils/index");

// All Business logic will be here
class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    const productResult = await this.repository.CreateProduct(productInputs);
    return FormatData(productResult);
  }

  async GetProducts() {
    const products = await this.repository.Products();

    let categories = {};

    products.map(({ type }) => {
      categories[type] = type;
    });

    return FormatData({
      products,
      categories: Object.keys(categories),
    });
  }

  async GetProductDescription(productId) {
    const product = await this.repository.FindById(productId);
    return FormatData(product);
  }

  async GetProductsByCategory(category) {
    const products = await this.repository.FindByCategory(category);
    return FormatData(products);
  }

  async GetSelectedProducts(selectedIds) {
    const products = await this.repository.FindSelectedProducts(selectedIds);
    return FormatData(products);
  }

  async GetProductPayload(userId, { productId, qty }, event) {
    const product = await this.repository.FindById(productId);

    if (product) {
      const payload = {
        event: event,
        data: { userId, product, qty },
      };

      return FormatData(payload);
    } else {
      return FormatData({ error: "No product Available" });
    }
  }
  async UpdateProduct(productId, updateData) {
    try {
      const product = await this.repository.UpdateProduct(
        productId,
        updateData
      );
      if (!product) {
        return FormatData(null, "Product not found", 404);
      }
      return FormatData(product);
    } catch (error) {
      throw new Error(error);
    }
  }
  // product-service.js
  async GetProductsByUserId(userId) {
    const products = await this.repository.FindByUserId(userId);
    return FormatData(products);
  }
  async DeleteProduct(productId) {
    try {
      const product = await this.repository.DeleteProduct(productId);
      if (!product) {
        return FormatData(null, "Product not found", 404);
      }
      return FormatData({ message: "Product deleted successfully" });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ProductService;
