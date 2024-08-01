import { ADD_TO_CART, CLEAR_CART, AppActions } from "../../types/actions";
import { Product } from "../../types/product";

interface CartState {
    [key: string]: { amount: number; product: Product };
}

const initialState: CartState = {};

const cartReducer = (state = initialState, action: AppActions): CartState => {
    switch (action.type) {
        case ADD_TO_CART: {
            const { item, amount } = action.payload;
            const currentAmount = state[item.id]
                ? state[item.id].amount || 0
                : 0;

            const newState = { ...state };
            if (currentAmount + amount === 0) {
                delete newState[item.id];
            } else {
                newState[item.id] = {
                    amount: currentAmount + amount,
                    product: action.payload.item,
                };
            }

            return newState;
        }
        case CLEAR_CART:
            return {};
        default:
            return state;
    }
};

export default cartReducer;
