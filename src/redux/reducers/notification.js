import { LOG_NOTIFICATION } from "../actionTypes";

const initialState = {
  notification: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOG_NOTIFICATION: {
      const { callerId, trackingId, homeDistrict, timestamp } = action.payload;
      if (!callerId || !trackingId || !homeDistrict) {
        return state;
      }
      const latest = {
        callerId,
        homeDistrict,
        timestamp,
        trackingId,
      };
      const newState = { ...state };
      newState.notification = latest;
      return latest;
    }
    default:
      return state;
  }
}
