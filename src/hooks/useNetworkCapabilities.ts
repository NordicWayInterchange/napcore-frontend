import { ExtendedCapability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (
  userName: string,
  selector?: string
) => Promise<ExtendedCapability[]> = async (userName, selector = "") => {
  // TODO: remove this
  userName = "anna";

  const res = await fetch(
    `/api/${userName}/network/capabilities?selector=${selector}`
  );

  if (res.ok) {
    return res.json();
  } else {
    const errorObj = await res.json();
    throw new Error(`${errorObj.errorCode}: ${errorObj.message}`);
  }
};

const useNetworkCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["networkCapabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useNetworkCapabilities };
