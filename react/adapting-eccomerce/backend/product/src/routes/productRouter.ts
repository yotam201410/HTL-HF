import { Router } from "express";
import { createProductHandler, findProductByIdHandler, findProductsByQueryHandler, removeProductHandler, updateProductPriceHandler } from "../controllers/productController";

export const productRouter = Router();

productRouter.post("/", createProductHandler);
productRouter.delete("/", removeProductHandler);
productRouter.patch("/price", updateProductPriceHandler);
productRouter.get("/:id", findProductByIdHandler);
productRouter.get("/", findProductsByQueryHandler);