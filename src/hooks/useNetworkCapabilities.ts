import { Capabilities } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (userName: string) => Promise<Capabilities> = (
  userName: string
) => {
  return fetch(`/api/napcore/${userName}/network/capabilities`).then((res) => {
    return res.json();
  });
};

const useNetworkCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["networkCapabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useNetworkCapabilities };
