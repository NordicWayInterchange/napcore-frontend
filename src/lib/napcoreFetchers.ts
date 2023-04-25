import { SubscriptionRequest } from "@/types/napcore/subscription";

const napCoreBaseUrl = process.env.NEXT_PUBLIC_NAPCORE_API_URI;

export const getSubscriptions = (
  actorCommonName: string,
  selector = "",
  pathParam = ""
) => {
  if (pathParam.length > 0) {
    return fetch(
      `${napCoreBaseUrl}/${actorCommonName}/subscriptions/${pathParam}`
    );
  }
  return fetch(
    `${napCoreBaseUrl}/${actorCommonName}/subscriptions/?selector=${selector}`
  );
};

export const createSubscription = (
  userName: string,
  body: SubscriptionRequest
) => {
  return fetch(`${napCoreBaseUrl}/${userName}/subscriptions`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const deleteSubscriptions = (
  actorCommonName: string,
  subscriptionId: string
) => {
  return fetch(
    `${napCoreBaseUrl}/${actorCommonName}/subscriptions/${subscriptionId}`,
    { method: "delete" }
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
