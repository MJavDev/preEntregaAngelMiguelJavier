import { Router } from "express";
import { ProductManager } from "../Class/productManager.js";
import __dirname from "../utils.js";
const router = Router();
const path = __dirname + "/data/productos.json";
const newProductManager = new ProductManager(path);
router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await newProductManager.getProducts(limit);
  res.json(products);
});
router.get("/:productId", async (req, res) => {
  const productId = req.params.productId;
  const productFinded = await newProductManager.getProductById(productId);
  res.json(productFinded);
});
router.post("/", async (req, res) => {
  const body = req.body;
  const addProduct = await newProductManager.addProduct(body);
  res.json(addProduct);
});
router.put("/:productId", async (req, res) => {
  const body = req.body;
  const productId = req.params.productId;

  const modifyProduct = await newProductManager.modifyProduct(productId, body);
  res.json(modifyProduct);
});
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  const deleteProduct = await newProductManager.deleteProduct(productId);
  res.json(deleteProduct);
});

export default router;