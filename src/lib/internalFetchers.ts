export const createSubscription = (userName: string, selector: string) => {
  const subscriptionsRequest = {
    name: userName,
    subscriptions: [{ selector }],
  };
  return fetch(`/api/${userName}/subscriptions`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscriptionsRequest),
  });
};

export const deleteSubscriptions = (
  actorCommonName: string,
  subscriptionId: string
) => {
  return fetch(`/api/${actorCommonName}/subscriptions/${subscriptionId}`, {
    method: "delete",
  });
};
