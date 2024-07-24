import { StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

export class ForbiddenError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.FORBIDDEN);
        this.name = "ForbiddenError";
    }
}