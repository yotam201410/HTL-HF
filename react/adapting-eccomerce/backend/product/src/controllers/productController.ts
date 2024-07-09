import { NextFunction, Request, Response } from "express";
import { createProduct, findProductById, findProductsByQuery, removeProduct, updateProductPrice } from "../services/productService";
import { StatusCodes } from "http-status-codes";

export const createProductHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await createProduct({ name: req.body.name, description: req.body.description, provider: req.body.provider, category: req.body.category, price: req.body.price,image_url:req.body.image_url })
        res.status(StatusCodes.CREATED).send("product successfully created");
    }
    catch (err) {
        next(err);
    }
}

export const removeProductHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await removeProduct(req.body.id);
        res.status(StatusCodes.OK).send("product removed successfully");
    }
    catch (err) {
        next(err);
    }
}

export const updateProductPriceHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateProductPrice(req.body.id, req.body.price);
        res.status(StatusCodes.OK).send("product price updated");
    }
    catch (err) {
        next(err)
    }
}

export const findProductByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await findProductById(req.params.id);
        res.status(StatusCodes.OK).json(product);
    }

    catch (err) {
        next(err)
    }
}

export const findProductsByQueryHandler = async (req: Request<{},{},{},{search:string}>, res: Response, next: NextFunction) => {
    try {
        console.log(req.query.search);
        const products = await findProductsByQuery(req.query.search);
        res.status(StatusCodes.OK).json(products);
    }

    catch (err) {
        next(err)
    }
}