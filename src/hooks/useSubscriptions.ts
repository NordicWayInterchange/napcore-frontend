import { ExtendedSubscription } from "@/types/subscription";
import { SubscriptionsSubscription } from "@/types/napcore/subscription";
import { useQuery } from "@tanstack/react-query";

const fetchSubscriptions: (
  userName: string
) => Promise<ExtendedSubscription[]> = async (userName: string) => {
  const res = await fetch(`/api/${userName}/subscriptions`);
  if (res.ok) {
    const subscriptions: SubscriptionsSubscription[] = await res.json();
    const seasonedSubscription = subscriptions.map(async (sub) => {
      const fetchNumberOfCapabilities = await fetch(
        `/api/${userName}/capability-count/?selector=${sub.selector}`
      );
      if (fetchNumberOfCapabilities.ok) {
        const data = await fetchNumberOfCapabilities.json();
        return { ...sub, capabilityMatches: data };
      } else {
        console.error(
          `error when fetching ${sub.selector} - ${fetchNumberOfCapabilities.status} - ${fetchNumberOfCapabilities.statusText}`
        );
        return { ...sub, capabilityMatches: 0 };
      }
    });
    return Promise.all(seasonedSubscription);
  }

  const errorObj = await res.json();
  throw new Error(`${errorObj.errorCode}: ${errorObj.message}`);
};

const useSubscriptions = (userName: string) => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => fetchSubscriptions(userName),
  });
};

export { useSubscriptions };
