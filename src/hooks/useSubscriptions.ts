import { Subscriptions } from "@/types/subscription";
import { useQuery } from "@tanstack/react-query";

const fetchSubscriptions: (userName: string) => Promise<Subscriptions> = async (
  userName: string
) => {
  const res = await fetch(
    `http://localhost:3000/api/napcore/${userName}/subscriptions`
  );

  return res.json();
};

const useSubscriptions = (userName: string) => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => fetchSubscriptions(userName),
  });
};

export { useSubscriptions };
