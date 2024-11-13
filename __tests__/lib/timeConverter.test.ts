import { timeConverter } from "@/lib/timeConverter";

describe("Can correctly convert Unix Epoch", () => {
  const epoch = 1731527848;
  const frenchDate = "13 nov. 2024 - 20:57:28";
  const persianDate = "۲۳ آبان ۱۴۰۳ - ۲۰:۵۷:۲۸";

  it("can convert to correct french date", () => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('fre-FR');
    expect(timeConverter(epoch)).toBe(frenchDate);
  });

  it("can convert to correct persian date", () => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('fa-IR');
    expect(timeConverter(epoch)).toBe(persianDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
