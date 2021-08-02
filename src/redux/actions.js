import { LOG_CALL, LOG_NOTIFICATION } from "./actionTypes";

export const logCall = districtId => ({
  type: LOG_CALL,
  payload: {
    districtId,
    timestamp: Date.now()
  }
});

export const logNotification = (callerId, trackingId, homeDistrict) => ({
  type: LOG_NOTIFICATION,
  payload: {
    callerId,
    trackingId,
    homeDistrict,
    timestamp: Date.now()
  }
});