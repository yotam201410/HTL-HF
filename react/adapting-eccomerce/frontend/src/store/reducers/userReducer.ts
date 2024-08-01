import { User } from "../../types/user";
import { AppActions, CHANGE_USER } from "../../types/actions";

const initialState: User | null = null;

const userReducer = (state = initialState, action: AppActions) => {
  switch (action.type) {
    case CHANGE_USER:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
