import { Subscription } from "@/types/subscription";

/* TODO
 *   - subValue can be a number (timestamp)
 *   - quadtree reducer
 *   - leading spaces after comma, without any letters (eg. DENM:1.1.2,    )
 *   - Type for generateSelectorParameter
 *   - Write comments
 * */

export const generateSelector = (subscription: any): string => {
  return Object.keys(subscription).reduce(
    (acc: string, key: string, index: number) => {
      const subValue = subscription[key as keyof typeof subscription];
      const subValue2 = Array.isArray(subValue)
        ? subValue
        : subValue.trim().split(",").filter(Boolean);

      if (subValue2.length > 0) {
        if (index && acc) {
          acc += " AND ";
        }
        const reduce = subValue2.reduce(
          (acc: string, value: string, index: number) =>
            reducer(acc, value, index, key),
          ""
        );
        2;
        acc += subValue2.length > 1 ? `(${reduce})` : reduce;
      }

      return acc;
    },
    ""
  );
};

const quadTreeReducer = (quadTree: string[]) => {
  quadTree.reduce((acc, value, index) => {
    if (index != 0) {
      acc += " OR ";
    }
    acc += `quadTree like '%,${value}%'`;
    // TODO () rundt acc
    return acc;
  }, "");
};

const reducer = (
  acc: string,
  value: string,
  index: number,
  key: string
): string => {
  if (value) {
    if (index != 0) {
      acc += " OR ";
    }
    acc += `(${key} = '${value}')`;
  }
  return acc;
};
