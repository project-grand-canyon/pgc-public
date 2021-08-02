import { LOG_CALL } from "../actionTypes";

const initialState = {
    byId: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOG_CALL: {
      const { districtId, timestamp } = action.payload;

      const lastCallTimestamp = state.byId && state.byId[districtId];
      if (lastCallTimestamp) {
        // don't track more than one call per district per 24 hour period
        if (timestamp < lastCallTimestamp + 1000 * 60 * 60 * 24) {
          return state;
        }
      }

      return {
        ...state,
        byId: { ...state.byId, [districtId]: timestamp },
      };
    }
    default:
      return state;
  }
}
