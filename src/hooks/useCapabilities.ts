import { Capabilities, Capability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

import { getCapabilities } from "@/lib/fetchers";

const fetchCapabilities: (userName: string) => Promise<Capability[]> = async (
  userName: string
) => {
  const res = await getCapabilities(userName);
  return res.json();
};

const useCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["capabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useCapabilities };
