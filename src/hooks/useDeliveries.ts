import { Deliveries } from "@/types/delivery";
import { useQuery } from "@tanstack/react-query";

const fetchDeliveries: (userName: string) => Promise<Deliveries> = async (
  userName: string
) => {
  const res = await fetch(`/api/napcore/${userName}/deliveries`);

  return res.json();
};

const useDeliveries = (userName: string) => {
  return useQuery({
    queryKey: ["deliveries"],
    queryFn: () => fetchDeliveries(userName),
  });
};

export { useDeliveries };
