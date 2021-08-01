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
  test("advance() invoked when I Called is clicked", async () => {
    const history = createMemoryHistory();
    history.push("/call/wa/-1?t=123456&d=9&c=1234");

    const path = "/call/thankyou";

    const { queryByText, findByText } = render(
      <MemoryRouter>
        <CallIn history={history} logNotification={() => {}} />
        <Route path={path} render={(props) => { 
          return <h1>{props.location.search}</h1>
        }} />
      </MemoryRouter>
    );

    const reportButton = await waitFor(() => findByText("Report Your Call"))
    const search = "?state=WA&district=9&t=123456&d=9&c=1234"
    expect(queryByText(search)).toBeNull();
    fireEvent.click(reportButton);
    await waitFor(() => findByText(search));
    expect(queryByText(search)).toBeDefined();
  });

  test("advance() invoked when Skip is clicked", async () => {
    const history = createMemoryHistory();
    history.push("/call/wa/-1?t=123456&d=9&c=1234");

    const path = "/call/thankyou";

    const { queryByText, findByText } = render(
      <MemoryRouter>
        <CallIn history={history} logNotification={() => {}} />
        <Route path={path} render={(props) => { 
          return <h1>{props.location.search}</h1>
        }} />
      </MemoryRouter>
    );

    const skipButton = await waitFor(() => findByText("Skip this call"))
    const search = "?state=WA&district=9&t=123456&d=9&c=1234&s=1"
    expect(queryByText(search)).toBeNull();
    fireEvent.click(skipButton);
    await waitFor(() => findByText(search));
    expect(queryByText(search)).toBeDefined();
  });

  test("logNotification() invoked on page load", async () => {
    const history = createMemoryHistory();
    history.push("/call/wa/-1?t=123456&d=9&c=1234");

    const expectedCaller = "1234"
    const expectedTrackingId = "123456"
    const expectedDistrict = "9"

    let actualCaller = null;
    let actualTrackingId = null;
    let actualDistrict = null;

    render(
      <MemoryRouter>
        <CallIn history={history} logNotification={(caller, identifier, homeDistrict) => { 
          actualCaller = caller
          actualTrackingId = identifier
          actualDistrict = homeDistrict
         }} />
      </MemoryRouter>
    );

    await waitFor(() => actualCaller != null);
    expect(actualCaller).toBe(expectedCaller)
    expect(actualDistrict).toBe(expectedDistrict)
    expect(actualTrackingId).toBe(expectedTrackingId)
  });

});
