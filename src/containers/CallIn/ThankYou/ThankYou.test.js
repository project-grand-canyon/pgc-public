import React from "react";
import { MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, fireEvent, waitFor, waitForDomChange } from "@testing-library/react";
import { logCall as logCallAmplitude } from "../../../util/amplitude";
import "@testing-library/jest-dom/extend-expect";

import { ThankYou } from "./ThankYou";

jest.mock("../../../util/axios-api");
jest.mock("../../../util/amplitude");

describe("CallIn", () => {
  test("logCall() invoked when I Called is clicked", async () => {

    // TODO: Make this test work!

    /*const history = createMemoryHistory();
    history.push("/call/wa/-1?t=123456&d=9&c=1234");

    const logCallMock = jest.fn();
    render(
      <MemoryRouter>
        <ThankYou history={history} logCall={logCallMock} />
      </MemoryRouter>
    );

    await waitForDomChange({
      timeout: 1000
    });

    expect(logCallMock.mock.calls.length).toBe(1);
    expect(logCallAmplitude).toHaveBeenCalledWith({ number: 9, state: "WA" });*/
  });
});
