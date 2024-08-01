import { NextFunction, Request, Response } from "express";
import { getAddresses, getUserWithID, login, patchUser, register, removeUser, updateDefaultAddress } from "../services/userService";
import { StatusCodes } from "http-status-codes";

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await login(req.body.username, req.body.password);
        res.json(user).status(StatusCodes.OK);
    }
    catch (err) {
        next(err);
    }
}

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await register(req.body.username, req.body.password, req.body.first_name, req.body.last_name, req.body.email);
        res.status(StatusCodes.CREATED).json({ first_name: user.first_name, last_name: user.last_name, id: user.id, default_address: user.default_address, username: user.username });
    }
    catch (err) {
        next(err)
    }
}

export const getAddressesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addresses = await getAddresses(req.params.user_id);
        res.status(StatusCodes.OK).json(addresses)
    }
    catch (err) {
        next(err)
    }
}

export const removeUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await removeUser(req.params.user_id);
        res.status(StatusCodes.OK).send("removed user successfully");
    }
    catch (err) {
        next(err);
    }
}

export const updateDefaultAddressHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateDefaultAddress(req.body.user_id, req.body.address_id);
        res.status(StatusCodes.OK).send("changed default address successfully");
    }
    catch (err) {
        next(err);
    }
};

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await patchUser({ id: req.body.id, username: req.body.username, password: req.body.password, first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email })
        res.status(StatusCodes.OK).send("updated user successfully")
    }
    catch (err) {
        next(err)
    }
}

export const getUserByIDHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user = await getUserWithID(req.params.user_id);
        delete (user as { address?: {}[] }).address;
        delete (user as { username?: string }).username;
        delete (user as { password?: string }).password;

        res.status(StatusCodes.OK).json(user);
    }
    catch (err) {
        next(err);
    }
}