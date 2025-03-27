import Router from "express";
import authMiddleware from "../middleware/auth.js";
import Product from "../schema/product.js";
import { isValidObjectId } from "mongoose";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  const product = new Product(req.body);
  const error = product.validateSync();
  if (error) {
    return res.status(400).json({
      error: Object.keys(error.errors).map((key) => ({
        [key]: error.errors[key].message,
      })),
    });
  }
  await product.save();
  res.json(product);
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: [{ id: "Invalid product id" }] });
  }
  const exists = await Product.exists({ _id: req.params.id });
  if (!exists) {
    return res.status(404).json({ error: [{ id: "Product not found" }] });
  }
  const product = await Product.findById(req.params.id);
  res.json(product);
});

router.put("/:id", authMiddleware, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: [{ id: "Invalid product id" }] });
  }
  const exists = await Product.exists({ _id: req.params.id });
  if (!exists) {
    return res.status(404).json({ error: [{ id: "Product not found" }] });
  }
  let product;
  try {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: Object.keys(error.errors).map((key) => ({
        [key]: error.errors[key].message,
      })),
    });
  }
  res.json(product);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: [{ id: "Invalid product id" }] });
  }
  const exists = await Product.exists({ _id: req.params.id });
  if (!exists) {
    return res.status(404).json({ error: [{ id: "Product not found" }] });
  }
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
