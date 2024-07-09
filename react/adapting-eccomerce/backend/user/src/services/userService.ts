import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NotFoundError } from "../errors/notFoundError";
import { addUser, deleteUser, getUserByID, getUserByUsername, getUserFromUsernameAndPassword, setDefaultAddress, updateUser } from "../repositories/userRepository";
import { ConflictError } from "../errors/conflictError";
import { getAddress } from "./addressService";
import { ForbiddenError } from "../errors/forbiddenError";
import { address, users } from "@prisma/client";
import { gateway } from "../utils/axios";
import { updateAddress } from "../repositories/addressRepository";

export const login = async (username: string, password: string) => {
    const user = await getUserFromUsernameAndPassword(username, password);

    if (user?.default_address) {
        const address = await getAddress(user.default_address);
        return { id: user.id, first_name: user.first_name, last_name: user.last_name, default_address: address }
    }

    if (!user) {
        throw new NotFoundError("user not found or passwords dont match");
    }

    return { id: user.id, first_name: user.first_name, username, last_name: user.last_name, default_address: null };
}

export const register = async (username: string, password: string, firstName: string, lastName: string, email: string) => {
    try {
        return await addUser({ username, password, first_name: firstName, last_name: lastName, default_address: null, email });
    }

    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                throw new ConflictError("username or email are taken");
            }
        }
        throw err;
    }
}

export const getAddresses = async (username: string) => {
    const user = await getUserByUsername(username);
    if (!user) {
        throw new NotFoundError(`user with username: ${username} not found`);
    }
    return user.address;
}

export const removeUser = async (user_id: string) => {
    try { await deleteUser(user_id); }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError("userId not found");
            }
        }
        throw err;
    }

}

export const updateDefaultAddress = async (user_id: string, default_address: string) => {
    try {
        if (default_address !== null) {
            const address = await getAddress(default_address);
            if (user_id !== address.user_id) {
                throw new ForbiddenError("you cant access this address");
            }
        }
        await setDefaultAddress(user_id, default_address);
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError("user or address not found");
            }
        }
        throw err;
    }
}

export const patchUser = async (user: Omit<users, 'default_address'>) => {
    try {
        await updateUser(user);
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError(`user with id: ${user.id} not found`);
            }
        }
        throw err;
    }
}
export const getUserWithID = async (user_id: string) => {
    const user = await getUserByID(user_id);
    if (!user) {
        throw new NotFoundError(`user with id: ${user_id} not found`);
    }
    return user;
}

export const changeAddress = async (address: address) => {
    try {
        await updateAddress(address);
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError(`user with id : ${address.user_id} or address :${address.id} not found`);
            }
        }
        throw err;
    }
}