import { CHANGE_LAST_LINK, AppActions } from "../../types/actions";

const initialState = "";

const lastLinkReducer = (state = initialState, action: AppActions): string => {
  switch (action.type) {
    case CHANGE_LAST_LINK:
      return action.payload;
    default:
      return state;
  }
};

export default lastLinkReducer;
