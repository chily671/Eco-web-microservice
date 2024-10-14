const mongoose = require("mongoose");
const { ProductModel } = require("../models");
const uuid = require("uuid");
// UID Generation
function generateID() {
  return uuid.v4();
}
//Dealing with data base operations
class ProductRepository {
  async createProduct({
    name,
    image,
    brand,
    model,
    price,
    sex,
    size,
    year,
    available,
  }) {
    try {
      const id = generateID();
      const product = new ProductModel({
        id,
        name,
        image,
        brand,
        model,
        price,
        sex,
        size,
        year,
        available,
      });
      const productResult = await product.save();
      console.log(productResult);
      return productResult;
    } catch (error) {
      return error;
    }
  }

  async removeProduct(product_id) {
    try {
      const product = await ProductModel.findOneAndDelete(product_id);
      const productResult = await product.save();
      return productResult;
    } catch (error) {
      return error;
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      return error;
    }
  }

  async getProductByBrand(brand) {
    try {
      const products = await ProductModel.find({ brand });
      return products;
    } catch (error) {
      return error;
    }
  }

  async getProductNewCollection() {
    try {
      const products = await ProductModel.find();
      const newCollection = products.slice(1).slice(-8);
      return newCollection;
    } catch (error) {
      return error;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (error) {
      return error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const product = await Product;
      Model.findByIdAndUpdate(id, productData);
      return product;
    } catch (error) {
      return error;
    }
  }
}

module.exports = ProductRepository;
