import { Capability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";
import { getNetworkCapabilities } from "@/lib/fetchers";

const fetchCapabilities: (
  userName: string,
  selector?: string
) => Promise<Capability[]> = async (userName, selector = "") => {
  const res = await getNetworkCapabilities(userName, selector);
  return res.json();
};

const useNetworkCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["networkCapabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useNetworkCapabilities };
