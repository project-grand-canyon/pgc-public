import React from "react";
import { MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";

import { ThankYou } from "./ThankYou";

import { Provider } from "react-redux";
import { createStore } from 'redux';
import rootReducer from "../../../redux/reducers"

import { logCall as logCallAmplitude } from "../../../util/amplitude";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../../util/axios-api");
jest.mock("../../../util/amplitude");

const state = "WA";
const calledDistrictID = "9";
const callerDistrictID = "1";
const trackingToken = "23456";
const callerId = "7890";

describe("ThankYou", () => {
  test("logCall() invoked", async () => {

    const location = {
      path: `/call/thankyou`,
      search: `?district=${calledDistrictID}&state=${state}&t=${trackingToken}&d=${callerDistrictID}&c=${callerId}&s=invalid`
    }

  const history = createMemoryHistory();
  history.push(`${location.path}${location.search}`);

    const store = createStore(rootReducer, {
      calls: {
        byId: trackingToken
      }
    });

    const logCallMock = jest.fn();

    logCallMock.mockImplementationOnce(cb => {
      return Promise.resolve();
    })

    const { findByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ThankYou logCall={logCallMock} history={history} location={location} />
        </MemoryRouter>
      </Provider>
    );

    const str = "Your call was added to our count! CCL members, your call was also added to the CCL Action Tracker.";
    await findByText(str);
    expect(logCallMock).toBeCalledTimes(1);
    expect(logCallAmplitude).toHaveBeenCalledWith({ number: 9, state: "WA" });
  });

  test("logCall() not invoked", async () => {

    const location = {
      path: `/call/thankyou`,
      search: `?district=${calledDistrictID}&state=${state}&t=${trackingToken}&d=${callerDistrictID}&c=${callerId}&s=1`
    }

  const history = createMemoryHistory();
  history.push(`${location.path}${location.search}`);

    const store = createStore(rootReducer, {
      calls: {
        byId: trackingToken
      }
    });

    const logCallMock = jest.fn();

    logCallMock.mockImplementationOnce(cb => {
      return Promise.resolve();
    })

    const { findByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ThankYou logCall={logCallMock} history={history} location={location} />
        </MemoryRouter>
      </Provider>
    );

    const str = "How about calling your other Members of Congress?";
    await findByText(str);
    expect(logCallMock).toBeCalledTimes(0);
  });
});
