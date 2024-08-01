import React, { useEffect, useState } from "react";
import { getProducts } from "../utils/axiosInstance";
import { useSearchParams } from "react-router-dom";
import { Product } from "../types/product"; // Assuming you have a Product type defined
import ProductCard from "../components/ProductCard";
import { Grid, Container, Typography } from "@mui/material";

const ProductsView: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            const query = searchParams.get("search") || "";
            const fetchedProducts = await getProducts(query);
            if (fetchedProducts) {
                setProducts(fetchedProducts);
            }
        };

        fetchProducts();
    }, [searchParams]);

    return (
        <Container sx={{ mt: 4 }}>
            {products.length ? (
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={product.id}
                        >
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" component="p" align="center">
                    No products found
                </Typography>
            )}
        </Container>
    );
};

export default ProductsView;
