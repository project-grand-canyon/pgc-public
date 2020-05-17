import { LOG_CALL } from "./actionTypes";

export const logCall = districtId => ({
  type: LOG_CALL,
  payload: {
    districtId,
    timestamp: Date.now()
  }
});
