import { Subscription } from "@/types/subscription";

/* TODO
 *   - subValue can be a number (timestamp)
 *   - quadtree reducer
 *   - leading spaces after comma, without any letters (eg. DENM:1.1.2,    )
 * */

export const generateSelector = (subscription: Subscription): string => {
  return Object.keys(subscription).reduce(
    (acc: string, key: string, index: number) => {
      const subValue = subscription[key as keyof typeof subscription];

      if (subValue.length != 0) {
        if (index != 0 && acc) {
          acc += " AND ";
        }
        if (Array.isArray(subValue)) {
          const reduce = subValue.reduce(
            (acc: string, value: string, index: number) =>
              reducer(acc, value, index, key),
            ""
          );
          acc += subValue.length > 1 ? `(${reduce})` : reduce;
        } else {
          acc += seperateComma(key, subValue);
        }
      }

      return acc;
    },
    ""
  );
};

const seperateComma = (key: string, value: string): string => {
  const formattedValue = value.trim().split(",");
  const reduce = formattedValue.reduce(
    (acc: string, value: string, index: number) =>
      reducer(acc, value, index, key),
    ""
  );
  return formattedValue.length > 1 ? `(${reduce})` : reduce;
};

const reducer = (
  acc: string,
  value: string,
  index: number,
  key: string
): string => {
  if (index != 0) {
    acc += " OR ";
  }
  acc += `(${key} = '${value}')`;
  return acc;
};
