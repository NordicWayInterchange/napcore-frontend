const writeToClipboard = (value: string) => {
  // TODO: Promise retured are ignored
  navigator.clipboard.writeText(value);
};
