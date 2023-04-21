import { useQuery } from "@tanstack/react-query";
import { Capability, ExtendedCapability } from "@/types/capability";

const fetchMatchingCapabilities: (
  userName: string,
  selector: string
) => Promise<ExtendedCapability[]> = async (userName, selector) => {
  const res = await fetch(
    `/api/${userName}/network/capabilities?selector=${selector}`
  );
  if (res.ok) {
    const capabilities: ExtendedCapability[] = await res.json();
    return capabilities;
  } else {
    console.error(
      `error when fetching ${selector} - ${res.status} - ${res.statusText}`
    );
    return [];
  }
};

const useMatchingCapabilities = (userName: string, selector: string) => {
  return useQuery({
    queryKey: ["matchingCapabilities"],
    queryFn: () => fetchMatchingCapabilities(userName, selector),
  });
};

export { useMatchingCapabilities };
