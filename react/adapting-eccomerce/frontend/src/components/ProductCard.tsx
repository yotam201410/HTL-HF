import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
} from "@mui/material";
import { Product } from "../types/product";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../types/actions";

const ProductCard = ({ product }: { product: Product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <Card
            sx={{
                width: "15rem",
                height: "30rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
            onClick={() =>
                navigate({
                    pathname: "/product",
                    search: `?id=${product.id}`,
                })
            }
        >
            <CardMedia
                component="img"
                height="150"
                image={!product.image_url ? undefined : product.image_url}
                alt={product.name}
                sx={{ height: "15rem" }}
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    from: {product.provider}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    category: {product.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
                    {product.price}$
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart(product, 1));
                    }}
                >
                    Add to cart
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
