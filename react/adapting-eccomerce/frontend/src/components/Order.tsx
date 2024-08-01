import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
} from "@mui/material";
import { Order } from "../types/order";
import { Address } from "../types/user";
import { getAddress } from "../utils/axiosInstance";

const OrderCard = ({ order }: { order: Order }) => {
    const [address, setAddress] = useState<Address>();
    useEffect(() => {
        const getAddressHandler = async () => {
            const address = await getAddress(order.address);
            if (address) setAddress(address);
        };

        getAddressHandler();
    }, []);
    const calculateTotalPrice = () => {
        return order.order_products
            .map((product) => product.quantity * product.price)
            .reduce((sum, productTotal) => sum + productTotal, 0);
    };
    return (
        <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h5">Order ID: {order.id}</Typography>
                <Typography>
                    Status: <strong>{order.status}</strong>
                </Typography>
                {address && (
                    <Typography>
                        Address: {address.full_address}, {address.country}{" "}
                        (Postal Code: {address.postal_code})
                    </Typography>
                )}
                <Typography>Total Price: {calculateTotalPrice()}$</Typography>
                <Box mt={3}>
                    <Typography variant="h6">Order Products:</Typography>
                    <List>
                        {order.order_products.map((product) => (
                            <ListItem key={product.id}>
                                {product.name} (x{product.quantity}) -{" "}
                                {product.price}$
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
