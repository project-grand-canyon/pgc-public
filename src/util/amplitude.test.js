jest.mock("amplitude-js", () => {
  return {
    getInstance: jest.fn(),
  };
});

import AmplitudeJS from "amplitude-js";

import { initAmplitude, logPageView, logCall } from "./amplitude";

describe("Amplitude", () => {
  it("should init", () => {
    const init = jest.fn();
    AmplitudeJS.getInstance.mockReturnValueOnce({ init });
    initAmplitude();
    expect(init).toHaveBeenCalledWith(process.env.REACT_APP_AMPLITUDE_KEY, {
      includeUtm: true,
    });
  });
  it("should log page view", () => {
    const path = "page-name";
    const logEvent = jest.fn();
    AmplitudeJS.getInstance.mockReturnValueOnce({ logEvent });
    logPageView(path);
    expect(logEvent).toHaveBeenCalledWith("Page Viewed", { path });
  });
  it("should log calls", () => {
    const district = { state: "TX", number: 25 };
    const logEvent = jest.fn();
    AmplitudeJS.getInstance.mockReturnValueOnce({ logEvent });
    logCall(district);
    expect(logEvent).toHaveBeenCalledWith("Call Reported", {
      district: `${district.state}-${district.number}`,
    });
  });
});
