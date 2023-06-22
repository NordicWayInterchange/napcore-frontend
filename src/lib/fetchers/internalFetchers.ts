export const createSubscription = (
  actorCommonName: string,
  selector: string
) => {
  const subscriptionsRequest = {
    selector: selector,
  };

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
  return fetch(`/api/${actorCommonName}/subscriptions/${subscriptionId}`, {
    method: "delete",
  });
};

export const createCertificate = (actorCommonName: string, csr: string) => {
  const csrRequest = {
    csr: csr,
  };
  return fetch(`/api/${actorCommonName}/certificates`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(csrRequest),
  });
};
