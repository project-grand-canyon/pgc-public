import { analyticsName } from "./district";

describe("District Utils", () => {
  it("should make Jr. Senator analytics name", () => {
    expect(analyticsName({ state: "TX", number: -2 })).toBe("TX-Jr Senator");
  });
  it("should make Sr. Senator analytics name", () => {
    expect(analyticsName({ state: "TX", number: -1 })).toBe("TX-Sr Senator");
  });
  it("should make at large analytics name", () => {
    expect(analyticsName({ state: "MT", number: 0 })).toBe("MT-At Large");
  });
  it("should make rep analytics name", () => {
    expect(analyticsName({ state: "MS", number: 1 })).toBe("MS-1");
  });
  it("should make rep analytics name from a string", () => {
    expect(analyticsName({ state: "MS", number: "1" })).toBe("MS-1");
  });
});
