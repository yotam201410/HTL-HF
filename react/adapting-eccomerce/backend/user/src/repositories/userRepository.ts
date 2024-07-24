import { users } from "@prisma/client";
import { prisma } from "../utils/dbClient";

export const getUserFromUsernameAndPassword = async (
  username: string,
  password: string
) => {
  const user = await prisma.users.findFirst({
    where: { username, password },
    select: {
      first_name: true,
      last_name: true,
      default_address: true,
      id: true,
    },
  });
  return user;
};

export const addUser = async (user: Omit<users, "id">) => {
  return await prisma.users.create({ data: user });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.users.findFirst({
    where: { username },
    include: { address: true },
  });
};

export const getUserByID = async (id: string) => {
  return await prisma.users.findFirst({
    where: { id },
    include: { address: true },
  });
};
export const getUserAddresses = async (id: string) => {
  return await prisma.users.findFirst({
    where: { id },
    select: {
      id: true,
      address: {
        select: {
          id: true,
          full_address: true,
          user_id: true,
          country: true,
          postal_code: true,
        },
      },
    },
  });
};

export const deleteUser = async (user_id: string) => {
  await prisma.users.delete({ where: { id: user_id } });
};

export const setDefaultAddress = async (
  user_id: string,
  address_id: string
) => {
  await prisma.users.update({
    data: { default_address: address_id },
    where: { id: user_id },
  });
};

export const updateUser = async (user: Omit<users, "default_address">) => {
  await prisma.users.update({ where: { id: user.id }, data: user });
};
