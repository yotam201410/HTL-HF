import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.url}`);
    next();
}