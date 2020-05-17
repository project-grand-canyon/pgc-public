import { LOG_CALL } from "../actionTypes";

const initialState = {
  calls: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOG_CALL: {
      const { districtId, timestamp } = action.payload;
      return {
        ...state,
        calls: {...state.calls, [districtId]: timestamp}
      };
    }
    default:
      return state;
  }
}
