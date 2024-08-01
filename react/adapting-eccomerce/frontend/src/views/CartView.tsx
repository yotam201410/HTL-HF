import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Container,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../store/rootReducer";
import { Address } from "../types/user";
import { changeLastLink, clearCart } from "../types/actions";
import CartItem from "../components/CartItem";
import { getAddresses, postOrder } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const CartView: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const cart = useSelector((state: AppState) => state.cart);
    const user = useSelector((state: AppState) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddressesAndSetSelected = async () => {
            if (user) {
                const addresses = await fetchUserAddresses(user.id);
                setAddresses(addresses);
                if (user.default_address) {
                    setSelectedAddress(user.default_address.id);
                } else {
                    setSelectedAddress(addresses[0].id);
                }
            }
        };

        fetchAddressesAndSetSelected();
    }, []);

    const fetchUserAddresses = async (userId: string): Promise<Address[]> => {
        const addresses = await getAddresses(userId);
        if (!addresses) {
            return [];
        }

        return addresses;
    };

    const handleFinishOrder = () => {
        if (!user) {
            dispatch(changeLastLink("/cart"));
            navigate("/login");
        } else if (!selectedAddress) {
            navigate("/addresses");
        } else {
            const finishOrder = async () => {
                await postOrder(
                    Object.keys(cart).map((product_id) => {
                        return {
                            product_id,
                            quantity: cart[product_id].amount,
                        };
                    }),
                    user.id,
                    selectedAddress
                );
                dispatch(clearCart());
            };
            finishOrder();
        }
    };

    const totalPrice = Object.keys(cart).reduce((total, item_id) => {
        const product = cart[item_id].product;
        return total + (product ? product.price * cart[item_id].amount : 0);
    }, 0);

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h3" gutterBottom>
                Your Cart
            </Typography>
            {Object.keys(cart).length === 0 ? (
                <Typography>Your cart is empty.</Typography>
            ) : (
                <>
                    <Box>
                        {Object.keys(cart).map(
                            (item_id) =>
                                cart[item_id] && (
                                    <CartItem
                                        key={item_id}
                                        product={cart[item_id].product}
                                    />
                                )
                        )}
                    </Box>
                    <Box mt={4}>
                        <Typography variant="h4">
                            Total Price: {totalPrice}$
                        </Typography>
                        {
                            <FormControl
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2 }}
                            >
                                <InputLabel id="address-select-label">
                                    Shipping Address
                                </InputLabel>
                                <Select
                                    labelId="address-select-label"
                                    id="address-select"
                                    value={selectedAddress}
                                    onChange={(event) =>
                                        setSelectedAddress(event.target.value)
                                    }
                                >
                                    {addresses.map((address) => (
                                        <MenuItem value={address.id}>
                                            {`${address.full_address}, ${address.country}, ${address.postal_code}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            sx={{ mt: 3 }}
                            onClick={handleFinishOrder}
                        >
                            Order Now!
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default CartView;
