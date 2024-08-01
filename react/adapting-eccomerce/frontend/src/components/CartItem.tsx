import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
} from "@mui/material";
import { Product } from "../types/product"; // Ensure you have a Product type defined
import { useSelector } from "react-redux";
import { AppState } from "../store/rootReducer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../types/actions";

const CartItem = ({ product }: { product: Product }) => {
    const [amount, setAmount] = useState(0);
    const cart = useSelector((state: AppState) => state.cart);
    const total = product.price * amount;
    const dispatch = useDispatch();
    useEffect(() => {
        setAmount(cart[product.id].amount);
    }, []);
    return (
        <Card
            sx={{
                display: "flex",
                mb: 2,
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <CardMedia
                    component="img"
                    image={product.image_url ? product.image_url : undefined}
                    alt="Product Image"
                    sx={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid #ddd",
                        mr: 2,
                    }}
                />
                <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h5" component="div" mb={1}>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        Provider: {product.provider}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        Category: {product.category}
                    </Typography>
                    <Typography variant="body2" mb={1}>
                        Price: <strong>{product.price}$</strong>
                    </Typography>
                    <Typography variant="body2" mb={1}>
                        Amount: <strong>{amount}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Total: <strong>{total}$</strong>
                    </Typography>
                </CardContent>
            </Box>
            <Button
                variant="contained"
                color="error"
                onClick={() => {
                    dispatch(addToCart(product, -1));
                }}
            >
                Remove One
            </Button>
        </Card>
    );
};

export default CartItem;
