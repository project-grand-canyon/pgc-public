import getUrlParameter from "./urlparams";

describe("URL Params", () => {
  it("should get present url params", () => {
    const paramValue = getUrlParameter("?a=b", "a")
    expect(paramValue).toBe("b")
  });

  it("should get empty value for url params", () => {
    const paramValue = getUrlParameter("?a=b", "c")
    expect(paramValue).toBe("")
  });

  it("should get value for complicated url params", () => {
    const paramValue = getUrlParameter("?district=9&state=WA&s=1&t=23456&d=1&c=7890", "s")
    expect(paramValue).toBe("1")
  });
});
