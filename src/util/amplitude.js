import amplitude from "amplitude-js";

import { analyticsName } from "./district";

export const initAmplitude = () => {
  const key = process.env.REACT_APP_AMPLITUDE_KEY;
  amplitude.getInstance().init(key, { includeUtm: true });
};

export const logPageView = (path) => {
  amplitude.getInstance().logEvent("Page Viewed", {
    path,
  });
};

export const logCall = (district) => {
  amplitude.getInstance().logEvent("Call Reported", {
    district: analyticsName(district),
  });
};
