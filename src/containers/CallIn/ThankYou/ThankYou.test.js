import React from "react";
import { MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, fireEvent, waitFor, waitForDomChange } from "@testing-library/react";
import { logCall as logCallAmplitude } from "../../../util/amplitude";
import "@testing-library/jest-dom/extend-expect";

import { ThankYou } from "ThankYou";

jest.mock("../../../util/axios-api");
jest.mock("../../../util/amplitude");

describe("ThankYou", () => {
  test("logCall() invoked when page is loaded", async () => {
    const history = createMemoryHistory();
    history.push("/call/thankyou?state=wa&district=-1&t=123456&d=9&c=1234");

    const logCallMock = jest.fn();
    render(
      <MemoryRouter>
        <CallIn history={history} logCall={logCallMock} />
      </MemoryRouter>
    );
    await waitForDomChange({
      timeout: 1000
    })
    expect(logCallMock.mock.calls.length).toBe(1);
    expect(logCallAmplitude).toHaveBeenCalledWith({ number: 9, state: "WA" });
  });
});
