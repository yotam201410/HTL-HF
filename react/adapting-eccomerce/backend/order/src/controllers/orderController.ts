import { Response, Request, NextFunction } from "express";
import { changeOrderStatus, createOrder, deleteProductFromOrder, getProductInOrder, getUserOrders, insertProductToOrder, updateProductAmount } from "../services/orderSerivce";
import { StatusCodes } from "http-status-codes";
import { getOrderByID } from "../repositories/orderRepository";

export const createOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = await createOrder({ user_id: req.body.user_id, address: req.body.address_id, products: req.body.products });
        res.status(StatusCodes.OK).send(id);
    }
    catch (err) {
        next(err);
    }
}

export const insertProductToOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await insertProductToOrder(req.body.order_id, req.body.product_id, req.body.quantity);
        res.status(StatusCodes.OK).send("product added to order");
    }
    catch (err) {
        next(err);
    }
}

export const getProductInOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await getProductInOrder(req.params.order_id, req.params.product_id);
        res.status(StatusCodes.OK).json(product);
    }
    catch (err) {
        next(err);
    }
}

export const deleteProductFromOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteProductFromOrder(req.body.order_id, req.body.body.product_id);
    }
    catch (err) {
        next(err);
    }
}

export const getOrderByIDHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await getOrderByID(req.body.order_id);

        res.status(StatusCodes.OK).json(order);
    }
    catch (err) {
        next(err);
    }
}

export const changeOrderStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return await changeOrderStatus(req.body.order_id, req.body.order_stats);
    }
    catch (err) {
        next(err);
    }
}

export const updateProductAmountHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateProductAmount(req.body.order_id, req.body.product_id, req.body.quantity);
    }
    catch (err) {
        next(err);
    }
}

export const getUserOrdersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await getUserOrders(req.params.user_id);
        res.status(StatusCodes.OK).json(orders);
    }
    catch (err) {
        next(err);
    }
}