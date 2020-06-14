import * as actions from "./actions";
import * as types from "./actionTypes";

describe("actions", () => {
  it("should create an action to log a call", () => {
    const districtId = 100;
    const actualAction = actions.logCall(districtId);
    expect(actualAction.type).toBe(types.LOG_CALL);
    expect(actualAction.payload).toBeDefined();
    expect(actualAction.payload.districtId).toBe(districtId);
    expect(actualAction.payload.timestamp).toBeCloseTo(Date.now(), -2);
  });
});
