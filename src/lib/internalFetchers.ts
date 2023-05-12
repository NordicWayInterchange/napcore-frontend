export const createSubscription = (
  actorCommonName: string,
  selector: string
) => {
  const subscriptionsRequest = {
    name: actorCommonName,
    subscriptions: [{ selector }],
  };

  // TODO: remove this
  actorCommonName = "anna";

  return fetch(`/api/${actorCommonName}/subscriptions`, {
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
  // TODO: remove this
  actorCommonName = "anna";

  return fetch(`/api/${actorCommonName}/subscriptions/${subscriptionId}`, {
    method: "delete",
  });
};
