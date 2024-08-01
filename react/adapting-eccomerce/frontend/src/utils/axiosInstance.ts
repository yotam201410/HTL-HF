import axios, { AxiosError } from "axios";
import { User, Address, ChangeAddress } from "../types/user";
import alertify from "alertifyjs";
import { Product } from "../types/product";
import Swal from "sweetalert2";
import { Order } from "../types/order";
const instance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
    },
});

export const postLogin = async (username: string, password: string) => {
    try {
        return await instance.post<User>("/users/login", {
            username,
            password,
        });
    } catch (err) {
        if (err instanceof AxiosError) {
            alertify.error(err.response?.data);
        }
    }
};

export const postRegister = async (user: {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
}) => {
    try {
        return (await instance.post<User>("/users/register", user)).data;
    } catch (err) {
        if (err instanceof AxiosError) {
            alertify.error(err.response?.data);
        }
    }
};

export const getProducts = async (query: string) => {
    try {
        return (
            await instance.get<Product[]>("/products", {
                params: { search: query },
            })
        ).data;
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Something went wrong...",
            text: "Couldn't get the products from the servers",
        });
    }
};

export const getProduct = async (id: string) => {
    try {
        return (await instance.get<Product>(`/products/${id}`)).data;
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Something went wrong...",
            text: "Couldn't get the products from the servers",
        });
    }
};

export const getAddresses = async (userId: string) => {
    try {
        return (await instance.get<Address[]>(`/users/${userId}/addresses`))
            .data;
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Something went wrong...",
            text: "Couldn't get the addresses from the servers",
        });
    }
};

export const getAddress = async (addressId: string) => {
    try {
        return (await instance.get<Address>(`/addresses/${addressId}`)).data;
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Something went wrong...",
            text: "Couldn't get the address from the servers",
        });
    }
};
export const deleteAddress = async (addressId: string) => {
    try {
        await instance.delete<void>("/addresses", {
            data: { address_id: addressId },
        });
        alertify.success("Address deleted successfully");
    } catch (err) {
        if (err instanceof AxiosError) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong...",
                text:
                    err.response?.data ||
                    "Couldn't delete the address from the servers",
            });
        }
    }
};

export const updateDefaultAddress = async (
    user_id: string,
    address_id: string
) => {
    try {
        await instance.patch<void>("/users/address", {
            user_id,
            default_address: address_id,
        });
        alertify.success("Default address updated successfully");
    } catch (err) {
        if (err instanceof AxiosError) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong...",
                text:
                    err.response?.data ||
                    "Couldn't set default address at the servers",
            });
        }
    }
};

export const patchAddress = async (address: Address) => {
    try {
        return (await instance.patch<Address>("/addresses", address)).data;
    } catch (err) {
        if (err instanceof AxiosError) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong...",
                text:
                    err.response?.data ||
                    "Couldn't update the address at the servers",
            });
        }
    }
};

export const createAddress = async (
    address: ChangeAddress,
    user_id: string
) => {
    try {
        return (
            await instance.post<Address>("/addresses", { ...address, user_id })
        ).data;
    } catch (err) {
        if (err instanceof AxiosError) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong...",
                text:
                    err.response?.data ||
                    "Couldn't update the address at the servers",
            });
        }
    }
};

export const postOrder = async (
    products: { product_id: string; quantity: number }[],
    user_id: string,
    address_id: string
) => {
    try {
        return (
            await instance.post<Order>("/orders", {
                products,
                user_id,
                address_id,
            })
        ).data;
    } catch (err) {
        if (err instanceof AxiosError) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong...",
                text: err.response?.data || "Couldn't order",
            });
        }
    }
};
export const getOrders = async (userId: string) => {
    try {
        return (await instance.get<Order[]>(`/orders/users/${userId}`)).data;
    } catch (err) {
        if (err instanceof AxiosError) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong...",
                text: err.response?.data || "Couldn't order",
            });
        }
    }
};
