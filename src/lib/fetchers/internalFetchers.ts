const commonNamePrefix = process.env.NEXT_PUBLIC_INTERCHANGE_PREFIX;

export const createSubscription = (
  actorCommonName: string,
  selector: string
) => {
  const subscriptionsRequest = {
    selector: selector,
  };

  return fetch(`/api/${commonNamePrefix + actorCommonName}/subscriptions`, {
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
  return fetch(
    `/api/${
      commonNamePrefix + actorCommonName
    }/subscriptions/${subscriptionId}`,
    {
      method: "delete",
    }
  );
};

export const createCertificate = (actorCommonName: string, csr: string) => {
  const csrRequest = {
    csr: csr,
  };
  return fetch(`/api/${commonNamePrefix + actorCommonName}/x509/csr`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(csrRequest),
  });
};
