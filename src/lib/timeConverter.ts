/**
 * @Description Converts Unix Epoch to a readable date
 * @param time - Unix Epoch
 * @returns {string} - Readable date
 */
export const timeConverter = (time: number): string => {
  const date = new Date(time * 1000);
  return date.toLocaleDateString("en-GB");
};
