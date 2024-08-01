import { UnknownAction } from "redux";
import { User } from "./user";
import { Product } from "./product";

// Action types
export const CHANGE_USER = "CHANGE_USER";
export const ADD_TO_CART = "ADD_TO_CART";
export const CHANGE_LAST_LINK = "CHANGE_LAST_LINK";
export const CLEAR_CART = "CLEAR_CART";

// Action creators
export interface ChangeUserAction extends UnknownAction {
    type: typeof CHANGE_USER;
    payload: User | null;
}

export interface AddToCartAction extends UnknownAction {
    type: typeof ADD_TO_CART;
    payload: { item: Product; amount: number };
}

export interface ChangeLastLinkAction extends UnknownAction {
    type: typeof CHANGE_LAST_LINK;
    payload: string;
}

export interface ClearCartAction extends UnknownAction {
    type: typeof CLEAR_CART;
}

export type AppActions =
    | ChangeUserAction
    | AddToCartAction
    | ChangeLastLinkAction
    | ClearCartAction;

export const changeUser = (user: User | null): ChangeUserAction => ({
    type: CHANGE_USER,
    payload: user,
});

export const addToCart = (item: Product, amount: number): AddToCartAction => ({
    type: ADD_TO_CART,
    payload: { item, amount },
});

export const changeLastLink = (lastLink: string): ChangeLastLinkAction => ({
    type: CHANGE_LAST_LINK,
    payload: lastLink,
});

export const clearCart = (): ClearCartAction => ({
    type: CLEAR_CART,
});
