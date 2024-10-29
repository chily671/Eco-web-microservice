const { FormateData } = require("../utils");
const { ProductRepository } = require("../Database-products");
const uuid = require("uuid");
// UID Generation
function generateID() {
  return uuid.v4();
}
// All Buisiness Logic goes here
class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    try {
      const productResult = await this.repository.createProduct(productInputs);
      return FormateData(productResult);
    } catch (error) {
      throw new Error("Unable to create product");
    }
  }

  async GetAllProducts() {
    try {
      const products = await this.repository.getProducts();
      return FormateData(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async GetNewCollection() {
    try {
      const products = await this.repository.getProductNewCollection();
      return FormateData(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async GetProductById(productId) {
    try {
      const product = await this.repository.FindById(productId);
      return product;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async GetProductPopular(brand) {
    try {
      const products = await this.repository.getProductByBrand(brand);
      return FormateData(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async UpdateProduct(ProductId) {
    try {
      const { id } = req.params;
      const { name, price, quantity } = req.body;
      await this.Product.findByIdAndUpdate(id, { name, price, quantity });
      return res.status(200).json({ message: "Product Updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async RemoveProduct(ProductId) {
    try {
      const product = await this.repository.removeProduct(ProductId);
      return product;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async GetSectedProducts(req, res) {
    try {
      const products = await this.Product.find({
        category: req.params.category,
      });
      return res.status(200).json(FormateData(products));
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async GetProductPayload(userId, { productId, qty }, event) {
    const product = await this.repository.FindById(productId);

    if (product) {
      const payload = {
        event: event,
        data: { userId, product, qty },
      };

      return FormateData(payload);
    } else {
      return FormateData({ error: "No product Available" });
    }
  }
}

module.exports = ProductService;
