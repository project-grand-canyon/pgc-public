import { initAmplitude, logPageView } from "../../util/amplitude";

import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import App from "./App";

jest.mock("../../util/amplitude");
jest.mock("@sentry/browser");
global.scrollTo = jest.fn();

describe("App", () => {
  it("inits Amplitude and logs page view", () => {
    const history = createMemoryHistory();
    const route = "/some-route";
    const anotherRoute = "/another-route";
    history.push(route);
    render(
      <Router history={history}>
        <App />
      </Router>
    );

    // if redirected to same path, don't log dupe pageViews
    history.push(route);
    history.push(route);
    history.push(anotherRoute);
    expect(initAmplitude).toBeCalled();
    expect(logPageView).toHaveBeenCalledTimes(2);
    expect(logPageView).toHaveBeenCalledWith(route);
    expect(logPageView).toHaveBeenCalledWith(anotherRoute);
  });
});
