import { Subscription } from "@/types/subscription";

export const createSelector = (subscription: Subscription) => {
  let i = 0;

  return Object.keys(subscription).reduce((acc, key, index) => {
    if (subscription[key].length != 0) {
      if (index == 0) {
        acc += `(${key} = '${subscription[key as keyof typeof subscription]}')`;
      } else {
        acc += ` AND (${key} = '${
          subscription[key as keyof typeof subscription]
        }')`;
      }
    }
    return acc;
  }, "");
};

const seperateComma2 = (key2, value) => {
  value = value.split(",");
  value.reduce((acc, key, index) => {
    acc += ` OR (${key2} = '${key}')`;
    return `(${acc})`;
  }, "");
};
