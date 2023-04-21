import { Capability, ExtendedCapability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (
  userName: string
) => Promise<ExtendedCapability[]> = async (userName: string) => {
  const res = await fetch(`/api/${userName}/capabilities`);
  return res.json();
};

const useCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["capabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useCapabilities };
