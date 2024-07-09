import { product } from "@prisma/client"
import { prisma } from "../utils/dbClient"

export const addProduct = async (newProduct: Omit<product, "id" | "created_at">) => {
    await prisma.product.create({ data: newProduct });
}
export const deleteProduct = async (productId: string) => {
    await prisma.product.delete({ where: { id: productId } })
}

export const updatePrice = async (productId: string, price: number) => {
    await prisma.product.update({ where: { id: productId }, data: { price } })
}

export const getProductById = async (productId: string) => {
    return await prisma.product.findFirst({ where: { id: productId } })
}

export const getProductsByQuery = async (searchQuery: string) => {
    return await prisma.product.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: searchQuery,
                        mode: 'insensitive', // Case insensitive search
                    },
                },
                {
                    category: {
                        contains: searchQuery,
                        mode: 'insensitive', // Case insensitive search
                    },
                },
                {
                    description: {
                        contains: searchQuery,
                        mode: 'insensitive', // Case insensitive search
                    },
                },
            ],
        },
    });
}