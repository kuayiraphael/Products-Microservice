const mongoose = require("mongoose");
const Product = require("../models/Product");

class ProductRepository {
  async CreateProduct({
    name,
    desc,
    img,
    type,
    unit,
    price,
    available,
    supplier,
    userId,
  }) {
    if (!userId) {
      userId = "67754080da81ed6e76ac97eb";
    }
    const product = new Product({
      name,
      desc,
      img,
      type,
      unit,
      price,
      available,
      supplier,
      userId,
    });

    const productResult = await product.save();
    return productResult;
  }

  async Products() {
    return await Product.find();
  }
  // product-repository.js
  async FindByUserId(userId) {
    return await Product.find({ userId });
  }

  async FindById(id) {
    return await Product.findById(id);
  }

  async FindByCategory(category) {
    const products = await Product.find({ type: category });

    return products;
  }

  async FindSelectedProducts(selectedIds) {
    const products = await Product.find()
      .where("_id")
      .in(selectedIds.map((_id) => _id))
      .exec();
    return products;
  }
  async UpdateProduct(id, updateData) {
    return Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return updated document
    );
  }

  async DeleteProduct(id) {
    return Product.findByIdAndDelete(id);
  }
}

module.exports = ProductRepository;
