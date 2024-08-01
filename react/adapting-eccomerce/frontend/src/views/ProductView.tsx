import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProduct } from "../utils/axiosInstance";
import { Product } from "../types/product";
import ProductDetails from "../components/ProductDetails";

const ProductView = () => {
    const [product, setProducts] = useState<Product>();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            const id = searchParams.get("id") || "";
            const fetchedProduct = await getProduct(id);
            if (fetchedProduct) {
                setProducts(fetchedProduct);
            }
        };

        fetchProducts();
    }, [searchParams]);
    return (
        <div>
            <ProductDetails product={product} />
        </div>
    );
};

export default ProductView;
