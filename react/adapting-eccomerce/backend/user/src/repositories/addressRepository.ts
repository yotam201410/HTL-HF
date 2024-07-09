import { address } from "@prisma/client";
import { NotFoundError } from "../errors/notFoundError"
import { prisma } from "../utils/dbClient"

export const getAddressById = async (id: string) => {
    const address = await prisma.address.findFirst({ where: { id } })

    return address;
}

export const addAddress = async (address: Omit<address, "id">) => {
    await prisma.address.create({ data: address })
}

export const deleteAddress = async (address_id: string) => {
    await prisma.address.delete({ where: { id: address_id } })
}

export const updateAddress = async (address: address) => {
    await prisma.address.update({ where: { id: address.id }, data: { ...address } })
}