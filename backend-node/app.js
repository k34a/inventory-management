import express from "express";
import mongoose from "mongoose";
import cluster from "cluster";
import os from "node:os";
import morgan from "morgan";
import cors from "cors";

import productRouter from "./routers/product.js";
import authRouter from "./routers/auth.js";
import rateLimiter from "./middleware/rate-limiter.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.PORT ?? "8000");

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const app = express();
    app.use(morgan("tiny"));
    app.use(
      cors({
        origin: "http://localhost:3000",
      })
    );
    app.use(express.json());
    app.use(rateLimiter);
    app.use("/api/products", productRouter);
    app.use("/api/auth", authRouter);
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}
