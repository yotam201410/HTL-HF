import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import cartReducer from "./reducers/cartReducer";
import lastLinkReducer from "./reducers/lastLinkReducer";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    lastLink: lastLinkReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
