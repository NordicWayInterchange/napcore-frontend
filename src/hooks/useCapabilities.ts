import { Capabilities } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (userName: string) => Promise<Capabilities> = async (
  userName: string
) => {
  const res = await fetch(`/api/napcore/${userName}/capabilities`);

  return res.json();
};

const useCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["capabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useCapabilities };
