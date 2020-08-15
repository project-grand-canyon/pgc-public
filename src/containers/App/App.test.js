import { initAmplitude, logPageView } from "../../util/amplitude";

jest.mock("../../util/amplitude");
jest.mock("@sentry/browser");
global.scrollTo = jest.fn();

import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import App from "./App";

// todo, set url to with tracking id and then wait for it to get stripped

describe("App", () => {
  it("inits Amplitude and logs page view", () => {
    const history = createMemoryHistory();
    const route = "/some-route";
    history.push(route);
    render(
      <Router history={history}>
        <App />
      </Router>
    );
    expect(initAmplitude).toBeCalled();
    history.push("/some-route");
    history.push("/some-route");
    expect(logPageView).toHaveBeenCalledTimes(1);
    expect(logPageView).toHaveBeenCalledWith("/some-route");
  });
});
