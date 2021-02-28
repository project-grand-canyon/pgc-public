import React from "react";
import { Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, waitForDomChange } from "@testing-library/react";
import { logCall as logCallAmplitude } from "../../../util/amplitude";
import "@testing-library/jest-dom/extend-expect";

import { ThankYou } from "./ThankYou";

jest.mock("../../../util/axios-api");
jest.mock("../../../util/amplitude");

const state = "WA"
const districtID = 9
const trackingToken = 23456
const callerId = 7890

describe("ThankYou", () => {
  test("logCall() invoked", async () => {

    const history = createMemoryHistory();

    history.push(
      "/call/thankyou?district=" + toString(districtID)
      + "&state=" + state
      + "&t=" + toString(trackingToken)
      + "&d=" + toString(districtID)
      + "&c=" + toString(callerId)
    );

    const logCallMock = jest.fn();
    render(
      <Router history={history}>
        <Route path="/call/thankyou" logCall={logCallMock} component={ThankYou} />
      </Router>
    );

    await waitForDomChange({ timeout: 1000 }).then(expect(logCallMock).toBeCalledTimes(1));
  });
});
