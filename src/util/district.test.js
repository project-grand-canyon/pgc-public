import { analyticsName, findDistrictByStateNumber } from "./district";
import districts from "../test/fixtures/districts/districts.json";

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
  it("should find district in single district state", () => {
    const mt0 = districts.filter(
      el => el.state === "MT" && el.number === 0
    )[0]
    expect(findDistrictByStateNumber("MT", 0, districts)).toEqual(mt0);
  });
  it("should find district in multi district state", () => {
    const tx25 = districts.filter(
      el => el.state === "TX" && el.number === 25
    )[0]
    expect(findDistrictByStateNumber("TX", 25, districts)).toEqual(tx25);
  });
});
