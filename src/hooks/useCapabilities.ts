/*
import { ExtendedCapability } from "@/types/capability";
import { useQuery } from "@tanstack/react-query";

const fetchCapabilities: (
  userName: string
) => Promise<ExtendedCapability[]> = async (userName: string) => {
  const res = await fetch(`/api/${userName}/capabilities`);
  if (res.ok) {
    return res.json();
  } else {
    const errorObj = await res.json();
    throw new Error(`${errorObj.errorCode}: ${errorObj.message}`);
  }
};

const useCapabilities = (userName: string) => {
  return useQuery({
    queryKey: ["capabilities"],
    queryFn: () => fetchCapabilities(userName),
  });
};

export { useCapabilities };
*/
