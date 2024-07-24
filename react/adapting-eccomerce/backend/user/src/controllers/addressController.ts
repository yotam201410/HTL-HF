import { NextFunction, Request, Response } from "express";
import { createAddress, getAddress, removeAddress } from "../services/addressService";
import { StatusCodes } from "http-status-codes";
import { changeAddress } from "../services/addressService";

export const getAddressByIDHandler = async (request: Request, res: Response, next: NextFunction) => {
    try {
        const address = await getAddress(request.params.id);
        res.status(StatusCodes.OK).json(address);
    }
    catch (err) {
        next(err);
    }
}


export const createAddressHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await createAddress({ user_id: req.body.user_id, full_address: req.body.full_address, country: req.body.country, postal_code: req.body.postal_code })
        res.status(StatusCodes.CREATED).send("address added successfully");
    }
    catch (err) {
        next(err);
    }
}
export const removeAddressHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await removeAddress(req.params.address_id);
        res.status(StatusCodes.OK).send("address removed successfully");
    }
    catch (err) {
        next(err);
    }
}

export const changeAddressHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await changeAddress(req.body);
        res.status(StatusCodes.OK).send("address changed successfully");
    }
    catch (err) {
        next(err);
    }
}