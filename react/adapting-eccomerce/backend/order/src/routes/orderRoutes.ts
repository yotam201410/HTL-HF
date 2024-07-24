import { Router } from "express";
import { changeOrderStatusHandler, createOrderHandler, deleteProductFromOrderHandler, getOrderByIDHandler, getProductInOrderHandler, getUserOrdersHandler, insertProductToOrderHandler, updateProductAmountHandler } from "../controllers/orderController";

export const orderRouter = Router();

orderRouter.post("/", createOrderHandler);
orderRouter.post("/products", insertProductToOrderHandler);
orderRouter.patch("/:order_id/products/:product_id", getProductInOrderHandler);
orderRouter.delete("/products", deleteProductFromOrderHandler);
orderRouter.get("/:order_id", getOrderByIDHandler);
orderRouter.patch("/status", changeOrderStatusHandler);
orderRouter.patch("/products", updateProductAmountHandler);
orderRouter.get("/users/:user_id", getUserOrdersHandler);