import { ExtendedCapability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (
  userName: string,
  selector?: string
) => Promise<ExtendedCapability[]> = async (userName, selector = "") => {
  const res = await fetch(
    `/api/${userName}/network/capabilities?selector=${selector}`
  );

  if (res.ok) {
    return await res.json();
  } else {
    const errorObj = await res.json();
    console.log("error: ", errorObj);
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
