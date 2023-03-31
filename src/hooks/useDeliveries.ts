import { Deliveries } from "@/types/delivieries";
import { useQuery } from "@tanstack/react-query";

const fetchDeliveries: (userName: string) => Promise<Deliveries> = async (
  userName: string
) => {
  const res = await fetch(
    `http://localhost:3000/api/napcore/${userName}/deliveries`
  );

  return res.json();
};

const useDeliveries = (userName: string) => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => fetchDeliveries(userName),
  });
};

export { useDeliveries };
