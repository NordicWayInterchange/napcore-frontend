/*
import { getDeliveries } from "@/lib/napcoreFetchers";
import { Deliveries } from "@/types/napcore/delivery";
import { useQuery } from "@tanstack/react-query";

const fetchDeliveries: (
  userName: string,
  selector?: string
) => Promise<Deliveries> = async (userName, selector = "") => {
  const res = await getDeliveries(userName, selector);
  if (res.ok) {
    return res.json();
  } else {
    const errorObj = await res.json();
    throw new Error(`${errorObj.errorCode}: ${errorObj.message}`);
  }
};

const useDeliveries = (userName: string) => {
  return useQuery({
    queryKey: ["deliveries"],
    queryFn: () => fetchDeliveries(userName),
  });
};

export { useDeliveries };
*/
