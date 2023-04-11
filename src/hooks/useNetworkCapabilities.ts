import { Capability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (userName: string) => Promise<Capability[]> = async (
  userName: string
) => {
  const res = await fetch(`/api/napcore/${userName}/network/capabilities`);
  return res.json();
};

const useNetworkCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["networkCapabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useNetworkCapabilities };
