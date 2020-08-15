jest.mock("amplitude-js", () => {
  return {
    getInstance: jest.fn(),
  };
});

import AmplitudeJS from "amplitude-js";

import { initAmplitude, logPageView } from "./amplitude";

describe("Amplitude", () => {
  it("should init", () => {
    const init = jest.fn();
    AmplitudeJS.getInstance.mockReturnValueOnce({ init });
    initAmplitude();
    expect(init).toBeCalled();
  });
  it("should log page view", () => {
    const path = "page-name";
    const logEvent = jest.fn();
    AmplitudeJS.getInstance.mockReturnValueOnce({ logEvent });
    logPageView(path);
    expect(logEvent).toHaveBeenCalledWith("Page Viewed", { path });
  });
});
