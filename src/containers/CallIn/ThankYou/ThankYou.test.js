import React from "react";
import { Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { getByText, render, waitFor } from "@testing-library/react";
import { logCall as logCallAmplitude } from "../../../util/amplitude";
import getUrlParameter from "../../../util/urlparams"
import "@testing-library/jest-dom/extend-expect";

import ThankYou from "./ThankYou";
import { createStore } from 'redux';
import { Provider } from "react-redux";

import rootReducer from "../../../redux/reducers"
import axios from "../../../util/urlparams"

const state = "WA";
const calledDistrictID = "9";
const callerDistrictID = "1";
const trackingToken = "23456";
const callerId = "7890";

jest.mock("../../../util/axios-api");
jest.mock("../../../util/amplitude");
jest.mock("../../../util/urlparams");
jest.mock("../../../redux/actions");

describe("ThankYou", () => {
  test("logCall() invoked", async () => {

    const history = createMemoryHistory();

    history.push(
      "/call/thankyou?district=" + toString(calledDistrictID)
      + "&state=" + state
      + "&t=" + trackingToken
      + "&d=" + callerDistrictID
      + "&c=" + callerId
    );

    const store = createStore(rootReducer, {
      calls: {
        byId: trackingToken
      }
    });

    const { findByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/call/thankyou" component={ThankYou} />
        </Router>
      </Provider>
    );

    const str = "Your call was added to our count!";
    await findByText(str).then(expect(logCallMock).toBeCalledTimes(1));
  });
});
