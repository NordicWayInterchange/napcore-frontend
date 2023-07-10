import { timeConverter } from "@/lib/timeConverter";

describe("Can correctly convert Unix Epoch", () => {
  const epoch = 1688746452;
  const date = "07/07/2023";

  it("can convert to correct date", () => {
    expect(timeConverter(epoch)).toBe(date);
  });
});
