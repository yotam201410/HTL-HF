import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { Order } from "../types/order";
import { useSelector } from "react-redux";
import { AppState } from "../store/rootReducer";
import OrderCard from "../components/Order";
import { getOrders } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const OrdersView = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const user = useSelector((state: AppState) => state.user);
    const navigator = useNavigate();

    useEffect(() => {
        if (!user) {
            navigator("/login");
            return;
        }

        const fetchOrders = async () => {
            const orders = await getOrders(user.id);
            if (orders) setOrders(orders);
        };

        fetchOrders();
    }, [user]);

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h3" gutterBottom>
                Your Orders
            </Typography>
            {orders.length === 0 ? (
                <Typography>You have no orders.</Typography>
            ) : (
                orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))
            )}
        </Container>
    );
};

export default OrdersView;
