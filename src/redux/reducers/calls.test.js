import reducer from "./calls";
import * as types from "../actionTypes";

const now = Date.now();
const secondsBefore = now - Math.random() * 1000 * 60;
const dayBefore = secondsBefore - 1000 * 60 * 60 * 24;

describe("calls reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      byId: {},
    });
  });

  it("should handle first LOG_CALL", () => {
    expect(
      reducer(undefined, {
        type: types.LOG_CALL,
        payload: {
          districtId: 99,
          timestamp: now,
        },
      })
    ).toEqual({
      byId: {
        99: now,
      },
    });
  });

  it("should handle unrecognized districts LOG_CALL", () => {
    expect(
      reducer({
          byId: {}
      }, {
        type: types.LOG_CALL,
        payload: {
          districtId: 99,
          timestamp: now,
        },
      })
    ).toEqual({
      byId: {
        99: now,
      },
    });
  });

  it("should ignore premature LOG_CALL", () => {
    expect(
      reducer(
        {
          byId: {
            99: secondsBefore,
          },
        },
        {
          type: types.LOG_CALL,
          payload: { districtId: 99, timestamp: now },
        }
      )
    ).toEqual({
      byId: {
        99: secondsBefore, // only update once per 24 hours
      },
    });
  });

  it("should handle LOG_CALL after 24 hours", () => {
    expect(
      reducer(
        {
          byId: {
            99: dayBefore,
          }
        },
        {
          type: types.LOG_CALL,
          payload: {
            districtId: 99,
            timestamp: now,
          },
        }
      )
    ).toEqual({
      byId: {
        99: now
      },
    });
  });

  it("should not modify other districts when handling LOG_CALL", () => {
    expect(
      reducer(
        {
          byId: {
            11: dayBefore,
          }
        },
        {
          type: types.LOG_CALL,
          payload: {
            districtId: 99,
            timestamp: now,
          },
        }
      )
    ).toEqual({
      byId: {
        11: dayBefore,
        99: now
      },
    });
  });
});
