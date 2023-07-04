import { ExtendedCapability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const commonNamePrefix = process.env.NEXT_PUBLIC_INTERCHANGE_PREFIX;

const fetchCapabilities: (
  userName: string,
  selector?: string
) => Promise<ExtendedCapability[]> = async (userName, selector = "") => {
  const res = await fetch(
    `/api/${
      commonNamePrefix + userName
    }/network/capabilities?selector=${selector}`
  );

  if (res.ok) {
    return await res.json();
  } else {
    const errorObj = await res.json();
    throw new Error(`${errorObj.status}: ${errorObj.error}`);
  }
};

const useNetworkCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["networkCapabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useNetworkCapabilities };
