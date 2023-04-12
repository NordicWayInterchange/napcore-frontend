import { Deliveries } from "@/types/delivery";
import { useQuery } from "@tanstack/react-query";
import { getDeliveries } from "@/lib/fetchers";

const fetchDeliveries: (
  userName: string,
  selector?: string
) => Promise<Deliveries> = async (userName, selector = "") => {
  const res = await getDeliveries(userName, selector);
  return res.json();
};

const useDeliveries = (userName: string) => {
  return useQuery({
    queryKey: ["deliveries"],
    queryFn: () => fetchDeliveries(userName),
  });
};

export { useDeliveries };
