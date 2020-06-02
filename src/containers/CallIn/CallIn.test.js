import React from "react";
import { MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { CallIn } from "./CallIn";

jest.mock("../../util/axios-api");

test("logCall() invoked when I Called is clicked", async () => {
  const history = createMemoryHistory();
  history.location.pathname = "/call/wa/-1";
  history.location.search = "t=123456&d=9&c=1234";

  const logCallMock = jest.fn();
  const { findByText } = render(
    <MemoryRouter>
      <CallIn history={history} logCall={logCallMock} />
    </MemoryRouter>
  );

  expect(logCallMock.mock.calls.length).toBe(0);
  const reportButton = await waitFor(() => findByText("I called!"), {
    timeout: 5000,
  });
  fireEvent.click(reportButton);
  expect(logCallMock.mock.calls.length).toBe(1);
});
