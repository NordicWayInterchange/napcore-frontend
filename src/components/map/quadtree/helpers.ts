import logger from "@/lib/logger";

export const isHashChild = (
  currentHash: any,
  selectedHashes: any[]
): Boolean => {
  let isChild = false;

  selectedHashes.forEach((selectedHash) => {
    if (selectedHash !== currentHash) {
      return;
    }
    if (
      selectedHash.startsWith(currentHash) ||
      currentHash.startsWith(selectedHash)
    ) {
      isChild = true;
      return;
    }
  });

  return isChild;
};
