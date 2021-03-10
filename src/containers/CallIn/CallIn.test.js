import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, fireEvent, waitFor, waitForDomChange } from "@testing-library/react";
import { logCall as logCallAmplitude } from "../../util/amplitude";
import "@testing-library/jest-dom/extend-expect";

import { CallIn } from "./CallIn";

jest.mock("../../util/axios-api");
jest.mock("../../util/amplitude");

describe("CallIn", () => {
  test("logCall() invoked when I Called is clicked", async () => {
    const history = createMemoryHistory();
    history.push("/call/wa/-1?t=123456&d=9&c=1234");

    const path = "/call/thankyou";

    const { queryByText, findByText } = render(
      <MemoryRouter>
        <CallIn history={history} />
        <Route path={path} render={() => { return <h1>It Worked</h1> }} />
      </MemoryRouter>
    );

    const reportButton = await waitFor(() => findByText("I called!"));
    expect(queryByText("It Worked")).toBeNull();
    fireEvent.click(reportButton);
    const itWorked = await waitFor(() => findByText("It Worked"));
    expect(queryByText("It Worked")).toBeDefined();
  });
});
