export const downloadKey = (value: string) => {
  // Retrieved from https://stackoverflow.com/a/44661948
  const element = document.createElement("a");
  const file = new Blob([value], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = "privateKey.txt";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};
