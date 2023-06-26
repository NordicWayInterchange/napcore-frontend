export const timeConverter = (time: any): string => {
  const date = new Date(time * 1000);
  return date.toLocaleDateString("en-GB");
};
