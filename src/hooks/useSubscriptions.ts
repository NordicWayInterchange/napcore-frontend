import { Subscriptions } from "@/types/subscription";
import { useQuery } from "@tanstack/react-query";

const fetchSubscriptions: (userName: string) => Promise<Subscriptions> = (
  userName: string
) => {
  return fetch("http://localhost:3000/api/mock-subscriptions").then((res) => {
    const data = res.json();
    return data;
  });
};

const useSubscriptions = (userName: string) => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => fetchSubscriptions(userName),
  });
};

export { useSubscriptions };
