import { order, order_products, status } from "@prisma/client";
import { prisma } from "../utils/dbClient";

export const addOrder = async (
    newOrder: Omit<order, "id" | "status"> & {
        products?: Omit<order_products, "order_id">[];
    }
) => {
    const { products, ...orderData } = newOrder;

    const order = await prisma.order.create({
        data: {
            ...orderData,
            order_products: products
                ? {
                      create: products.map((product) => ({
                          product_id: product.product_id,
                          quantity: product.quantity,
                      })),
                  }
                : undefined,
        },
    });
    return order.id;
};

export const addProductToOrder = async (
    order_product: Omit<order_products, "quantity"> & { quantity: number }
) => {
    const existingProduct = await findProductInOrder(
        order_product.order_id,
        order_product.product_id
    );
    if (!existingProduct) {
        await prisma.order_products.create({ data: order_product });
    } else if (existingProduct.quantity === order_product.quantity) {
        await removeProductFromOrder(
            order_product.order_id,
            order_product.product_id
        );
    } else {
        await prisma.order_products.updateMany({
            where: {
                order_id: order_product.order_id,
                product_id: order_product.product_id,
            },
            data: {
                quantity: existingProduct.quantity + order_product.quantity,
            },
        });
    }
};

export const findProductInOrder = async (
    order_id: string,
    product_id: string
) => {
    return await prisma.order_products.findFirst({
        where: { order_id, product_id },
    });
};

export const removeProductFromOrder = async (
    order_id: string,
    product_id: string
) => {
    await prisma.order_products.deleteMany({
        where: { order_id, product_id },
    });
};
export const changeProductAmount = async (
    order_id: string,
    product_id: string,
    quantity: number
) => {
    await prisma.order_products.updateMany({
        where: { order_id, product_id },
        data: { quantity },
    });
};
export const getOrderByID = async (order_id: string) => {
    return await prisma.order.findFirst({
        where: { id: order_id },
        include: {
            order_products: true,
        },
    });
};

export const updateOrderStatus = async (
    order_id: string,
    order_status: status
) => {
    return await prisma.order.update({
        where: { id: order_id },
        data: { status: order_status },
    });
};

export const retrieveOrdersByUserID = async (user_id: string) => {
    return await prisma.order.findMany({
        where: { user_id },
        include: { order_products: true },
    });
};
