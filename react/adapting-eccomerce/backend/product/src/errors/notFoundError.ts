import { StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND);
        this.name = "NotFoundError";
    }
}