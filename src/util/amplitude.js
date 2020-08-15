const amplitude = require("amplitude-js");

export const initAmplitude = () => {
  const key = process.env.REACT_APP_AMPLITUDE_KEY;
  amplitude.getInstance().init(key);
};

export const logPageView = (path) => {
  amplitude.getInstance().logEvent("Page Viewed", {
    path,
  });
};
