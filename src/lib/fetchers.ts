import { SubscriptionRequest } from "@/types/napcore/subscription";

const napCoreBaseUrl = process.env.NEXT_PUBLIC_NAPCORE_API_URI;

export const getSubscriptions = (userName: string) => {
  return fetch(`${napCoreBaseUrl}/${userName}/subscriptions`);
};

export const createSubscription = async (
  userName: string,
  selector: string
) => {
  const subscriptionsRequest = {
    name: userName,
    subscriptions: [{ selector }],
  };
  return await fetch(`${napCoreBaseUrl}/${userName}/subscriptions`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscriptionsRequest),
  });
};

export const deleteSubscription = async (
  userName: string,
  subscriptionId: string
) => {
  return await fetch(
    `${napCoreBaseUrl}/${userName}/subscriptions/${subscriptionId}`,
    {
      method: "delete",
    }
  );
};

export const getNetworkCapabilities = (
  userName: string,
  selector: string = ""
) => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/network/capabilities?selector=${selector}`
  );
};

export const getCapabilities = (userName: string, selector: string = "") => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/capabilities?selector=${selector}`
  );
};

export const getDeliveries = (userName: string, selector: string = "") => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/capabilities?selector=${selector}`
  );
};
