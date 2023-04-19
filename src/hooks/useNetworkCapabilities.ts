import { Capability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (
  userName: string,
  selector?: string
) => Promise<Capability[]> = async (userName, selector = "") => {
  const res = await fetch(
    `/api/${userName}/network/capabilities?selector=${selector}`
  );
  return res.json();
};

const useNetworkCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["networkCapabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useNetworkCapabilities };
