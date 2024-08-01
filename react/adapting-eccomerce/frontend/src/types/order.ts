import { Product } from "./product";

export interface Order {
    order_products: (Product & { quantity: number })[];
    id: string;
    user_id: string;
    status: OrderStatus;
    address: string;
}

export interface OrderProduct {
    order_id: string;
    product_id: string;
    quantity: number;
}

export enum OrderStatus {
    DELIVERED,
    OPENED,
    PAYED,
    ON_THE_WAY,
}
