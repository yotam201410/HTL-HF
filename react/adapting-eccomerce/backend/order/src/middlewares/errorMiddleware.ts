import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
import { logger } from "../utils/logger";
import { StatusCodes } from "http-status-codes";

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        logger.info(err.message)
        res.status(err.code).send(err.message);
    }
    else if (err instanceof Error) {
        console.log(err.stack);
        logger.error(err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
}