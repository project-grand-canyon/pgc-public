import { LOG_CALL } from "../actionTypes";

const initialState = {
  byId: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOG_CALL: {
      const { districtId, timestamp } = action.payload;
      return {
        ...state,
        byId: {...state.byId, [districtId]: timestamp}
      };
    }
    default:
      return state;
  }
}
