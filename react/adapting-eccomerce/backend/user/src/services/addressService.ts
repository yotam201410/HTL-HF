import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NotFoundError } from "../errors/notFoundError";
import { addAddress, deleteAddress, getAddressById } from "../repositories/addressRepository"
import { address } from "@prisma/client";

export const getAddress = async (addressId: string) => {
    const address = await getAddressById(addressId);
    if (!address) {
        throw new NotFoundError("Address not found");
    }
    return address;
}

export const createAddress = async (address: Omit<address, "id">) => {
    await addAddress(address);
}

export const removeAddress = async (address_id: string) => {
    try {
        await deleteAddress(address_id);
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code = "P2018") {
                throw new NotFoundError("address not found");
            }
        }
        throw err;
    }
}