import { Capabilities } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (userName: string) => Promise<Capabilities> = (
  userName: string
) => {
  return fetch(
    `http://localhost:3000/api/napcore/${userName}/network/capabilities`
  ).then((res) => {
    return res.json();
  });
};

const useNetworkCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["capabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useNetworkCapabilities };
