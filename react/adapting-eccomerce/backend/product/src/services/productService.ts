import { product } from "@prisma/client";
import { addProduct, deleteProduct, getProductById, getProductsByQuery, updatePrice } from "../repositories/productRepository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NotFoundError } from "../errors/notFoundError";

export const createProduct = async (newProduct: Omit<product, "id" | "created_at">) => {
    await addProduct(newProduct);
}

export const removeProduct = async (productId: string) => {
    await deleteProduct(productId);
}

export const updateProductPrice = async (productId: string, price: number) => {
    try { await updatePrice(productId, price); }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError(`product with id : ${productId} not found`);
            }
        }
    }

}

export const findProductById = async (productId: string) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new NotFoundError(`product with id : ${productId} not found`);
    }

    return product;
}

export const findProductsByQuery = async (query: string) => {
    const products = await getProductsByQuery(query);
    
    return products;
}