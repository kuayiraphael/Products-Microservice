const ProductRepository = require("../database/repository/product-repository");
const { FormatData } = require("../utils/index");
const { uploadImage } = require("../utils/cloudinary"); // Cloudinary utility
const { indexProduct } = require("../utils/elastic"); // ElasticSearch utility
const { searchProducts } = require("../utils/elastic");

// All Business logic will be here
class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  // async CreateProduct(productInputs){

  //     const productResult = await this.repository.CreateProduct(productInputs)
  //     return FormatData(productResult);
  // }

  async CreateProduct(productInputs) {
    if (productInputs.img) {
      try {
        productInputs.img = await uploadImage(productInputs.img); // Upload image
      } catch (error) {
        console.error("Error uploading image:", error.message);
        throw new Error("Image upload failed.");
      }
    }
    const productResult = await this.repository.CreateProduct(productInputs);

    // Sync with ElasticSearch
    try {
      await indexProduct(productResult);
    } catch (error) {
      console.error("ElasticSearch indexing error:", error.message);
      // Proceed even if ElasticSearch fails, but log the error
    }

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
// ~
  async SearchProducts(query, filters) {
    try {
      const products = await searchProducts(query, filters);
      return FormatData(products);
    } catch (error) {
      console.error("Error searching products:", error.message);
      throw new Error("Product search failed.");
    }
  }
}

module.exports = ProductService;
