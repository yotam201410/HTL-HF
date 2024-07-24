import { order, order_products, status } from "@prisma/client";
import { addOrder, addProductToOrder, changeProductAmount, findProductInOrder, getOrderByID, removeProductFromOrder, retrieveOrdersByUserID, updateOrderStatus } from '../repositories/orderRepository';
import { gateway } from '../utils/axios';
import { NotFoundError } from '../errors/notFoundError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import axios from "axios";


export const createOrder = async (newOrder: Omit<order, "id" | "status"> & { products: Omit<order_products, "order_id">[] }) => {
    console.log(newOrder);
    for (let product of newOrder.products) {
        try {
            await gateway.get(`products/${product.product_id}`);
        }
        catch (err) {
            throw new NotFoundError(`product with id: ${product.product_id} not found`);
        }
    }
    try {
        await gateway.get(`addresses/${newOrder.address}`)
    }
    catch (err) {
        throw new NotFoundError(`address with id ${newOrder.address} not found`);
    }
    return await addOrder(newOrder);
};

export const insertProductToOrder = async (order_id: string, product_id: string, quantity: number) => {
    try {
        await gateway.get(`products/${product_id}`);
    } catch (error) {
        throw new NotFoundError(`product with id : ${product_id} not found`);
    }

    const order_product: Omit<order_products, "quantity"> & { quantity: number } = {
        order_id,
        product_id,
        quantity,
    };
    try {
        await addProductToOrder(order_product);
    }
    catch (err) {
        throw new NotFoundError(`order with id: ${order_id} not found`);
    }
};

export const getProductInOrder = async (order_id: string, product_id: string) => {
    try {
        return await findProductInOrder(order_id, product_id);
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError(`product with id: ${product_id} not found`);
            }
        }
    }
};

export const deleteProductFromOrder = async (order_id: string, product_id: string) => {
    try { await removeProductFromOrder(order_id, product_id); }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError(`product with id: ${product_id} or order with id: ${order_id} not found`);
            }
        }
    }
};

export const findOrderByID = async (order_id: string) => {
    const order = await getOrderByID(order_id);
    if (!order) {
        throw new NotFoundError(`order with id: ${order_id} not found`);
    }

    return order;
};

export const changeOrderStatus = async (order_id: string, order_status: string) => {
    try {
        return await updateOrderStatus(order_id, getStatus(order_status));
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError("order or status not found");
            }
        }
    }
};

const getStatus = (status_string: string) => {
    switch (status_string) {
        case 'OPENED':
            return status.OPENED;
        case 'PAYED':
            return status.PAYED;
        case 'ON_THE_WAY':
            return status.DELIVERED;
        case 'DELIVERED':
            return status.ON_THE_WAY;
    }
    throw new NotFoundError("status not found");
};

export const updateProductAmount = async (order_id: string, product_id: string, quantity: number) => {
    try {
        await gateway.get(`products/${product_id}`);
    } catch (error) {
        throw new NotFoundError(`product with id : ${product_id} not found`);
    }
    try {
        await changeProductAmount(order_id, product_id, quantity)
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError(`order with id: ${order_id} not found`);
            }
        }
    }
}

export const getUserOrders = async (user_id: string) => {
    try {
        await gateway.get(`users/${user_id}`);
    }
    catch (err) {
        throw new NotFoundError("user not found");
    }
    const orders = await retrieveOrdersByUserID(user_id);

    const orderPromises = orders.map(async (order) => {
        let newOrder = { id: order.id, user_id: order.user_id, address: order.address, status: order.status, order_products: [{}] };
        newOrder.order_products.pop();
        const productPromises = order.order_products.map(async (product) => {
            const response = await gateway.get(`products/${product.product_id}`);
            const productData = response.data;
            return { ...productData, quantity: product.quantity };
        });

        newOrder.order_products = await Promise.all(productPromises);

        return newOrder;
    });

    const newOrders = await Promise.all(orderPromises);

    return newOrders;
};