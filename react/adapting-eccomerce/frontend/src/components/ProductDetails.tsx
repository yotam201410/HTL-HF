import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import { Product } from "../types/product";
import { useDispatch } from "react-redux";
import { addToCart } from "../types/actions";

const ProductDetails = ({ product }: { product: Product | undefined }) => {
    const dispatch = useDispatch();
    return (
        <div>
            {product && (
                <Grid
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={4}
                    style={{ marginTop: "20px" }}
                >
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                boxShadow: 3,
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={
                                    product.image_url
                                        ? product.image_url
                                        : undefined
                                }
                                alt="Product Image"
                                sx={{ width: "100%", height: "400px" }}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ boxShadow: 3, height: "400px" }}>
                            <CardContent>
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    gutterBottom
                                >
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    by {product.provider}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    component="h3"
                                    color="success.main"
                                    gutterBottom
                                >
                                    {product.price}$
                                </Typography>
                                <Typography
                                    variant="body1"
                                    component="p"
                                    paragraph
                                >
                                    {product.description}
                                </Typography>
                                <Typography variant="body1" component="p">
                                    <strong>Category: </strong>
                                    {product.category}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{ marginTop: "16px" }}
                                    onClick={() => {
                                        dispatch(addToCart(product, 1));
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
            {!product && <h3>Product not found</h3>}
        </div>
    );
};

export default ProductDetails;
