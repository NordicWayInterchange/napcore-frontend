import { generateSelector } from "@/lib/generateSelector";

describe("Generate Selector", () => {
  const subscription = {
    messageType: "DENM, IVIM",
    protocolVersion: "DENM:1.1.1",
    originatingCountry: "NO, SE",
    publisherId: "Bouvet-1, Bouvet-2",
    quadTree: ["1", "2", "3", "123"],
  };
  it("can generate select", () => {
    const selector =
      "((messageType = 'DENM') OR (messageType = 'IVIM')) AND " +
      "(protocolVersion = 'DENM:1.1.1') AND " +
      "((originatingCountry = 'NO') OR (originatingCountry = 'SE')) AND " +
      "((publisherId = 'Bouvet-1') OR (publisherId = 'Bouvet-2')) AND " +
      "(quadTree like '%,1%' OR quadTree like '%,2%' OR quadTree like '%,3%' OR quadTree like '%,123%')";
    expect(generateSelector(subscription)).toBe(selector);
  });
});
