import { Subscription } from "@/types/subscription";

/* TODO
 *   - Type for generateSelectorParameter
 * */

export const generateSelector = (formState: any): string => {
  return Object.keys(formState).reduce(
    (acc: string, key: string, index: number) => {
      const value = formState[key as keyof typeof formState];
      const valueArray = Array.isArray(value)
        ? value
        : value.trim().split(",").filter(Boolean);

      if (valueArray.length > 0) {
        if (index && acc) {
          acc += " AND ";
        }
        const reduce = valueArray.reduce(
          (acc: string, value: string, index: number) =>
            reducer(acc, value, index, key),
          ""
        );
        acc += valueArray.length > 1 ? `(${reduce})` : reduce;
      }

      return acc;
    },
    ""
  );
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
    switch (key) {
      case "quadTree":
        acc += `${key} like '%,${value}%'`;
        break;
      default:
        acc += `(${key} = '${value}')`;
    }
  }
  return acc;
};
