import { useQuery } from "@tanstack/react-query";
import { ExtendedCapability } from "@/types/capability";

const fetchMatchingCapabilities: (
  userName: string,
  selector: string
) => Promise<ExtendedCapability[]> = async (userName, selector) => {
  // TODO: remove this
  userName = "anna";

  const res = await fetch(
    `/api/${userName}/network/capabilities?selector=${selector}`
  );

  if (res.ok) {
    const capabilities: ExtendedCapability[] = await res.json();
    return capabilities;
  } else {
    const errorObj = await res.json();
    throw new Error(`${errorObj.errorCode}: ${errorObj.message}`);
  }
};

const useMatchingCapabilities = (userName: string, selector: string) => {
  return useQuery({
    queryKey: ["matchingCapabilities"],
    queryFn: () => fetchMatchingCapabilities(userName, selector),
  });
};

export { useMatchingCapabilities };
